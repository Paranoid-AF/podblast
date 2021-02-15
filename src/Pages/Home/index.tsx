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
                    url: 'https://www.youtube.com/watch?v=JQIcUBd-5fk',
                    nowPlayingPage: 'https://www.openstreetmap.org/export/embed.html?bbox=-0.004017949104309083%2C51.47612752641776%2C0.00030577182769775396%2C51.478569861898606&layer=mapnik',
                    coverArt: 'https://assets.fireside.fm/file/fireside-images/podcasts/images/b/bcdeb9eb-7a8c-4a76-a424-1023c5d280b0/cover_small.jpg?v=3',
                    title: 'Pessimism is *literally* for losers.',
                    channel: 'Luke Smith'
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