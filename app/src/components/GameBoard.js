
import './GameBoard.css';
import Button from 'react-bootstrap/Button';
import { useState, useEffect } from "react";
import TinderCard from 'react-tinder-card'

const categoryColours = {
    'object': '#0099DA',
    'action': '#F37027',
    'wild': '#BB99DA',
    'world': '#016FA5',
    'person': '#FFCB04',
    'random': '#ED1C24',
    'nature': '#008752',
}


export default function GameBoard(props) {
    const [currCards, setCards] = useState([{
        word: props.gameState.current_word_text,
        category: props.gameState.current_word_category
    }])
    const [timeLeft, setTimeLeft] = useState(-1);
    const [playStatus, setPlayStatus] = useState(false);
    const [categoryTable, setCategoryTable] = useState(initialiseTable(props.numTeams, 7));

    var timer;

    useEffect(() => {
        if (timeLeft > 0) {
            timer = setTimeout(() => {
                setTimeLeft(timeLeft - 1)
            }, 1000);
        }
        else if (timeLeft == 0 && playStatus == true) {
            // endTurn();
            setPlayStatus(false);
        }
    }, [timeLeft]);

    useEffect(() => {
        if (playStatus == true) {
            console.log('starting turn set play status', playStatus)
            setTimeLeft(20);
        }
        // prevent ending turn on first default set
        else if (playStatus == false && timeLeft != -1) {
            console.log('ending turn set play status false')
            props.gameState.end_turn(); // ends the turn in backend
            updateTable(categoryTable, props.gameState.teams);
            setCards([{
                word: props.gameState.current_word_text,
                category: props.gameState.current_word_category
            }])
        }
        else {
            console.log('play status changed to ', playStatus);
        }
    }, [playStatus]);

    const winCard = () => {
        props.gameState.win_word();
        setCards([{
            word: props.gameState.current_word_text,
            category: props.gameState.current_word_category
        }])
    }
    const deferCard = () => {
        props.gameState.defer_word();
        setCards([{
            word: props.gameState.current_word_text,
            category: props.gameState.current_word_category
        }])
    }
    const onSwipe = (direction) => {
        // disable if not current in a round
        console.log('play status', playStatus);
        // if (playStatus == false) return;
        
        console.log('You swiped: ' + direction);
        if (direction === 'left') {
            winCard();
        }
        if (direction === 'right') {
            deferCard();
        }
    }

    const clearTime = () => {
        setTimeLeft(0); // this causes the game to end turn due to useEffect
        clearTimeout(timer);    
    }

    function updateTable(table, teams) {
        teams.forEach(
            (team, i) =>
            moveTeam(table, i, team.total_wins % 7)
        )
        console.log("i should be updating table");
        setCategoryTable(table);
    }

    return (
        <div>
            <div id='state'>
                <div id='timer'></div>
                <div id='board'>
                    <div id='category'>
                    </div>
                    <div id='position'></div>
                </div>
                <pre id='teams'></pre>
            </div>
            <div>
                {createTable(categoryTable)}
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

            {playStatus === false ?
            <div>
                <Button onClick={() => setPlayStatus(true)} variant="success">Start Round</Button>
            </div>
            :
            <div>
                <h1>{timeLeft}</h1>

                <div id='controls'>
                {/* <button id='start'>Start</button> */}
                <Button id='defer' onClick={() => deferCard()}>Skip</Button>
                <Button id='win' onClick={() => winCard()}>Win</Button>
                {/* <button id='discard' onClick={() => game.discard_word()} >Discard</button> */}
                <Button id='end' onClick={() => clearTime()}>End</Button>
                </div>
            </div>
            }

            <div>
                {currCards.map((card) => {
                    return (
                        playStatus === true ?
                        <TinderCard onSwipe={onSwipe} key={card.word} preventSwipe={['up', 'down', 'left', 'right']}>
                            <div className="card">
                                <div className="card-category border-top" style={{backgroundColor: categoryColours[card.category]}}>{card.category}</div>
                                <div className="card-word">{card.word}</div>
                                <div className="card-category border-bottom" style={{backgroundColor: categoryColours[card.category]}}>{card.category}</div>
                            </div>
                        </TinderCard>
                        :
                        <TinderCard onSwipe={console.log('no swipe')} preventSwipe={['up', 'down', 'left', 'right']}>
                            <div className="card">
                                <div className="card-category border-top" style={{backgroundColor: categoryColours[card.category]}}>{card.category}</div>
                                <div className="card-word">{card.word}</div>
                                <div className="card-category border-bottom" style={{backgroundColor: categoryColours[card.category]}}>{card.category}</div>
                            </div>
                        </TinderCard>
                )})}
            </div>
                
        </div>
    )
}

function initialiseTable(numTeams, numCategories) {
    let table = createGrid(numTeams, numCategories);
    table.forEach(
        row => row[0] = "*"
    );
    return table;
}

function moveTeam(table, teamNumber, categoryNumber) {
    table[teamNumber].forEach(
        (value, i, array) =>
        array[i] = (i === categoryNumber ? "*" : undefined)
    );
}

function createGrid(numRows, numCols) {
    let rows = [];
    for (let i = 0; i < numRows; i++) {
        let cols = [];
        for (let j = 0; j < numCols; j++) {
            cols.push(undefined);
        }
        rows.push(cols);
    }
    return rows;
}

function createTable(tableData) {
 return (
  <table>
   <tbody>
   {
    tableData.map(rowData => {
      return (
        <tr>
          {
           rowData.map((cellData, i) => {
              return (
                <td
                    style={{
                        backgroundColor: Object.values(categoryColours)[i],
                        width: "50px",
                        height: "50px",
                    }}
                > {cellData} </td>);
           })
          }
        </tr>
    );
    })
   }
  </tbody>
  </table>
 )
}
