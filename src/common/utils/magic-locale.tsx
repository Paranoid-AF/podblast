import React, { FunctionComponent, Fragment } from 'react'
import { connect } from 'react-redux'
import { RootState, Dispatch } from'../rematch'
import { store } from '../rematch'
export interface Props {
  children: string,
  language: string,
}

// TODO: Make this actually functional.
function getLocaleText(localeString: string, language: string) {
  return localeString + '_' + language
}

const LocaleProvider: FunctionComponent<Props> = (props: Props) => {
  return (
    <Fragment>
      {getLocaleText(props.children, props.language)}
    </Fragment>
  )
}

const mapState = (state: RootState) => ({
  language: state.app.config.data['app.language'],
})

window['Locale'] = connect(mapState)(LocaleProvider)

window['l'] = function(localeString: string) {
  const language = store.getState().app.config.data['app.language']
  return getLocaleText(localeString, language)
}
