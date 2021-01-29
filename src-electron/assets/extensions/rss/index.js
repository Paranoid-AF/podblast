const podchat = require('podchat-extension-kit')
podchat.registerSource({
  id: 'rss',
  name: 'RSS',
  preForm: function() {
    return 'bruh'
  },
  icon: 'icon.png'
});
