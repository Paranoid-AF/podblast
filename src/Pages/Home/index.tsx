import React from 'react'
import PageBase from '../../Components/PageBase'

function Home() {
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
              window.electron.invoke('player', {
                action: 'setParams',
                payload: {
                  url: 'https://www.youtube.com/watch?v=DLzxrzFCyOs'
                }
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

export default Home