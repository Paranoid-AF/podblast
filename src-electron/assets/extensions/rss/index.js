var podblast = require('podblast-extension-kit')
podblast.registerSource({
  id: 'rss',
  name: 'RSS',
  preForm: function() {
    return [
      {
        id: 'url',
        name: 'Target URL',
        type: 'INPUT'
      },
      {
        id: 'test1',
        name: '选项测试',
        type: 'SELECT',
        optional: true,
        field: [
          {
            description: '我是选项1',
            value: 'option1'
          },
          {
            description: '我是选项2',
            value: 'option2',
            isDefault: true
          },
          {
            description: '我是选项3',
            value: 'option3'
          }
        ]
      },
      {
        id: 'test2',
        name: '多选测试',
        type: 'CHECK',
        field: [
          {
            description: '我是选项1',
            value: 'option1',
            isDefault: true
          },
          {
            description: '我是选项2',
            value: 'option2'
          },
          {
            description: '我是选项3',
            value: 'option3',
            isDefault: true
          }
        ]
      },
      {
        id: 'test3',
        name: '单选测试',
        type: 'RADIO',
        field: [
          {
            description: '我是选项1',
            value: 'option1',
            isDefault: true
          },
          {
            description: '我是选项2',
            value: 'option2'
          },
          {
            description: '我是选项3',
            value: 'option3'
          }
        ]
      },
    ]
  },
  postForm: function(data) {
    console.log(data)
    return {
      name: 'Test RSS Source',
      key: 'foo'
    }
  },
  icon: 'icon.png'
});
