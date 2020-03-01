# Articulate

## Instructions
1. run a http server such as `python3 -m http.server 8000`
2. enter number of teams and team names
3. Press start to start the round.
4. Your currently held card is stored in "0" of the array.
    b. Press Win to score it and gain a new card.
    c. Press Discard to remove it and gain a new card.
    a. Press Defer to store it and gain a new card. Pressing defer again will
         cycle to the next card in your hand.
5. Repeat 4 until timer runs out, then press Start again to start the new
   round.

## TODO
* Cleanup frontend javascript code.
    * Timer
    * Buttons
* Think of a clean UI to represent the board.
* Add a Tinder like card interface.
