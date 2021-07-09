import React from 'react'
import { store } from '../rematch'

const targetMatch = /\{\{\d\}\}/g
const i18nData: Record<string, Record<string, string>> = {}

function getLanguageData(language: string, localeString: string): string | undefined {
  if(typeof i18nData[language] === 'undefined') {
    // TODO: Make this actually functional.
    i18nData[language] = {
      'TEST_LOCALE_STRING_INSTANT': '测试 {{1}} 本地化 {{2}} 文本'
    }
    return getLanguageData(language, localeString)
  }
  return i18nData[language][localeString]
}

export function getLocaleText(localeString: string, language: string, replaceStrings?: string[]): string[];
export function getLocaleText(localeString: string, language: string, replaceStrings?: Array<string | React.ComponentType | JSX.Element>): Array<string | React.ComponentType | JSX.Element>

export function getLocaleText(localeString: string, language: string, replaceStrings?: string[] | Array<string | React.ComponentType | JSX.Element>) {
  const target = getLanguageData(language, localeString)
  if(typeof target === 'undefined') {
    return ['{{ERROR_I18N_NOT_FOUND}}']
  }

  let lastSubStringPosition = 0
  let currentItemIndex = 0
  const result = []
  const matchResult = target.matchAll(targetMatch)
  for(let item of matchResult) {
    const currentString = target.substring(lastSubStringPosition, item.index || lastSubStringPosition)
    if(currentString.length > 0) {
      result.push(currentString)
    }
    if(replaceStrings) {
      result.push(replaceStrings[currentItemIndex])
    } else {
      result.push(`{{ERROR_I18N_PARAM_MISSING_${currentItemIndex}}}`)
    }
    currentItemIndex++
    lastSubStringPosition = (item.index || 0) + item[0].length
  }
  const tailString = target.substring(lastSubStringPosition, target.length)
  if(tailString.length > 0) {
    result.push(tailString)
  }
  
  return result
}

window['lang'] = function(localeString: string, replaceStrings?: Array<any>) {
  const language = store.getState().app.config.data['app.language']
  return getLocaleText(localeString, language, replaceStrings)
}
