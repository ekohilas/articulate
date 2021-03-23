import logo from './logo.svg';
import './App.css';
import * as main from './api/main';
import * as api from './api/api';
import { useState, useEffect } from "react";
import words from './static/words.json';
import articulate from './images/articulate.jpeg';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ButtonGroup from 'react-bootstrap/ButtonGroup';


function App() {
  const [game, setGame] = useState(null);
  const [timeLeft, setTimeLeft] = useState(-1);
  const [playStatus, setPlayStatus] = useState(false);
  const [numTeams, setNumTeams] = useState('2');

  const radios = [
    { name: '2', value: '2' },
    { name: '3', value: '3' },
    { name: '4', value: '4' },
  ];
  var timer;

  useEffect(() => {
    if (timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000);
    }
    else if (timeLeft == 0 && playStatus == true) {
      setPlayStatus(false);
      game.end_turn();
    }
    console.log('time left', timeLeft)
  }, [timeLeft]);

  const startRound = () => {
    setPlayStatus(true);
    setTimeLeft(10);
  }
  
  const endTurn = () => {
    clearTimeout(timer);
    setTimeLeft(0); // this causes the game to end turn due to useEffect
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={articulate} className="App-logo" alt="logo" />

          <div>
            Number of Teams
            <ButtonGroup toggle>
              {radios.map((radio, idx) => (
                <ToggleButton
                  key={idx}
                  type="radio"
                  variant="secondary"
                  name="radio"
                  value={radio.value}
                  checked={numTeams === radio.value}
                  onChange={(e) => setNumTeams(e.currentTarget.value)}
                >
                  {radio.name}
                </ToggleButton>
              ))}
            </ButtonGroup>
          </div>

          {game === null && 
            <button onClick={() => {
              setGame(main.start_game(words, numTeams));
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
        : 
          <div>
            <h1>Time Remaining: {timeLeft}</h1>

            <div id='controls'>
              {/* <button id='start'>Start</button> */}
              <button id='defer' onClick={() => game.defer_word()}>Skip</button>
              <button id='win' onClick={() => game.win_word()}>Win</button>
              {/* <button id='discard' onClick={() => game.discard_word()} >Discard</button> */}
              <button id='end' onClick={() => endTurn()}>End</button>
            </div>
          </div>
        }

        <pre id='words'>
        </pre>

      </header>
    </div>
  );
}

export default App;
