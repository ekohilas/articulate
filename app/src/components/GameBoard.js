
import './GameBoard.css';
import Button from 'react-bootstrap/Button';
import { useState, useEffect } from "react";
import TinderCard from 'react-tinder-card'

const categoryColours = {
    'object': '#0099DA',
    'action': '#F37027',
    'wild': '#FFFFFF',
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
            // console.log('starting turn set play status', playStatus)
            setTimeLeft(20);
        }
        // prevent ending turn on first default set
        else if (playStatus == false && timeLeft != -1) {
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

        if (props.gameState.game_over) {
            console.log('game over')
        }
    }
    const deferCard = () => {
        props.gameState.defer_word();
        setCards([{
            word: props.gameState.current_word_text,
            category: props.gameState.current_word_category
        }])
    }
    const restartGame = () => {
        window.location.reload(false);
    }

    const onSwipe = (direction) => {
        // disable if not current in a round
        console.log('play status', playStatus);
        // if (props.gameState.curr_team.final_turn) return;

        console.log('You swiped: ' + direction);
        if (direction === 'right') {
            winCard();
        }
        // cannot defer if final turn
        if (direction === 'left' && !props.gameState.curr_team.final_turn) {
            deferCard();
        }
    }

    const clearTime = () => {
        setTimeLeft(0); // this causes the game to end turn due to useEffect
        clearTimeout(timer);
    }

    function initialiseTable(numTeams, numCategories) {
        let table = createGrid(numTeams, numCategories);
        table.forEach(
            row => row[0] = `0/${props.gameState.max_cycles}`
        );
        return table;
    }

    function updateTable(table, teams) {
        teams.forEach(
            (team, i) =>
            team.final_turn
            ? writeFinal(table, i)
            : moveTeam(table, i, team.total_wins % 7, Math.floor(team.total_wins / 7))
        )
        setCategoryTable(table);
    }

    function writeFinal(table, teamNumber) {
        const final_string = "*FINAL*";
        table[teamNumber].forEach(
            (value, i, array) =>
            array[i] = final_string[i]
        );
    }

    function moveTeam(table, teamNumber, categoryNumber, roundNumber) {
        table[teamNumber].forEach(
            (value, i, array) =>
            array[i] = (
                i === categoryNumber
                ? (
                    roundNumber === props.gameState.max_cycles
                    ? "*"
                    : `${roundNumber}/${props.gameState.max_cycles}`
                )
                : undefined
            )
        );
    }


    return (
        <div className="root">
            <Button onClick={() => console.log(props.gameState)} variant="warning">Print Game State</Button>

            <div className="board">
                {createTable(categoryTable)}
            </div>

            {/* <div className="team-div" >
                {props.gameState.teams.map((team, idx) => (
                    <div className="team-header" key={idx}>
                        <p>{team.name} </p>
                        <p>{team.total_wins}</p>
                    </div>
                ))}
            </div> */}
            
            {playStatus === false ?
            (
                !props.gameState.game_over && 
            <div className="round-div">
                <div className="team-round-div">
                    <p className="curr-team-text">{props.gameState.curr_team.name}</p>
                    <Button variant="primary" className="start-button" size="lg" onClick={() => setPlayStatus(true)}>Start Round</Button>
                </div>

                <p className="points-update-text"> {props.gameState.turns.length > 1 ?
                    `${props.gameState.get_last_team()} just scored ${props.gameState.get_last_wins()} points` : '20 second rounds'}
                </p>
            </div>
            )
            :
            (
                !props.gameState.game_over && 
            <div className="round-view round-div">
                <h1>{timeLeft}</h1>

                <div className="game-buttons-div">
                    <Button id='win' className="game-button" onClick={() => winCard()} variant="success">Win</Button>
                    {!props.gameState.curr_team.final_turn && <Button id='defer' className="game-button" onClick={() => deferCard()} variant="secondary">Skip</Button>}
                    {/* <button id='discard' onClick={() => game.discard_word()} >Discard</button> */}
                    <Button id='end' className="game-button" onClick={() => clearTime()} variant="danger">End</Button>
                </div>
                <p className="score-text">Current Score {props.gameState.current_team_wins}</p>
            </div>
            )
            }

            {!props.gameState.game_over && 
            <div className="card-div">
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
                        <TinderCard preventSwipe={['up', 'down', 'left', 'right']}>
                            <div className="card">
                                <div className="card-category border-top" style={{backgroundColor: categoryColours[card.category]}}>{card.category}</div>
                                <div className="card-word">{card.word}</div>
                                <div className="card-category border-bottom" style={{backgroundColor: categoryColours[card.category]}}>{card.category}</div>
                            </div>
                        </TinderCard>
                )})}
            </div> 
            }

            {props.gameState.game_over ?
                <div>
                    <p className="helper-text"> Congratulations! {props.gameState.curr_team.name} has won 🎉! </p>
                    <Button onClick={() => restartGame()} variant="warning">Restart</Button>
                </div>
                :
                <p className="helper-text"> Swipe right if you've won the card and left to pass/skip </p>
            }
            
        </div>
    )
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
    tableData.map(
        (rowData, i) => {
          return (
            <tr>
              {
                rowData.map(
                    (cellData, j) => {
                  return (
                    <td className={`cell team-${i} ${Object.keys(categoryColours)[j]}`}
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
