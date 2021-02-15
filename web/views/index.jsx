import React from 'react';
import { transparent } from './../../Util/canvas.js'; 

class App extends React.Component {
  
  render() {
    return <>
			<link rel="stylesheet" href="web/public/styles.css" />
      <div className="App">
        <header className="App-header">
          <img src="web/public/logo.jpg" className="App-logo" alt="logo"/>
          <p>
            DUCK
          </p>
        </header>
      </div>
    </>;
  }
}

export default App;