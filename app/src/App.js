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

        {/* below is just dummy stuff so js can find the id of the button */}
        <button id="ready"></button>
        <button id="timer"></button>

      </header>
    </div>
  );
}

export default App;
