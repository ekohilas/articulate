import './App.css';
import * as main from './api/main';
import { useState, useEffect } from "react";
import GameBoard from './components/GameBoard';
import words from './static/words.json';
import articulate from './images/articulate.jpeg';
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

  return (
    <div className="App">
      <header className="App-header">
        <img src={articulate} className="App-logo" alt="logo" />

          {game === null &&

          <div>
            Number of Teams
            <ButtonGroup toggle vertical>
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

            <Button variant="primary" onClick={() => {
              setGame(main.start_game(words, numTeams));
            }}> Create Game </Button>
          </div>
          }

          {game !== null &&
            <GameBoard gameState={game} numTeams={numTeams}></GameBoard>
          }
        <pre id='words'>
        </pre>
      </header>
    </div>
  );
}

export default App;
