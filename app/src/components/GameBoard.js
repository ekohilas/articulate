
import './GameBoard.css';
import Button from 'react-bootstrap/Button';

export default function GameBoard(props) {
    return (
        <div>
            <div id='state'>
            <div id='timer'></div>
            <div id='board'>
                <div id='category'></div>
                <div id='position'></div>
            </div>
            <pre id='teams'></pre>

            </div>

            <Button onClick={() => console.log(props.gameState)}>Print Game State</Button>
            
            <div className="team-div" >
                {props.gameState.teams.map((team, idx) => (
                    <div className="team-header" key={idx}>
                        <p>{team.name} </p>
                        <p>{team.total_wins}</p>
                    </div>    
                ))}
            </div>

            {props.playStatus === false ? 
            <div>
                <Button onClick={() => props.startRound()} variant="success">Start Round</Button>
            </div>
            : 
            <div>
                <h1>{props.timeLeft}</h1>

                <div id='controls'>
                {/* <button id='start'>Start</button> */}
                <Button id='defer' onClick={() => props.gameState.defer_word()}>Skip</Button>
                <Button id='win' onClick={() => props.gameState.win_word()}>Win</Button>
                {/* <button id='discard' onClick={() => game.discard_word()} >Discard</button> */}
                <Button id='end' onClick={() => props.endTurn()}>End</Button>
                </div>
            </div>
            }
        </div>
    )
}