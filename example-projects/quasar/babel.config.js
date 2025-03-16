// This file runs in a Node context

/**
 * @param {object} api - Babel API
 * @returns {object} Babel configuration
 */
export default function babelConfig(api) {
  return {
    presets: [
      [
        '@babel/preset-env',
        {
          modules: false,
          useBuiltIns: 'usage',
          corejs: 3,
          targets: api.caller(caller => caller && caller.target === 'node')
            ? { node: 'current' }
            : { browsers: ['last 2 versions', 'not dead', 'not IE 11'] }
        }
      ]
    ]
  }
}
