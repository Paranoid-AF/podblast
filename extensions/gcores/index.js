global.registerSource({
  id: 'gadio',
  name: 'Gadio',
  preForm: () => {
    return global;
  }
});
global.registerSource({
  id: 'gadionews',
  name: require('./myString')
});
global.registerSource({
  id: 'gadiopro',
  name: 'Gadio Pro'
});

module.exports = require('axios')
