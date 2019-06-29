import util;

const DEFAULT_NUM_CATEGORIES = 7;
const DEFAULT_MAX_CYCLES = 6;
const DEFAULT_MAX_HELD = 2;
const DEFAULT_MAX_TEAMS = 4;
const DEFAULT_TIMER_SECONDS = 120;

const Color = {
	RED: "#ff0000",
	YELLOW: "#ffff00",
	GREEN: "#00ff00",
	BLUE: "#0000ff"
}

const WordStatus = {
	HOLDING: 0,
	DEFERED: 1,
	PLAYED: 2,
	DISCARDED: 3
}

const PlayStatus = {
	PREPARING: 0,
	PLAYING: 1,
	ENDED: 2
}

const Category = {
	OBJECT: 0,  
	ACTION: 1, 
	WILD  : 2,
	WORLD : 3, 
	PERSON: 4, 
	RANDOM: 5, 
	NATURE: 6
}

const DEFAULT_START_CATEGORY = Category.OBJECT;

class Word {
	//TODO make hashable?
	constructor(word, category, is_wild) {
		this.word = word;
		this.category = category;
		this.is_wild = is_wild;
	}
}

class Deck {
	//TODO Can java make objects from objects?
	constructor() {
		this.unplayed = new Map([
			/*
			[c, new Set([])]
			for c in Category
			*/
		]);
		this.played = [];
	}

	draw_from(category) {
		if (category == Category.WILD) {
			category = util.wild_category(Category);
		}

		const word = util.choice_from_set(this.unplayed[category]);

		this.unplayed[category].delete(word);

		this.played.push(word);

		return word;
	}

	static from_json(object) {
		const to_category = {
			"object": Category.OBJECT,
			"action": Category.ACTION,
			"world": Category.WORLD,
			"person": Category.PERSON,
			"random": Category.RANDOM,
			"nature": Category.NATURE,
		}
		unplayed = Map();
		for (const [category, words] of Object.entries(object)) {
			const category = to_category[category];
			/*
			unplayed[category] = Set(
				Word(
					word=word,
					category=category,
					is_wild=false,
				)
				for word in words
			)
			*/
		}

		//return cls(unplayed);

	}

}

class Turn {
	constructor(team, category, deck) {
		this.team = team;
		this.category = category;
		this.deck = deck;
		this.words = new Map([
			/*
			[status, []]
			for status in WordStatus
			*/
		]);
		this.status = PlayStatus.PREPARING;
		this._draw_word();
	}

	get wins() {
		return this.words[WordStatus.PLAYED].length;
	}

	start() {
		this.status = PlayStatus.PLAYING;
		// Timer Start
	}

	end() {
		this.status = PlayStatus.ENDED;
		// Timer Start
	}

	_draw_and_hold() {
		const word = this.deck.draw_from(this.category);
		this.words[WordStatus.HOLDING].push(word);
	}

	_move_word(from_status, to_status, word) {
		if (word === undefined) {
			const temp_word = this.words[from_status].shift();
		} else {
			const index = this.words[from_status].indexOf(word); 
			const temp_word = this.words[from_status].splice(index, 1);
		}
		this.words[to_status].push(temp_word);
	}

	_draw_word() {

		if (
			this.status === PlayStatus.PREPARING 
			&& this.words[WordStatus.HOLDING].length !== 0
		) {
			return;
		}

		if (
			this.team.final_turn === true
			&& this.words[WordStatus.HOLDING].length !== 0
		) {
			return;
		}

		const num_cards_held = (
			this.words[WordStatus.DEFERED].length
			+ this.words[WordStatus.HOLDING].length
		);

		if (num_cards_held === 0) {
			this._draw_and_hold();
			return;
		}

		if (num_cards_held < DEFAULT_MAX_HELD) {
			this._draw_and_hold();
		} else {
			this._move_word(WordStatus.DEFERED, WordStatus.HOLDING);
		}
	}

	_release_and_draw(to_category, word) {
		this._move_word(WordStatus.HOLDING, to_category, word);
		this._draw_word();
	}

	discard_word(word) {
		this._release_and_draw(WordStatus.DISCARDED, word);
	}

	win_word(word) {
		this._release_and_draw(WordStatus.PLAYED, word);

		if (this.team.final_turn === true) {
			this.end();
		}

	}

	defer_word(word) {
		this._release_and_draw(WordStatus.DEFERED, word);
	}
}

class Team {
	constructor(name, color) {
		this.name = name;
		this.color = color;
		this.curr_category = DEFAULT_START_CATEGORY;
		this.total_wins = 0;
		this.final_turn = false;
		this.turns = [];
	}

}

class Game {

	constructor(teams, deck) {
		this.teams = teams;
		this.deck = deck;
		this.turns = [];
		this.num_categories = DEFAULT_NUM_CATEGORIES;
		this.max_cycles = DEFAULT_MAX_CYCLES;
		this.max_held = DEFAULT_MAX_HELD;
		this.curr_team = undefined;
		this.curr_turn = undefined;
		this.curr_turn_num = 0;
	}

	start(ordered) {
		if (ordered === false) {
			util.shuffle(this.teams);
		}

		//this.set_team_numbers();

		this.loop();

	}

	loop() {
		while (true) {

			this.start_turn();
			// wait until ready
			this.curr_turn.start();

			let continue_turn = prompt("Enter to start", "");
			while (continue_turn !== "") {
				console.log(this.curr_turn.words);

				const option = prompt("Enter action (d/w/p): ", "");
				if (option == "d") {
					this.curr_turn.discard_word();
				} else if (option == "w") {
					this.curr_turn.win_word();
				} else if (option == "p") {
					this.curr_turn.defer_word();
				}

				let continue_turn = prompt("Continue Turn? ", "");
			}
			this.curr_turn.end();

			this.update_team_wins();

			if (this.check_end_game() === true) {
				break;
			}

			this.update_team();

			this.advance_turn();

			this.end_game();
		}
	}

	start_turn() {
		this.curr_team = this.teams[this.curr_turn_num % len(this.teams)];
		this.curr_turn = Turn(
			num=this.curr_turn_num,
			team=this.curr_team,
			category=this.curr_team.curr_category,
			deck=this.deck
		);
		this.turns.append(this.curr_turn);

	}

	update_team_wins() {
		const wins = this.curr_turn.wins;
		console.log(wins);
		this.curr_team.total_wins += wins;

	}
	
	check_end_game() {
		return this.curr_team.final_turn && this.curr_turn.wins;

	}

	update_team() {
		this.curr_team.curr_category = Category(this.curr_team.total_wins % this.num_categories);

		if (Math.floor(this.curr_team.total_wins / this.num_categories) >= this.max_cycles) {
			this.curr_team.final_turn = true;
			this.curr_team.curr_category = Category.WILD;
		}
	}

	advance_turn() {
		this.curr_turn_num += 1;
	}

	end_game() {
		return console.log(this.curr_team.name + " won!");
	}
}


function import_deck() {
	/*
    with open("categories.json") as f:
        json_deck = json.load(f)
    return Deck.from_json(json_deck)
    */
}

function create_teams() {
	const num_teams = parseInt(prompt("How many teams?: ", ""));
	let teams = [];
	for (let i = 0; i < num_teams; i++) {
		const name = prompt("Enter Team name: ", "");
		teams.push(Team(name, Color.RED));
	}
	return teams;
}

function main() {
	const deck = import_deck();
	const teams = create_teams();

	const game = Game(deck, teams);

	game.start();

}

/*
if (__name__ === "__main__") {
	main()
}
*/



