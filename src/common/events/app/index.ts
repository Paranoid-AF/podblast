const events: Record<string, (...args: Array<any>) => void> = {}

events['config_update'] = (event, payload) => {
  const result = JSON.parse(payload)
  console.log(result)
}

export default events