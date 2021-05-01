const LessConfig = require('./less.config');
const svgr = require('vite-plugin-svgr');
const reactRefresh = require('@vitejs/plugin-react-refresh');
export default {
  root: 'src',
  css: {
    preprocessorOptions: {
      less: LessConfig,
    },
  },
  plugins: [
    svgr(),
    reactRefresh(),
  ],
};