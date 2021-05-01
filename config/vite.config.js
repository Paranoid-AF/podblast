const LessConfig = require('./less.config');
const svgr = require('vite-plugin-svgr');
export default {
  root: 'src',
  css: {
    preprocessorOptions: {
      less: LessConfig,
    },
  },
  plugins: [
    svgr(),
  ],
};