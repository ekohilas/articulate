import logo from './logo.svg';
import './App.css';
import * as main from './api/main';
import * as api from './api/api';
import { useState } from "react";
import words from './static/words.json'

function App() {
  const [game, setGame] = useState(null);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <button onClick={() => {
          setGame(main.start_game(words));
        }}> Start </button>
        <button onClick={() => console.log(game)}>Print Game State</button>
        
        {/* below is just dummy testing stuff*/}
        <div id='state'>
            <div id='timer'></div>
            <div id='board'>
                <div id='category'></div>
                <div id='position'></div>
            </div>
            <pre id='teams'></pre>
        </div>

        {game !== null && 
          <div id='controls'>
              {/* <button id='start'>Start</button> */}
              <button id='defer' onClick={() => game.defer_word()}>Skip</button>
              <button id='win' onClick={() => game.win_word()}>Win</button>
              {/* <button id='discard' onClick={() => game.discard_word()} >Discard</button> */}
              <button id='end' onClick={() => game.end_turn()}>End</button>
          </div>
        }
        <pre id='words'>
        </pre>

      </header>
    </div>
  );
}

export default App;
