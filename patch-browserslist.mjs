import highland from 'highland'
import {readdir, stat, readFile, writeFile} from 'fs/promises'
import {basename, join} from 'path'

const _ = xs => highland(xs)
const prepend = path => filename => join(path, filename)

const BROWSERSLIST = 'node 14.4.0' // some new version that doesn't need any transpilation
const EXCLUDED_PATHS = [
  'node_modules/core-js',
  'node_modules/core-js-compat',
]

// TODO: possibly re-implement via `yarn list --frozen-lockfile --json`

const findPackageJsons = (...paths) =>
  _(paths)
    .filter(path => !EXCLUDED_PATHS.includes(path))

    .map(async path => ({path, pathStat: await stat(path)}))
    .flatMap(_)

    .flatMap(({path, pathStat}) => {
      if (pathStat.isFile() && basename(path) === 'package.json') {
        return _([path])
      }
      if (pathStat.isDirectory()) {
        const filenames = _(readdir(path)).sequence();
        const paths = filenames.map(prepend(path));
        return paths.flatMap(findPackageJsons)

      }
      return _([])
    })

const patch = overrideContents => path =>
  _([path])
    .map(async path => ({path, stringContents: await readFile(path)}))
    .flatMap(_)

    .map(({path, stringContents}) => ({path, contents: JSON.parse(stringContents)}))
    .map(({path, contents}) => ({path, contents: {...contents, ...overrideContents}}))
    .map(({path, contents}) => ({path, stringContents: JSON.stringify(contents, null, 2)}))
    .map(async ({path, stringContents}) => {
      await writeFile(path, stringContents)
      return path
    })
    .flatMap(_)

const args = Array.from(process.argv).slice(2)
findPackageJsons(...args)
  .flatMap(patch({browserslist: BROWSERSLIST}))
  .tap(file => console.log(`Updated browserslist in ${file}`))
  .done(() => {
    console.log(`All browserslist entries have been updated.`)
  })
