/**
 * Resolves something asynchronously import():ed, into a Promise of the expected module.
 *
 * That is the default export if that's all there is, or the whole module if there are more exports.
 *
 * @param imported
 * @returns {Promise<*>}
 */
export const resolve = async imported => {
  if (imported == null) {
    throw new Error(`Did you just import ${JSON.stringify(imported)}?`)
  }

  if (typeof imported.then === 'function') {
    return await resolve(await imported)
  }

  if (typeof imported === 'object') {
    const keys = Object.keys(imported)
    if (keys.length === 1 && keys[0] === 'default') {
      return await resolve(imported.default)
    }
  }

  return imported
}
