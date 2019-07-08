import * as api from '/src/api.js';

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
	for (let _ = 0; _ < num_teams; _++) {
		const name = prompt("Enter Team name: ", "");
		teams.push(new api.Team(name, api.Color.RED));
	}
	return teams;
}


function main(json_deck) {

	const deck = api.Deck.from_json(json_deck);
	const teams = create_teams();

	const game = new api.Game(teams, deck);

	let button = document.getElementById("discard");
	button.onclick = game.discard_word;

	button = document.getElementById("win");
	button.onclick = game.win_word;

	button = document.getElementById("defer");
	button.onclick = game.defer_word;

	button = document.getElementById("start");
	button.onclick = game.start_turn;

	game.start();

}

window.onload = function() {
	fetch("/static/words.json")
		.then(r => r.json())
		.then(j => main(j))
}
