# Web versions of single-player board puzzles 
[En français](./LISEZMOI.md)

This directory provides the source files of web versions of single-player puzzle games published by [Smart Games](https://en.wikipedia.org/wiki/SmartGames) or [Think Fun](https://en.wikipedia.org/wiki/ThinkFun). These games present a situation with pieces that must be placed or slid onto the board to reach a “winning” position. The starting positions are categorized by difficulty level for reaching the final position.

I have always been a fan of this type of game in its physical form. For some of them, I developed Java versions, some of which were used for practical exercises in the programming courses I taught.

In all these computer versions, the program finds a solution using the minimum number of moves. This solution is obtained through a systematic breadth-first search of all possible configurations. These solutions are found in a matter of seconds, even for the most difficult configurations. This might be seen as a bit discouraging, but the goal is to have fun.

I decided to reprogram some of these games so they can be played in a web browser on a computer or phone. The code is written in JavaScript, and the display uses SVG, so it adapts to the screen. These games share a set of functions and classes to standardize their use and programming.


**Note**: These games have primarily been tested on a computer screen; their behavior is not guaranteed on a phone or tablet when you need to _swipe_ pieces to move them rather than tapping an arrow.

# Available Games

Here are the games currently available (in alphabetical order):
|     | Link for play | Goal of the game |
| --- | --- | --- |
| <img src="./images/AntiVirus.jpg" width="125px" /> | [Anti-Virus](./AntiVirus/AntiVirus.html) | Exit the red *virus* |
| <img src="./images/AsteroidEscape.jpg" width="125px" /> | [Asteroid Escape](./AsteroidEscape/AsteroidEscape.html) | Exit the plane avoiding asteroids |
| <img src="./images/CannibalMonsters.jpg" width="125px" /> | [Cannibal Monsters](./CannibalMonsters/CannibalMonsters.html) | Stack monsters until only one is left |
| <img src="./images/CatsNBoxes.jpg" width="125px" /> | [CatsNBoxes](./CatsNBoxes/CatsNBoxes.html) | Put all the cats in the boxes |
| <img src="./images/CityMaze.jpg" width="125px" /> | City Maze  <br>[Express Delivery](./CityMaze/CityMaze_Express_Delivery.html)  <br>[On the Double](./CityMaze/CityMaze_On_the_Double.html) | Build a path to reach all targets of the same color |
| <img src="./images/FlipIt.jpg" width="125px" /> | [Flip It](./FlipIt/FlipIt.html) | Flip all turtles |
| <img src="./images/GraveYardShift.jpg" width="125px" /> | [Graveyard Shift](./GraveYardShift/GraveYardShift.html) | Exit the pink piece by sliding pieces. |
| <img src="./images/GrizzlyGears.jpg" width="125px" /> | [Grizzly Gears](./GrizzlyGears/GrizzlyGears.html) | Move boats by rotating disks |
| <img src="./images/HotSpot.jpg" width="125px" /> | [Hot Spot](./HotSpot/HotSpot.html) | Make the red circle jump to the top left spot |
| <img src="./images/JumpIn.jpg" width="125px" /> | [Jump In](./JumpIn/JumpIn.html) | Make the rabbits find their hole |
| <img src="./images/LaserMaze.jpg" width="125px" /> | [Laser Maze](./LaserMaze/LaserMaze.html) | Make the laser touch all pieces and hit all targets |
| <img src="./images/RiverCrossing.jpg" width="125px" /> | [River Crossing](./RiverCrossing/RiverCrossing.html) | Make a hiker traverse go to the other side of the river |
| <img src="./images/RushHour.jpg" width="125px" /> | [Rush Hour](./RushHour/RushHour.html) | Exit the red car |
| <img src="./images/SnowProblem.jpg" width="125px" /> | [Snow Problem](./SnowProblem/SnowProblem.html) | Build snowmen by rolling balls |
| <img src="./images/SquirrelsGoNuts.jpg" width="125px" /> | [Squirrels Go Nuts](./SquirrelsGoNuts/SquirrelsGoNuts.html) | Make all  the squirrels hide their nut |
| <img src="./images/TempleTrap.jpg" width="125px" /> | [Tipover](./TempleTrap/TempleTrap.html) | Exit the adventurer by sliding labyrinth pieces |
| <img src="./images/Tilt.jpg" width="125px" /> | [Tilt](./Tilt/Tilt.html) | Push green button in the hole by *tilting* the board |
| <img src="./images/TipOver.jpg" width="125px" /> | [Tipover](./TipOver/TipOver.html) | Move a tipper across piles of crates |
| <img src="./images/Titanic.jpg" width="125px" /> | [Titanic](./Titanic/Titanic.html) | Board all shipwrecked people |

# Other documents

* [Document explaining the organization of the programs](./Organization.md). This is still in draft form!
* [Web page to help develop SVG `path` expressions](./SVG_Path_Playground/SVG_PP.html) 
* [Initialization script for starting a new game](./buildFromTemplate.js)
  * [Directory of templates for starting a new game](./Template)
* JavaScript files
  * [SVG creation and interaction functions](./SVGtools.js)
  * [Game solving functions](./Solver.js)
  * [Common graphical user interface functions](./Main.js)
  * *super* classes each game
    * [Board management](./Board.js)
    * [Game display](./Display.js)
    * [Grid information about the game](./Grid.js)
    * [Jump information][./Jumps.js]
    * [Piece information](./Piece.js)
* Auxiliary files
  * [Web page global organization](./body.html)
  * [Stylesheet](./Common.css)
  * [Coordinates i,j](./C.js)
  * [Launch all batch solvers](./Test_batch_all.zsh)
  * [Launch all games in a browser](./test_html_all.zsh)