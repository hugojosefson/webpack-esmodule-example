import Config from '@hugojosefson/env-config'

/**
 * Keys, and corresponding default values in case they are not in env.
 */
export const defaultValues = {
  START_COUNT: 0,
}

/**
 * These are the keys to include from env.
 * @type {string[]}
 */
export const keys = Object.keys(defaultValues)

export default ({ source } = {}) =>
  Config({ source, keys, transformer: c => ({ ...defaultValues, ...c }) })
