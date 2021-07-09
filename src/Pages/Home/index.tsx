import React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from '../../common/rematch'
import PageBase from '../../Components/PageBase'

function Home(props: DispatchProps) {
  return (
    <PageBase title="Podblast">
      <React.Fragment>
        <p>
        <button
          onClick={
            () => {
              props.setUpUserAgent(`Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0 Safari/605.1.15`)
              props.setUpProxy('rss')
                .then(() => {
                  props.startPlaying({
                    url: 'https://www.youtube.com/watch?v=JQIcUBd-5fk',
                    nowPlayingPage: 'https://www.openstreetmap.org/export/embed.html?bbox=-0.004017949104309083%2C51.47612752641776%2C0.00030577182769775396%2C51.478569861898606&layer=mapnik',
                    coverArt: 'https://i.ytimg.com/vi/JQIcUBd-5fk/hqdefault.jpg?sqp=-oaymwEcCPYBEIoBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLCDDwOQ1-viPim0ewEk0lf5RbxpZw',
                    title: 'Pessimism is *literally* for losers.',
                    channel: 'Luke Smith'
                  })
                })
            }
          }
        >
          YouTube Test
        </button>
        <button
          onClick={
            () => {
              props.setUpUserAgent(`Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0 Safari/605.1.15`)
              props.setUpProxy('gcores')
                .then(() => {
                  props.startPlaying({
                    url: 'https://alioss.gcores.com/uploads/audio/e082fd39-cf09-4139-9241-fbc34fd24787.mp3',
                    nowPlayingPage: 'https://www.gcores.com/radios/111117',
                    coverArt: 'https://image.gcores.com/d07f4653-7c59-4776-a814-9a93d4c96c68.jpg?x-oss-process=image/resize,limit_1,m_fill,w_280,h_280/quality,q_90',
                    title: '《玲音》的诞生与创作《玲音》的人',
                    channel: '特别二次元'
                  })
                })
            }
          }
        >
          Audio Test
        </button>
        </p>
        <p>
          <button onClick={() => {alert(l('TEST_LOCALE_STRING_INSTANT'))}}>Test Locale</button>
          <button onClick={() => {alert(l('TEST_LOCALE_STRING_INSTANT', ['a', 'b', 'c', 'd']))}}>Test Locale with Params</button>
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