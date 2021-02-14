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
              props.setUpUserAgent(`Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0 Safari/605.1.15`)
              props.setUpProxy('gcores')
                .then(() => {
                  props.startPlaying({
                    url: 'https://alioss.gcores.com/uploads/audio/f66f9880-d1f8-4166-942c-af8f66383040.mp3',
                    nowPlayingPage: 'https://www.openstreetmap.org/export/embed.html?bbox=-0.004017949104309083%2C51.47612752641776%2C0.00030577182769775396%2C51.478569861898606&layer=mapnik'
                  })
                })
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
  startPlaying: dispatch.player.startPlaying,
  setUpProxy: dispatch.player.setUpProxy,
  setUpUserAgent: dispatch.player.setUpUserAgent
})

type DispatchProps = ReturnType<typeof mapDispatch>

export default connect(null, mapDispatch)(Home)