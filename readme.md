Inlcude your source code in this folder. You can also include executables here as well. 

Note: I made it so that the players are allowed to do multiple things per turn(end turn does not actually end turn)
It's not that its a bug,the logic is in the server module,but this makes it easier to test when you're alone since you don't have to control multiple players yourself and since it is a prototype I felt that it would be better this way.

Modules description:

server.js
- all the server side code and logic which should not be on the client for the game

DecKOfTiles.js
-the class for the Deck of Tiles used in the game

Tile.js 
-the objects inside the array in the DeckOfTiles object

static/game.js
- The client side, includes all displaying all visuals and logic for inputting runs/melds, updating joker, when to end turn, etc


To run the code you will need to clone this part of the repository. 
I used visual studio code, and when it is ran the link its running on should be http://localhost:5000/
You may need to install some of the frameworks like express
