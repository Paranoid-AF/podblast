global.registerSource({
  id: 'gadio',
  name: 'Gadio',
  preForm: () => {
    return global;
  }
});
global.registerSource({
  id: 'gadionews',
  name: require('./myString'),
  preForm: async function() {
    return new Promise((resolve, reject) => {
      resolve([
        {
          id: 'news-type',
          name: '新闻类型',
          type: 'SELECT',
          field: [
            {
              description: '一起来Lu二次元',
              value: 'lu2'
            },
            {
              description: 'Gadio News Pro',
              value: 'news-pro'
            }
          ]
        }
      ])
    })
  },
  postForm: async function(data) {
    return new Promise((resolve) => {
      resolve('l33t' + JSON.stringify(data))
    })
  }
});
global.registerSource({
  id: 'gadiopro',
  name: 'Gadio Pro'
});

module.exports = require('axios')
