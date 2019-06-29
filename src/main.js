import * as api from '/src/api.js';

function import_deck(json_deck) {

	console.log(json_deck)
	//return Deck.from_json(json_deck)
}

function create_teams() {
	const num_teams = parseInt(prompt("How many teams?: ", ""));
	let teams = [];
	// is does something like a range iterator exist?
	for (let _ = 0; _ < num_teams; _++) {
		const name = prompt("Enter Team name: ", "");
		teams.push(new api.Team(name, api.Color.RED));
	}
	return teams;
}

function main(json_deck) {
	const deck = import_deck(json_deck);
	const teams = create_teams();

	const game = new api.Game(teams, deck);

	game.start();

}

window.onload = function() {
	fetch("/static/words.json")
		.then(r => r.json())
		.then(j => main(j))
}
