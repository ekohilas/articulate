import * as main from '../api/main';

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

            {props.playStatus == false ? 
            <div>
                <button onClick={() => props.startRound()}>Start Round</button>
            </div>
            : 
            <div>
                <h1>Time Remaining: {props.timeLeft}</h1>

                <div id='controls'>
                {/* <button id='start'>Start</button> */}
                <button id='defer' onClick={() => props.gameState.defer_word()}>Skip</button>
                <button id='win' onClick={() => props.gameState.win_word()}>Win</button>
                {/* <button id='discard' onClick={() => game.discard_word()} >Discard</button> */}
                <button id='end' onClick={() => props.endTurn()}>End</button>
                </div>
            </div>
            }
        </div>
    )
}