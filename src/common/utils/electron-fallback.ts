let isInjected = false
function injectNotice() {
  if(!isInjected) {
    isInjected = true
    document.body.innerHTML = `
      <style>
        body {
          margin: 20px;
          background: #fff;
        }
      </style>
      <h1>You're not supposed to be here!</h1>
      <p>This page is not supposed to be opened in browser, since it requires functionalities that's built inside the Electron client.</p>
      <p>Go ahead and open it in the Electron client instead, to do that, use <b><code>npm run start:core</code></b></p>
      <p>Alternatively, you can shutdown the server, and use <b><code>npm start</code></b> to start the dev server and the Electron client simultaneously.</p>
      <hr />
      <i>The Podblast Project</i>
    `
  }
}

if(typeof window.electron === 'undefined') {
  window.electron = {
    on: injectNotice as any,
    invoke: injectNotice as any,
    isDummy: true
  }
  injectNotice();
}

export default {}