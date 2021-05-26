
import './GameBoard.css';
import Button from 'react-bootstrap/Button';
import { useState, useEffect, useCallback } from "react";
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
    const [turnStatus, setTurnStatus] = useState(false);
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
            // unlimited time on final turn
            if (!props.gameState.curr_team.final_turn) {
                setTimeLeft(30);
            }
        }
        // prevent ending turn on first default set
        else if (playStatus == false && timeLeft != -1) {
            props.gameState.end_turn(); // ends the turn in backend
            updateTable(categoryTable, props.gameState.teams);
            setTurnStatus(false);
        }
        else {
            console.log('play status changed to ', playStatus);
        }
    }, [playStatus]);

    const startTurn = () => {
        setTurnStatus(true);
        setCards([{
            word: props.gameState.current_word_text,
            category: props.gameState.current_word_category
        }])
    }
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

        if (direction === 'right') {
            winCard();
        }
        // cannot defer if final turn
        if (direction === 'left' && !props.gameState.curr_team.final_turn) {
            deferCard();
        }
    }

    const onReadyTurn = (direction) => {
        if (direction === 'right') {
            setTurnStatus(true);
        }
    }

    const clearTime = () => {
        setTimeLeft(0); // this causes the game to end turn due to useEffect
        clearTimeout(timer);
    }

    function createTable(tableData) {
     return (
      <table>
       <tbody>
       {
        tableData.map(
            (rowData, i) => {
              return (
                <tr className={`${props.gameState.curr_team_num == i ? "active": "inactive"}`}>
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

    const handleKeyPress = useCallback((event) => {
        switch (event.key) {
            case "d":
                console.log(props.gameState);
                break;
            case "ArrowRight":
                winCard();
                break;
            case "ArrowLeft":
                deferCard();
                break;
            case "ArrowDown":
                clearTime();
                break;
            case "ArrowUp":
                setPlayStatus(true);
                break;
            default:
                console.log(`${event.key} was pressed`);
        }
    }, []);

    useEffect(() => {
        document.addEventListener("keydown", handleKeyPress, false);

        return () => {
            document.removeEventListener("keydown", handleKeyPress, false);
        };
    }, []);

    return (
        <div className="root">
            {/* <Button onClick={() => console.log(props.gameState)} variant="warning">Print Game State</Button> */}

            {(turnStatus === false || props.gameState.game_over) &&
            <div className="board">
                {createTable(categoryTable)}
            </div>
            }
            {/* <div className="team-div" >
                {props.gameState.teams.map((team, idx) => (
                    <div className="team-header" key={idx}>
                        <p>{team.name} </p>
                        <p>{team.total_wins}</p>
                    </div>
                ))}
            </div> */}
            {!props.gameState.game_over && (
                playStatus === true && turnStatus === true ?
                    <div className="round-view round-div">
                        <p className="timer-text">{props.gameState.curr_team.final_turn ? '∞': timeLeft}</p>
                        <p className="score-text">{props.gameState.curr_team.final_turn ? 'Anybody can answer': `Current Score ${props.gameState.current_team_wins}`}</p>
                    </div>
                :
                turnStatus === true ?
                    <div className="round-div">
                        <div className="team-round-div">
                            <p className="info-text">{props.gameState.curr_team.final_turn ? 'Final round - unlimited time' : '30 second rounds'}</p>
                        </div>
                    </div>
                :
                <p className="points-update-text"> {props.gameState.turns.length === 1 ?
                    "First team get ready!"
                    :
                    `Previous team scored ${props.gameState.get_last_wins()} points`
                    }
                </p>
            )}

            {!props.gameState.game_over &&
            <div className="card-div">
                {currCards.map((card) => {
                    return (
                        playStatus === true && turnStatus === true ?
                        <div className="card-game-div">
                            <TinderCard onSwipe={onSwipe} key={card.word} preventSwipe={['up', 'down', 'left', 'right']}>
                                <div className="card">
                                    <div className="card-category border-top" style={{backgroundColor: categoryColours[card.category]}}>{card.category}</div>
                                    <div className="card-word">{card.word}</div>
                                    <div className="card-category border-bottom" style={{backgroundColor: categoryColours[card.category]}}>{card.category}</div>
                                </div>
                            </TinderCard>
                            <div className="game-buttons-div">
                                <Button id='win' className="game-button" onClick={() => winCard()} variant="success">Win</Button>
                                {!props.gameState.curr_team.final_turn && <Button id='defer' className="game-button" onClick={() => deferCard()} variant="secondary">Skip</Button>}
                                {/* <button id='discard' onClick={() => game.discard_word()} >Discard</button> */}
                                <Button id='end' className="game-button" onClick={() => clearTime()} variant="danger">End</Button>
                            </div>
                        </div>
                        :
                        turnStatus === false ?
                        <TinderCard onSwipe={onReadyTurn} key={'ready'} preventSwipe={['up', 'down', 'left', 'right']}>
                            <div className="card-pending">
                                <div className="card-category border-top" style={{backgroundColor: 'grey'}}>*waiting*</div>
                                <div className="card-word-ready">Swipe right to win card,<br/>swipe left to pass</div>
                                <div className="card-category border-bottom" style={{backgroundColor: 'grey'}}>*waiting*</div>
                            </div>
                        </TinderCard>
                        :
                        <div>
                        <TinderCard preventSwipe={['up', 'down', 'left', 'right']}>
                            <div className="card">
                                <div className="card-category border-top" style={{backgroundColor: categoryColours[card.category]}}>{card.category}</div>
                                <div className="card-word">{card.word}</div>
                                <div className="card-category border-bottom" style={{backgroundColor: categoryColours[card.category]}}>{card.category}</div>
                            </div>
                        </TinderCard>
                            <div className="game-buttons-div">
                                <Button variant="primary" className="start-button" size="lg" onClick={() => setPlayStatus(true)}>Start Timer</Button>
                            </div>
                        </div>
                )})}
            </div>
            }

            {props.gameState.game_over ?
                <div className="finish-div">
                    <p className="helper-text">🎉 Congratulations 🎉</p>
                    <p className="helper-text"> {props.gameState.curr_team.name} has won! </p>
                    <Button onClick={() => restartGame()} variant="warning">Restart</Button>
                </div>
                :
                null
                // <p className="helper-text"> Swipe right if you've won the card and left to pass/skip </p>
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

