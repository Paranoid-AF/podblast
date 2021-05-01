var podblast = require('podblast-extension-kit')
podblast.registerSource({
  id: 'rss',
  name: 'RSS',
  preForm: function() {
    return [
      {
        id: 'url',
        name: 'Target URL',
        type: 'INPUT',
        placeholder: '输入要订阅的 RSS 源地址',
        defaultValue: 'https://pythonhunter.org/episodes/feed.xml'
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
  /*
export interface SourceResult {
  title: string,
  description?: string,
  cover_color?: string, // HEX
  cover_pic?: string, // Base64
  params: Record<string, any>, // Provided automatically, ignore for extensions.
  additionalInfo: string
}
  */
  postForm: function(data) {
    console.log(data)
    return {
      title: 'Test RSS Subscription',
      description: 'This is a subscription for testing purpose.',
      additionalInfo: 'foo'
    }
  },
  icon: 'icon.png'
});
