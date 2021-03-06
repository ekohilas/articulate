import * as api from './api.js';
import * as ui from './ui.js';

/*
 * TODO
 * Game state:
 * for each team:
 * 	current category
 * 	current wins
 * 	total wins
 * 	name
 * 	color
 */

function import_deck(json_deck) {

    console.log(json_deck)
        //return Deck.from_json(json_deck)
}

function create_teams() {
    const num_teams = parseInt(prompt("How many teams?: ", ""));
    let teams = [];
    for (let i = 0; i < num_teams; i++) {
        const name = prompt("Enter Team name: ", "");
        teams.push(new api.Team(name, Object.values(api.Color)[i]));
    }
    return teams;
}

function create_test_teams(num_teams) {
    // const num_teams = 2;
    var num_teams = parseInt(num_teams);
    //const num_teams = parseInt(prompt("How many teams?: ", ""));
    let teams = [];
    for (let i = 0; i < num_teams; i++) {
        const name = `Team ${i+1}`;
        //const name = prompt("Enter Team name: ", "");
        teams.push(new api.Team(name, Object.values(api.Color)[i]));
    }
    return teams;
}

export function start_game(json_deck, num_teams) {

    const teams = create_test_teams(num_teams);
    const game = new api.Game(teams, json_deck);

    // let button = document.getElementById("start");
    // button.style.display = "none";

    // TODO
    //const interval = window.setInterval(function() {ui.update_screen(game)}, 100);
    //window.requestAnimationFrame(function() {update_timer(game)});
    //category.appendChild(game.create_category_table());

    //const position = document.getElementById('position');
    //position.appendChild(game.create_position_table());

    game.start();

    return game;

}
