import logo from './logo.svg';
import './App.css';
import * as main from './api/main';
import * as api from './api/api';
import { useState, useEffect } from "react";
import words from './static/words.json'

function App() {
  const [game, setGame] = useState(null);
  const [timeLeft, setTimeLeft] = useState(-1);
  const [playStatus, setPlayStatus] = useState(false);

  useEffect(() => {
    if (timeLeft > 0) {
      setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
    }
    else if (timeLeft == 0 && playStatus == true) {
      setPlayStatus(false);
      game.end_turn();
    }
  }, [timeLeft]);

  const startRound = () => {
    setPlayStatus(true);
    setTimeLeft(10);
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        {game === null && 
          <button onClick={() => {
            setGame(main.start_game(words));
          }}> Create Game </button>
        }
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

        {playStatus == false ? 
          <div>
            <button onClick={() => startRound()}>Start Round</button>
          </div>
        : <h1>Time Remaining: {timeLeft}</h1>
        }


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
