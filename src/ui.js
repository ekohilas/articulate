import * as util from '/src/util.js';

export function update_screen(game) {
    let timer = document.getElementById("timer");
    let button = document.getElementById("start");
    //console.log(game.turn_timer);
    // TODO
    if (game.turn_timer == 120) {
        button.style.display = "inline";
    } else {
        button.style.display = "none";
    }
    timer.innerText = game.turn_timer;

    /*
    // prints all teams
    let teams = document.getElementById("teams");
    teams.innerHTML = "";
    for (const team of game.teams) {
    let node = document.createElement("p");
    node.innerText = JSON.stringify(team, null, 1);
    teams.appendChild(node);
    }
    */
}

class Team {

    constructor(color) {
        this.color = color;
        this.cycle = 0;
        this.element = document.createElement('div');
        this.element.style.backgroundColor = this.color;
        this.element.innerText = this.cycle;
    }

    update_cycle() {
        this.cycle++;
        this.element.innerText = this.cycle;
    }

}

export class Board {

    constructor(game) {
        this.game = game;
        this.teams = this.game.teams.map(team => new Team(team.color));
    }

    create_layout() {

        const rows = this.game.teams.length;
        const cols = this.game.segments.length;

        const table = util.create_table(rows, cols);
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                let cell = table.rows[i].cells[j];
                cell.innerText = '##';
                //cell.
                cell.style.backgroundColor = `rgb(${j * 32}, ${255 - j * 32}, ${128})`;
            }
        }

        for (let i = 0; i < rows; i++) {
            let cell = table.rows[i].cells[0];
            cell.appendChild(this.teams[i].element);
        }

        return table;
    }

    update_team() {

    }

    update_team_category() {

    }

    update_team_cycle() {

    }

}

