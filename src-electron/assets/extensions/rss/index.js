const podchat = require('podchat')
podchat.registerSource({
  id: 'rss',
  name: 'RSS',
  preForm: function() {
    return 'bruh'
  },
  icon: 'icon.png'
});
