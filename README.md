# Jeparty
jeopardy! server and client



how the connections should work:

game has 4 'states':
 - waiting   : players can join the game.
 - selecting : the master selects a questiong.
 - playing   : players buzz in.
 - reviewing : master decides whether or not an answer is correct.

>player<
 - the first message sent must be during 'waiting', and must be of the form 'PLAYER {name}'.
 - during 'playing', a player may send (any) message to indicate a buzz-in.
 - any other messages are ignored.

>master<
 - the first message sent must be during 'waiting', and must be of the form 'MASTER {name} {id}'.
 - during 'selecting', the master sends a message 'SELECT {category} {amount}' to select a question.
 - during 'playing' or 'reviewing', the master may send 'QUESTION_SKIP' to skip the current question.
 - during 'reviewing', the master sends 'QUESTION_CORRECT' or 'QUESTION_INCORRECT' for an answer.

>viewer<
 - messages sent are ignored.
 - receives massages from the server on game events, such as 'Bob (id: 3) answered correctly!'.



 ______    buzz
[player] -----------
                    \
                     \      ______              _________
 ______    buzz       ---->|      |   events   |         |          _______
[player] ----------------->|server| ---------->|  viewer | ------> [console]
                      ---->|______|            |_________|
                     /        ^     
 ______    buzz     /         |
[player] -----------          |
                              |
                              |
                             /
                            /
        ______   commands  /
       [ host ] -----------
