import StyleDictionary from 'style-dictionary'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { TOKEN_DIRECTORY } from '../utilities/index.mjs'

/**
 * Finalize the CommonJS build under `js/cjs/`. The package root is `"type": "module"`, so the bare-`.js`
 * CJS output needs two fixes to be correct:
 *   1. a nested `package.json` marking the directory as CommonJS — otherwise its `module.exports` output
 *      is misread as ESM ("unexpected module syntax" / require-resolves-to-ESM);
 *   2. the declaration must use `export =` (not `export default`) to match `module.exports =` — otherwise
 *      node16 CJS consumers would wrongly need a `.default` access (attw FalseExportDefault).
 * Runs as a post-build action on the JS platform, after its files are written.
 */
StyleDictionary.registerAction({
  name: 'finalize-cjs-build',
  do: async () => {
    const dir = `${TOKEN_DIRECTORY}/js/cjs`
    await mkdir(dir, { recursive: true })
    await writeFile(`${dir}/package.json`, JSON.stringify({ type: 'commonjs' }, null, 2) + '\n', 'utf-8')
    const dtsPath = `${dir}/index.d.ts`
    const dts = await readFile(dtsPath, 'utf-8')
    await writeFile(dtsPath, dts.replace(/export default (\w+);/, 'export = $1;'), 'utf-8')
  },
  undo: async () => {},
})

/**
 * JavaScript Variables
 *
 * Important: Every exported file in this platform key **must** have a corresponding TypeScript declaration export.
 */
export default {
  buildPath: `${TOKEN_DIRECTORY}/js/`,
  transforms: [
    'attribute/cti',
    'name/constant',
    'color/css',
  ],
  files: [
    // JavaScript ES6 constants
    {
      format: 'javascript/es6',
      destination: 'index.mjs',
      // Exclude alias tokens and asset tokens compiled in a separate file
      filter: (token) => token.isSource === true && token.attributes.category !== 'asset' && token.$type !== 'component',
    },
    // Constants TypeScript types
    {
      format: 'typescript/es6-declarations',
      destination: 'index.d.ts',
      options: {
        outputStringLiterals: true,
      },
      // Exclude alias tokens and asset tokens compiled in a separate file
      filter: (token) => token.isSource === true && token.attributes.category !== 'asset' && token.$type !== 'component',
    },
    // JavaScript CommonJS
    {
      format: 'javascript/module-flat',
      destination: 'cjs/index.js',
      // Exclude alias tokens and asset tokens compiled in a separate file
      filter: (token) => token.isSource === true && token.attributes.category !== 'asset' && token.$type !== 'component',
    },
    // CommonJS types
    {
      format: 'typescript/module-declarations',
      destination: 'cjs/index.d.ts',
      options: {
        outputStringLiterals: true,
      },
      // Exclude alias tokens and asset tokens compiled in a separate file
      filter: (token) => token.isSource === true && token.attributes.category !== 'asset' && token.$type !== 'component',
    },
  ],
  // Mark js/cjs/ as CommonJS + fix its declaration to `export =` (the package root is `"type": "module"`).
  actions: ['finalize-cjs-build'],
}
