window.init({ name: 'YetAnotherExtension', id: 'ziang', version: '2.5.1' });
window.registerSource({
  id: 'safgwavfbwa',
  name: '内核恐慌',
  preForm: () => {
    return window;
  }
});
window.registerSource({
  id: 'musicbandhblg',
  name: '华北浪革',
  postForm: () => { return require('axios')('https://www.github.com') }
});
module.exports = window.getLocale(); 
