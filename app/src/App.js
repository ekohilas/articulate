import logo from './logo.svg';
import './App.css';
import * as main from './api/main';
import { useState } from "react";
import words from './static/words.json'

function App() {

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <button onClick={() => main.start_game(words)}> Start </button>

        {/* below is just dummy testing stuff*/}
        <div id='state'>
            <div id='timer'></div>
            <div id='board'>
                <div id='category'></div>
                <div id='position'></div>
            </div>
            <pre id='teams'></pre>
        </div>
        <div id='controls'>
            <button id='start'>Start</button>
            <button id='defer'>Defer</button>
            <button id='win'>Win</button>
            <button id='discard'>Discard</button>
            <button id='ready'>Ready</button>
            <button id='end'>End</button>
        </div>
        <pre id='words'>
        </pre>

      </header>
    </div>
  );
}

export default App;
