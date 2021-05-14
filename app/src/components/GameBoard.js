
import './GameBoard.css';
import Button from 'react-bootstrap/Button';
import TinderCard from 'react-tinder-card'

const categoryColours = {
    'action': '#F37027',
    'nature': '#008752',
    'person': '#FFCB04',
    'world': '#016FA5',
    'random': '#ED1C24',
    'object': '#0099DA',
    'wild': '#BB99DA'
}


export default function GameBoard(props) {
    let currentCards = [
        {
            word: props.gameState.current_word_text,
            category: props.gameState.current_word_category
        },
        {
            word: '',
            category: props.gameState.current_word_category
        }
    ]

    const onSwipe = (direction) => {
        console.log('You swiped: ' + direction)
    }

    const onCardLeftScreen = (myIdentifier) => {
        console.log(myIdentifier + ' left the screen')
        console.log('time to replenish cards');
        props.gameState.win_word();
        console.log(props);
        
        currentCards = [
            {
                word: props.gameState.current_word_text,
                category: props.gameState.current_word_category
            },
        ]
    }

    return (
        <div>
            {/* <div id='state'>
            <div id='timer'></div>
            <div id='board'>
                <div id='category'></div>
                <div id='position'></div>
            </div>
            <pre id='teams'></pre>

            </div> */}

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

            {currentCards.map((card) =>
                <TinderCard onSwipe={onSwipe} onCardLeftScreen={() => onCardLeftScreen('fooBar')} preventSwipe={['up', 'down']}>
                    <div className="card">
                        <div className="card-category border-top" style={{backgroundColor: categoryColours[card.category]}}>{card.category}</div>
                        <div className="card-word">{card.word}</div>
                        <div className="card-category border-bottom" style={{backgroundColor: categoryColours[card.category]}}>{card.category}</div>
                    </div>
                </TinderCard>
            )}

            

            

        </div>
    )
}

