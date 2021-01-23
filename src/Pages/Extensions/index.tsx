import React from 'react'
import { RootState, Dispatch } from'../../common/rematch'
import { connect } from 'react-redux'

import PageBase from '../../Components/PageBase'

function Extensions(props: StateProps & DispatchProps) {
  console.log(props)
  return (
    <PageBase title="Extensions">
      
    </PageBase>
  )
}

const mapState = (state: RootState) => ({
  extensions: state.extension.extensionList,
  sources: state.extension.sourceList
})

const mapDispatch = (dispatch: Dispatch) => ({
  windowControls: {
    maximize: () => dispatch.appWindow.maximize(),
    minimize: () => dispatch.appWindow.minimize(),
    restore: () => dispatch.appWindow.restore(),
    close: () => dispatch.appWindow.close()
  }
})

type StateProps = ReturnType<typeof mapState>
type DispatchProps = ReturnType<typeof mapDispatch>

export default connect(mapState, mapDispatch)(Extensions)