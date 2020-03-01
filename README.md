# Articulate

A tiny, pure javascript, MVP of our houserules of the Articulate Game.
More here: https://www.drumondpark.com/rules/articulate

## Rules Changes
* There is no spinner or spin segments.
* Landing on a control/spade means you play normally except a random category
  is picked every time.
* The list of cards are not taken from the original game.
* The end of the game will function as per the standard control rules.
* Unless there is something I missed, all else should follow the rules as
  normal.

## Instructions
1. Goto https://github.com/ekohilas/articulate or run a http server such as `python3 -m http.server 8000`
2. Press the `start` button.
3. Enter number of teams and team names.
4. Press ready button to begin the round.
5. Your currently held card is stored in "holding" of the map.
    a. Press Win to score it and gain a new card.
    b. Press Discard to remove it and gain a new card.
    c. Press Defer to store it and gain a new card. Pressing defer again will
         cycle to the next card in your hand.
6. Repeat 4 until timer runs out, then press ready again to begin the new round.

## TODO
* Cleanup frontend javascript code.
    * Timer
    * Buttons
* Think of a clean UI to represent the board.
* Add a Tinder like card interface.
* Complete other functionality
* polyfill/babel
* do words need categoryies?
* do they need to know if they're wild?
* should holding be limited to one word?
* if added words are wild, should they come out of a seperate deck, and the normal deck at the same time?
* I assume classes are hashable by default
* Add sanity checks
* Are words hashable? and should they be?
* Test end final turn
