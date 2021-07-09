import { store } from '../rematch'

// TODO: Make this actually functional.
function getLocaleText(localeString: string, language: string, replaceStrings?: string[]) {
  if(replaceStrings) {
    return localeString + '_' + language + '_' + replaceStrings.join('_')
  } else {
    return localeString + '_' + language
  }
}

window['l'] = function(localeString: string, replaceStrings?: string[]) {
  const language = store.getState().app.config.data['app.language']
  return getLocaleText(localeString, language, replaceStrings)
}
