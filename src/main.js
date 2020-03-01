import * as api from '/src/api.js';
import * as ui from '/src/ui.js';

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

function main(json_deck) {

    const teams = create_teams();
    const game = new api.Game(teams, json_deck);

    let button = document.getElementById("discard");
    button.addEventListener('click', function() { game.discard_word() });

    button = document.getElementById("win");
    button.addEventListener('click', function() { game.win_word() });

    button = document.getElementById("defer");
    button.addEventListener('click', function() { game.defer_word() });

    button = document.getElementById("start");
    button.addEventListener('click', function() { game.start_turn() });

    button = document.getElementById("end");
    button.addEventListener('click', function() { game.end_turn() });

    // TODO
    const interval = window.setInterval(function() {ui.update_screen(game)}, 100);
    //window.requestAnimationFrame(function() {update_timer(game)});

    const category = document.getElementById('category');
    const board = new ui.Board(game);
    category.appendChild(board.create_layout());
    //category.appendChild(game.create_category_table());

    //const position = document.getElementById('position');
    //position.appendChild(game.create_position_table());

    game.start();


}

window.onload = function() {
    fetch("/static/words.json")
        .then(r => r.json())
        .then(j => main(j))
}
