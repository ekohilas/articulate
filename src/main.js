import api;

function import_deck() {
	/*
	 * How to import file as json?
    with open("categories.json") as f:
        json_deck = json.load(f)
    return Deck.from_json(json_deck)
    */
}

function create_teams() {
	const num_teams = parseInt(prompt("How many teams?: ", ""));
	let teams = [];
	// is does something like a range iterator exist?
	for (let _ = 0; _ < num_teams; _++) {
		const name = prompt("Enter Team name: ", "");
		teams.push(api.Team(name, Color.RED));
	}
	return teams;
}

function main() {
	const deck = import_deck();
	const teams = create_teams();

	const game = api.Game(deck, teams);

	game.start();

}
