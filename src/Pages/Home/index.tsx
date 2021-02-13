import React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from '../../common/rematch'
import PageBase from '../../Components/PageBase'

function Home(props: DispatchProps) {
  return (
    <PageBase title="Podchat">
      <React.Fragment>
        Welcome back home!
        <button onClick={() => { window.electron.invoke('player', { action: 'togglePlayerWindow', payload: true }) }}>Show PIP</button>
        <button onClick={() => { window.electron.invoke('player', { action: 'togglePlayerWindow', payload: false }) }}>Hide PIP</button>
        <p>
        <button
          onClick={
            () => {
              props.startPlaying('https://www.youtube.com/watch?v=qy_S2i-A7sM')
            }
          }
        >
          Rickroll
        </button>
        </p>
      </React.Fragment>
    </PageBase>
  )
}


const mapDispatch = (dispatch: Dispatch) => ({
  startPlaying: dispatch.player.startPlaying
})

type DispatchProps = ReturnType<typeof mapDispatch>

export default connect(null, mapDispatch)(Home)