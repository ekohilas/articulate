from dataclasses import dataclass, field
from typing import Dict, List, Set
import random
import json
import enum

'''
This is the old python backend that was used to design and plan the port to
Javascript. It is no longer up to date or in use, and only here for reference.
# turn, round, play,
'''

DEFAULT_NUM_CATEGORIES = 7
DEFAULT_MAX_CYCLES = 6
DEFAULT_MAX_HELD = 2
DEFAULT_MAX_TEAMS = 4
DEFAULT_TIMER_SECONDS = 120

class Color(enum.Enum):
    RED = enum.auto()
    YELLOW = enum.auto()
    GREEN = enum.auto()
    BLUE = enum.auto()

class WordStatus(enum.Enum):
    PLAYED = enum.auto()
    DEFERED = enum.auto()
    HOLDING = enum.auto()
    DISCARDED = enum.auto()

class PlayStatus(enum.Enum):
    PREPARING = enum.auto()
    PLAYING = enum.auto()
    ENDED = enum.auto()

class Category(enum.IntEnum):
    OBJECT = 0
    ACTION = 1
    WILD   = 2
    WORLD  = 3
    PERSON = 4
    RANDOM = 5
    NATURE = 6

DEFAULT_START_CATEGORY = Category.OBJECT

@dataclass(eq=True, frozen=True)
class Word:
    word: str
    category: Category
    is_wild: bool = False

@dataclass
class Deck:

    unplayed: Dict[Category, Set[Word]]
    played: List[Word] = field(default_factory=list)

    def draw_from(self, category: Category):
        while category == Category.WILD:
            category = random.choice(Category)

        word = random.choice(tuple(self.unplayed[category]))

        self.unplayed[category].remove(word)

        self.played.append(word)

        return word


    @classmethod
    def from_json(cls, d: dict):
        to_category = {
                "object": Category.OBJECT,
                "action": Category.ACTION,
                "world": Category.WORLD,
                "person": Category.PERSON,
                "random": Category.RANDOM,
                "nature": Category.NATURE,
        }
        unplayed = {}
        for category, words in d.items():
            category = to_category[category]
            unplayed[category] = set(
                Word(
                    word=word,
                    category=category,
                    is_wild=False,
                )
                for word in words
            )

        return cls(unplayed)

    @classmethod
    def from_csv(cls, f):
        raise NotImplementedError

@dataclass
class Turn:
    """
    On each draw, mark word as HOLDING.
    If the status is PREPARING, don't allow drawing anoter a word until the play has started.
    Start the timer once the play has started.

    If a word is won, mark it as WON and draw a new word.

    If a word is traded, mark the old word as DEFERED.
    If the number of cards DEFERED and HOLDING is equal to DEFAULT_MAX_HELD,
        switch to the next held card, otherwise draw a new card.

    If a word is discarded, mark it as DISCARDED and draw a new word.

    If the play is final, determine outcome after 1 word.

    At the end of play mark any words that weren't won and report number to advance.
    """
    num: int
    team: 'Team'
    category: Category
    deck: Deck
    words: Dict[WordStatus, List[Word]] = field(default_factory=dict)
    status: PlayStatus = PlayStatus.PREPARING

    def wins(self):
        return len(self.words[WordStatus.PLAYED])

    def setup(self):
        for status in WordStatus:
            self.words[status] = []
        self._draw_word()

    def start(self):
        self.status = PlayStatus.PLAYING
        # Timer Start

    def end(self):
        self.status = PlayStatus.ENDED

    def _draw_and_hold(self):
        word = self.deck.draw_from(self.team.curr_category)
        self.words[WordStatus.HOLDING].append(word)

    def _move_word(self, from_status, to_status, word=None):
        if word:
            temp_word = self.words[from_status].remove(word)
        else:
            temp_word = self.words[from_status].pop(0)
        self.words[to_status].append(temp_word)

    def _draw_word(self):

        if self.status == PlayStatus.PREPARING and self.words[WordStatus.HOLDING]:
            return

        if self.team.final_turn and self.words[WordStatus.HOLDING]:
            return

        num_cards_held = len(self.words[WordStatus.DEFERED]) + len(self.words[WordStatus.HOLDING])

        if num_cards_held == 0:
            self._draw_and_hold()
            return

        if num_cards_held < DEFAULT_MAX_HELD:
            self._draw_and_hold()
        else:
            self._move_word(WordStatus.DEFERED, WordStatus.HOLDING)

    def _release_and_draw(self, to_category, word=None):
        self._move_word(WordStatus.HOLDING, to_category, word)
        self._draw_word()

    def discard_word(self, word=None):
        self._release_and_draw(WordStatus.DISCARDED, word)

    def win_word(self, word=None):
        self._release_and_draw(WordStatus.PLAYED, word)

        if self.team.final_turn:
            self.end()

    def defer_word(self, word=None):
        self._release_and_draw(WordStatus.DEFERED, word)


@dataclass
class Team:
    """
    If the current_cycle reaches DEFAULT_MAX_CYCLES, set final_turn to True.

    If final_turn is True, plays should be set as their final_play.
    """
    name: str
    color: str
    num: int = None
    curr_category: Category = DEFAULT_START_CATEGORY
    total_wins: int = 0
    final_turn: bool = False
    turns: List[Turn] = field(default=list)

@dataclass
class Game:
    teams: List[Team]
    deck: Deck
    turns: List[Turn] = field(default_factory=list)
    num_categories: int = DEFAULT_NUM_CATEGORIES
    max_cycles: int = DEFAULT_MAX_CYCLES
    max_held: int = DEFAULT_MAX_HELD
    curr_team: Team = None
    curr_turn: Turn = None
    curr_turn_num: int = 0

    def start(self, ordered=True):
        if not ordered:
            random.shuffle(teams)

        self.set_team_numbers()

        self.loop()

    def loop(self):
        while True:
            self.start_turn()

            self.curr_turn.setup()
            # time for first move
            self.curr_turn.start()

            continue_turn = input("Enter to continue ")
            while not continue_turn:
                print(self.curr_turn.words)

                option = input("Enter action (d/w/p): ")
                if option == "d":
                    self.curr_turn.discard_word()
                elif option == "w":
                    self.curr_turn.win_word()
                elif option == "p":
                    self.curr_turn.defer_word()
                else:
                    pass

                continue_turn = input("Continue Turn? ")
            self.curr_turn.end()

            self.update_team_wins()

            if self.check_end_game():
                break

            self.update_team()

            self.advance_turn()

        self.end_game()

    def set_team_numbers(self):
        for i in range(len(self.teams)):
            self.teams[i].num = i

    def start_turn(self):
        self.curr_team = self.teams[self.curr_turn_num % len(self.teams)]
        self.curr_turn = Turn(
            num=self.curr_turn_num,
            team=self.curr_team,
            category=self.curr_team.curr_category,
            deck=self.deck,
        )
        self.turns.append(self.curr_turn)

    def update_team_wins(self):
        wins = self.curr_turn.wins()
        self.curr_team.total_wins += wins

    def check_end_game(self):
        return self.curr_team.final_turn and self.curr_turn.wins

    def update_team(self):
        self.curr_team.curr_category = Category(self.curr_team.total_wins % self.num_categories)

        if (self.curr_team.total_wins // self.num_categories) >= self.max_cycles:
            self.curr_team.final_turn = True
            self.curr_team.curr_category = Category.WILD

    def advance_turn(self):
        self.curr_turn_num += 1

    def end_game(self):
        return print(self.curr_team.name + " won!")

def import_deck():
    with open("categories.json") as f:
        json_deck = json.load(f)
    return Deck.from_json(json_deck)

def create_teams():
    num_teams = int(input("How many teams?: "))
    teams = []
    for _ in range(num_teams):
        name = input("Enter Team name: ")
        teams.append(Team(name, Color.RED))
    return teams

def main():

    deck = import_deck()
    teams = create_teams()

    game = Game(
        teams=teams,
        deck=deck,
    )

    game.start()

if __name__ == "__main__":
    main()

