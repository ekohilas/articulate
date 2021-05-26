import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import * as main from './api/main';
import { useState, useEffect } from "react";
import GameBoard from './components/GameBoard';
import words from './static/words.json';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';


function App() {
  const [game, setGame] = useState(null);
  const [numTeams, setNumTeams] = useState('2');

  const radios = [
    { name: '2', value: '2' },
    { name: '3', value: '3' },
    { name: '4', value: '4' },
  ];
  const restartGame = () => {
    setGame(main.start_game(words, numTeams));
    console.log('restarting game');
  }

  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={articulate} className="App-logo" alt="logo" /> */}

          {game === null &&

          <div className="game-options">
            <div>
              Number of Teams
            </div>

            <ButtonGroup toggle size="lg">
              {radios.map((radio, idx) => (
                <ToggleButton
                  key={idx}
                  type="radio"
                  variant="secondary"
                  name="radio"
                  value={radio.value}
                  checked={numTeams === radio.value}
                  onChange={(e) => setNumTeams(e.currentTarget.value)}
                  className="team-size"
                >
                  {radio.name}
                </ToggleButton>
              ))}
            </ButtonGroup>

            <Button variant="primary" className="create-button" onClick={() => {
              setGame(main.start_game(words, numTeams, 6));
            }}> Create Game </Button>

          </div>
          }

          {game !== null &&
            <GameBoard gameState={game} numTeams={numTeams} restartGame={restartGame}></GameBoard>
          }
      </header>
    </div>
  );
}

export default App;
