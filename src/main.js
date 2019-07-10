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

function update_screen(game) {
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

	let teams = document.getElementById("teams");
	teams.innerHTML = "";
	for (const team of game.teams) {
		let node = document.createElement("p");
		node.innerText = JSON.stringify(team, null, 1);
		teams.appendChild(node);
	}	
}


function main(json_deck) {

	const deck = api.Deck.from_json(json_deck);
	const teams = create_teams();

	const game = new api.Game(teams, deck);

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
	let interval = window.setInterval(function() {update_screen(game)}, 100);
	//window.requestAnimationFrame(function() {update_timer(game)});

	game.start();


}

window.onload = function() {
	fetch("/static/words.json")
		.then(r => r.json())
		.then(j => main(j))
}
