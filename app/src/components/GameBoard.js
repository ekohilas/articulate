
import './GameBoard.css';
import Button from 'react-bootstrap/Button';
import { useState, useEffect } from "react";

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

    const [categoryTable, setCategoryTable] = useState(initialiseTable(props.numTeams, 7));

    function updateTable(table, teams) {
        teams.forEach(
            (team, i) =>
            moveTeam(table, i, team.total_wins % 7)
        )
        setCategoryTable(table);
    }

    return (
        <div>
            <div id='state'>
                <div id='timer'></div>
                <div id='board'>
                    <div id='category'>
                        {createTable(categoryTable)}
                    </div>
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
                <Button id='end' onClick={() => {
                    props.endTurn();
                    updateTable(categoryTable, props.gameState.teams);
                    }
                }>End</Button>
                </div>
            </div>
            }

            <div className="card">
                <div className="card-category border-top" style={{backgroundColor: categoryColours[props.gameState.current_word_category]}}>{props.gameState.current_word_category}</div>
                <div className="card-word">{props.gameState.current_word_text}</div>
                <div className="card-category border-bottom" style={{backgroundColor: categoryColours[props.gameState.current_word_category]}}>{props.gameState.current_word_category}</div>
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
