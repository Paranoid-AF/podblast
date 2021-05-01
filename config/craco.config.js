const CracoLessPlugin = require('craco-less');
const LessConfig = require('./less.config');
module.exports = {
  webpack: {
    entry: './src/index.tsx'
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