const { ESLINT_MODES } = require("@craco/craco");
const CracoLessPlugin = require('craco-less');
const LessConfig = require('./less.config');
const readFileSync = require('fs').readFileSync;
const pathJoin = require('path').join;
module.exports = {
  webpack: {
    entry: './src/index.tsx'
  },
  eslint: {
    mode: ESLINT_MODES.extends,
    configure: () => {
      // Workaround for broken ESLINT_MODES.file mode
      return JSON.parse(readFileSync(pathJoin(__dirname, '../.eslintrc'), { encoding: 'utf-8' }))
    }
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: LessConfig,
        },
      },
    },
  ],
};