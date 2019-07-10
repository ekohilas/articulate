import * as util from '/src/util.js';

/*
 * TODO
 * polyfill/babel
 * convert Category to a class
 * do words need categoryies?
 * do they need to know if they're wild?
 * should holding be limited to one word?
 * if added words are wild, should they come out of a seperate deck, and the normal deck at the same time?
 * I assume classes are hashable by default
 * Add sanity checks
 */

const DEFAULT_NUM_CATEGORIES = 7;
const DEFAULT_MAX_CYCLES = 1;//6
const DEFAULT_MAX_HELD = 2;
const DEFAULT_MAX_TEAMS = 4;
const DEFAULT_TIMER_SECONDS = 120;
const SECOND_IN_MILLISECONDS = 1000;

export const Color = {
	RED: "#ff0000",
	YELLOW: "#ffff00",
	GREEN: "#00ff00",
	BLUE: "#0000ff"
}

export const WordStatus = {
	HOLDING: 0,
	DEFERED: 1,
	PLAYED: 2,
	DISCARDED: 3
}

export const PlayStatus = {
	PREPARING: 0,
	PLAYING: 1,
	ENDED: 2
}

export const Category = {
	OBJECT: 0,  
	ACTION: 1, 
	WILD  : 2,
	WORLD : 3, 
	PERSON: 4, 
	RANDOM: 5, 
	NATURE: 6
}

export const DEFAULT_START_CATEGORY = Category.OBJECT;

export class Word {
	//TODO make hashable?
	constructor(word, category) {
		this.word = word;
		this.category = category;
	}
}

export class Deck {

	constructor(unplayed) {
		this.unplayed = unplayed;
		this.played = [];
	}

	draw_from(category) {
		if (category == Category.WILD) {
			category = util.wild_category(Category);
		}

		const word = util.choice_from_set(this.unplayed.get(category));

		this.unplayed.get(category).delete(word);

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
			"nature": Category.NATURE
		}
		const unplayed = new Map();
		for (const [category_str, words] of Object.entries(object)) {
			const category = to_category[category_str];
			unplayed.set(
				category,
				new Set(
					words.map(
						word => new Word(word, category)
					)
				)
			)
		}

		// is this how you make a class method?
		return new this(unplayed);

	}

}

export class Turn {
	constructor(team, category, deck) {
		this.team = team;
		this.category = category;
		this.deck = deck;
		this.words = new Map(
			Object.values(WordStatus).map(status => [status, []])
		);
		this.status = PlayStatus.PREPARING;
		this.timer = DEFAULT_TIMER_SECONDS; 
		this._draw_word();
	}

	get wins() {
		return this.words.get(WordStatus.PLAYED).length;
	}


	_draw_and_hold() {
		const word = this.deck.draw_from(this.category);
		this.words.get(WordStatus.HOLDING).push(word);
	}

	_move_word(from_status, to_status, word) {
		let temp_word = undefined;
		if (word === undefined) {
			temp_word = this.words.get(from_status).shift();
		} else {
			const index = this.words.get(from_status).indexOf(word); 
			temp_word = this.words.get(from_status).splice(index, 1);
		}
		this.words.get(to_status).push(temp_word);
	}

	_draw_word() {

		if (
			this.status === PlayStatus.PREPARING 
			&& this.words.get(WordStatus.HOLDING).length !== 0
		) {
			return;
		}

		if (
			this.team.final_turn === true
			&& this.words.get(WordStatus.HOLDING).length !== 0
		) {
			return;
		}

		const num_cards_held = (
			this.words.get(WordStatus.DEFERED).length
			+ this.words.get(WordStatus.HOLDING).length
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
			this.timer = 0;
		}

	}

	defer_word(word) {
		this._release_and_draw(WordStatus.DEFERED, word);
	}
}

export class Team {

	constructor(name, color) {
		this.name = name;
		this.color = color;
		this.curr_category = DEFAULT_START_CATEGORY;
		this.total_wins = 0;
		this.final_turn = false;
		this.turns = [];
	}

}

export class Game {

	constructor(
		teams, 
		deck, 
		num_categories = DEFAULT_NUM_CATEGORIES,
		max_cycles = DEFAULT_MAX_CYCLES,
		max_held = DEFAULT_MAX_HELD
	) {
		this.teams = teams;
		this.deck = deck;
		this.num_categories = num_categories;
		this.max_cycles = max_cycles;
		this.max_held = max_held;
		this.turns = [];
		this.curr_team = undefined;
		this.curr_turn = undefined;
		this.curr_turn_num = 0;
		this.interval = undefined;
	}

	start(ordered) {
		if (ordered === false) {
			util.shuffle(this.teams);
		}

		//this.set_team_numbers();

		this.init_turn();
		// wait until ready

		// this should be abstracted as a game function that is calle from the top level
		// first continue should be a function to start
		// then at the end of the timer iniate the end functions
		// there shouldn't be a while true llop here 

	}

	get turn_timer() {
		return this.curr_turn.timer;
	}

	init_turn() {
		this.curr_team = this.teams[this.curr_turn_num % this.teams.length];
		this.curr_turn = new Turn(
			this.curr_team,
			((this.curr_team.final_turn === true) ? Category.WILD : this.curr_team.curr_category),
			this.deck
		);
		this.turns.push(this.curr_turn);
		this.show_words();
	}

	show_words() {
		let cards = document.getElementById("words");
		let node = document.createElement("p");
		node.innerText = JSON.stringify(
			util.map_to_object(this.curr_turn.words),
			null,
			1
		);
		cards.prepend(node);
	}

	tick_timer() {
		if (this.curr_turn.timer > 0) {
			this.curr_turn.timer--;
		} else {
			window.clearInterval(this.interval);
			this.end_turn();
		}

	}

	start_turn() {
		this.curr_turn.status = PlayStatus.PLAYING;
		this.interval = window.setInterval( () => this.tick_timer() , 1 * SECOND_IN_MILLISECONDS);
		//this.interval = window.setInterval(function() { this.tick_timer.bind(this) }, 1 * SECOND_IN_MILLISECONDS);
		//window.setInterval(this.end, DEFAULT_TIMER_SECONDS * SECOND_IN_MILLISECONDS);
	}

	end_turn() {
		console.log("Times up!");
		this.curr_turn.timer = 0;
		this.curr_turn.status = PlayStatus.ENDED;
		this.update_team_wins();

		if (this.check_end_game() === true) {
			this.end_game();
		} else {

			this.update_team();

			this.advance_turn();

			this.init_turn();
		}

	}

	discard_word() {
		this.curr_turn.discard_word();
		this.show_words();
	}

	win_word() {
		this.curr_turn.win_word();
		this.show_words();
	}

	defer_word() {
		this.curr_turn.defer_word();
		this.show_words();
	}

	update_team_wins() {
		const wins = this.curr_turn.wins;
		console.log(`${this.curr_team.name} scored ${wins}`);
		this.curr_team.total_wins += wins;

	}
	
	// TODO test end final turn
	check_end_game() {
		return this.curr_team.final_turn && this.curr_turn.wins > 0;
	}

	update_team() {
		this.curr_team.curr_category = Object.values(Category)[this.curr_team.total_wins % this.num_categories];

		if (Math.floor(this.curr_team.total_wins / this.num_categories) >= this.max_cycles) {
			this.curr_team.final_turn = true;
			this.curr_team.curr_category = Category.WILD;
		}
	}

	advance_turn() {
		this.curr_turn_num += 1;
	}

	end_game() {
		console.log(this.curr_team.name + " won!");
	}
}



