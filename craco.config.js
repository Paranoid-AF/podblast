const CracoLessPlugin = require('craco-less');

module.exports = {
  webpack: {
    entry: './src/view/index.tsx'
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { '@primary-color': '#1DA57A' },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};