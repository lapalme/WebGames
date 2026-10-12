---
title: Development of web versions of single-player puzzles 
author: Guy Lapalme
description: Principles underlying some web versions of single-player board puzzles
---

<center style="font-size:3em; font-family: 'Open Sans'; font-weight: bold"> Development of web versions of single-player puzzles 
</center>


<center><a href="mailto:lapalme@iro.umontreal.ca">Guy Lapalme</a><br/>RALI-DIRO<br/>Université de Montréal<br/>October 2026</center>

This document explains the underlying principles of web versions of some single-player puzzle games published by [Smart Games](https://en.wikipedia.org/wiki/SmartGames) or [Think Fun](https://en.wikipedia.org/wiki/ThinkFun). These games present a situation with pieces that must be placed or slid on a rectangular board in order to achieve a *winning* situation. The starting situations are classified by level of difficulty to reach the final situation.

I have always been a fan of this type of game in physical form. For a few of them, I once developed Java versions, some of which have been used for practical exercises in programming courses I taught.

These computer versions have the ability to discover a solution using the least possible number of moves or pieces. It does this by systematically exploring all possible game states using a breadth-first search. These solutions are found in a matter of seconds, often milliseconds, even in the most complex scenarios, which can sometimes be a bit *discouraging*, considering that many minutes are often needed to solve it *manually*.

I recently decided to rewrite some of these games to be played in a web browser, either on a computer or a phone. The code is written in JavaScript, and the graphics are displayed using SVG, allowing them to adapt automatically to the screen size.

Games can be categorized according to the fact that:

- All pieces are initially on the board, the moves being either or both

  - **Jumping** : a piece can jump over one for more other pieces   

  - **Sliding**:  slide them into a *winning* configuration. 

  Movement constraints must be taken into account, such as no overlap between pieces and the specific moves allowed by each piece.  In some games, pieces can disappear or change their appearance and behaviour.

- None or only a few pieces are initially on the board, the others being in a reserve 

  - **Placing**: find the place and orientation of pieces on the board 

In some games, pieces can change during the game\. This can happen through superposition or by flipping, resulting in different movement possibilities\.

<center>Table 1: Twenty-three games that are available in this directory: <br/>typical configuration, link to an <i>official description</i>,  goal and characteristics.<br/> 
  <b>J</b>: jumping, <b>S</b>: sliding, <b>P</b>: placing, <b>CP</b>: changing pieces</center>




|                                                              | Name                                                         | Goal                                                         | J    | S    | P    | CP   |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ | ---- | ---- | ---- | ---- |
| <img src="./images/HotSpot.jpg" style="width:200px;" />      | [HotSpot](https://theplayfulotter.blogspot.com/2018/08/hotspot.html) | Make the red circle jump to the top left spot                | ✓    |      |      |      |
| <img src="./images/RushHour.jpg" style="width:200px;" />     | [Rush Hour](https://www.ravensburger.us/en-US/products/games/thinkfun/rush-hour-76582) | Exit the red car                                             |      | ✓    |      |      |
| <img src="./images/AntiVirus.jpg" style="width:200px;" />    | [Anti-Virus](https://www.smartgames.eu/uk/one-player-games/anti-virus) | Exit the red *virus*                                         |      | ✓    |      |      |
| <img src="./images/AsteroidEscape.jpg" style="width:200px;" /> | [Asteroid Escape](https://www.smartgames.eu/uk/one-player-games/asteroid-escape-0) | Exit the plane avoiding asteroids                            |      | ✓    |      |      |
| <img src="./images/GraveYardShift.jpg" style="width:200px;" /> | [Graveyard Shift](https://www.smartgamesandpuzzles.com/graveyard-shift.html) | Exit the pink piece by sliding pieces.                       |      | ✓    |      |      |
| <img src="./images/LunarLockout.jpg" style="width:200px;" /> | [Lunar Lockout](https://puzzleworld.org/PuzzleWorld/puz/lunar_lockout.htm) | Slide the red piece to the center.                           |      | ✓    |      |      |
| <img src="./images/GrizzlyGears.jpg" style="width:200px;" /> | [GrizzlyGears](https://www.smartgames.eu/uk/one-player-games/grizzly-gears) | Move boats by rotating disks until they face their goal piece. |      | ✓    |      |      |
| <img src="./images/JumpIn.jpg" style="width:200px;" />       | [Jump In](https://www.smartgames.eu/uk/one-player-games/jump) | Make the rabbits find their hole                             | ✓    | ✓    |      |      |
| <img src="./images/ToadsNFrogs.jpg" style="width:200px;" />  | [Toads and Frogs](https://en.wikipedia.org/wiki/Toads_and_Frogs) | Swap positions of toads and frogs                            | ✓    | ✓    |      |      |
| <img src="./images/TempleTrap.jpg" style="width:200px;" />   | [TempleTrap](https://www.smartgames.eu/uk/one-player-games/temple-trap-0) | Exit the adventurer by sliding labyrinth pieces              | ✓    | ✓    |      |      |
| <img src="./images/RiverCrossing.jpg" style="width:200px;" /> | [River Crossing](https://www.think-fun.be/fr/products/river-crossing/) | Make a hiker traverse the river                              |      | ✓    | ✓    |      |
| <img src="./images/FlipIt.jpg" style="width:200px;" />       | [Flip It](https://trictrac.net/jeu-de-societe/flip-it)       | Flip all turtles                                             | ✓    |      |      | ✓    |
| <img src="./images/SnowProblem.jpg" style="width:200px;" />  | [Snow Problem](https://www.smartgames.eu/uk/one-player-games/snow-problem) | Build snowmen by rolling balls                               |      | ✓    |      | ✓    |
| <img src="./images/Titanic.jpg" style="width:200px;" />      | [Titanic](https://www.smartgamesandpuzzles.com/titanic.html) | Board all shipwrecked people                                 |      | ✓    |      | ✓    |
| <img src="./images/Tilt.jpg" style="width:200px;" />         | Tilt                                                         | Push the green button into the hole by tilting the board, avoiding sending a blue button in the hole |      | ✓    |      | ✓    |
| <img src="./images/SquirrelsGoNuts.jpg" style="width:200px" /> | [Squirrel Go Nuts](https://www.smartgames.eu/uk/one-player-games/squirrels-go-nuts) | Make all squirrels hide their nut                            |      | ✓    |      | ✓    |
| <img src="./images/ExpressCourier.jpg" style="width:200px" /> | [Express Courier](https://www.smartgames.eu/uk/one-player-games/express-courier) | Exit all cargo crates using trucks                           |      | ✓    |      | ✓    |
| <img src="./images/LaserMaze.jpg" style="width:200px;"/>     | [Laser Maze](https://www.ravensburger.us/en-US/products/games/thinkfun/laser-maze-44001014#) | Make the laser touch pieces and hit targets by placing mirrors. |      |      | ✓    | ✓    |
| <img src="./images/CityMaze.jpg" style="width:200px;" />     | [City Maze](https://www.smartgamesandpuzzles.com/city-maze.html) | Build a path with arrows to reach all  targets               |      |      | ✓    | ✓    |
| <img src="./images/CatsNBoxes.jpg" style="width:200px;" />   | [Cats & Boxes](https://www.smartgames.eu/uk/one-player-games/cats-boxes) | Put all the cats in the boxes by swapping pieces             |      |      | ✓    | ✓    |
| <img src="./images/BendIt.jpg" style="width:200px;" />       | [BendIt](https://www.smartgamesandpuzzles.com/bend-it.html)  | Bend pieces so that they can all be placed on the board over balls of the same color |      |      | ✓    | ✓    |
| <img src="./images/CannibalMonsters.jpg" style="width:200px;" /> | [Cannibal Monsters](https://www.smartgamesandpuzzles.com/cannibal-monsters.html) | Stack monsters until only one is left                        | ✓    | ✓    |      | ✓    |
| <img src="./images/TipOver.jpg" style="width:200px;" />      | [TipOver](https://www.fatbraintoys.com/toy_companies/thinkfun/tipover.cfm) | Move a tipper across piles of crates to reach the red piece. |      | ✓    | ✓    | ✓    |

Some details about these games:

- **Jumping**:
  - *Hot Spot*: pieces must jump over others, but bigger pieces cannot land one besides another
- **Sliding**:
  - *Rush Hour*: the movements of pieces depend on the positions of others. In certain arrangements, there are two vehicles to leave, so when the first one departs, it is removed from the board.
  - *Anti-Virus*: pieces are positioned at the intersections of the lines of the grid. The board is tilted, and the pieces are tangled, meaning that moving one piece can also affect others. 
  - *Asteroid Escape*:  as some pieces overlap on the positions of other pieces, they can interfere with their movements.
  - *Graveyard Shift*: pieces of different polygonal shapes slide but as other pieces outstretch on the exterior, so they  can block the movement of other pieces. 
  - *Lunar Lockout*: pieces can only slide up to to being blocked by another piece. 
  - *Grizzly Gears* : pieces (boats) are displaced by rotating disks whose positions might interfere with surrounding pieces. Although the movements seem limited, the right moves are often counterintuitive. The movements in this game are quite different from the usual sliding or placing because pieces slide when other pieces are rotated. It was quite challenging to cast this game in the framework we had defined, but we finally found a way. The display for this game was also more difficult to develop because of the rotating pieces.
- **Jumping, Sliding**:
  - *Jump In*: foxes slide, but rabbits must jump
  - *Toads and Frogs:*  pieces can slide into one space or jump over another one
  - *Temple Trap:* pieces can slide to a neighboring position, but a piece cannot be moved when the adventurer is on it. The adventurer can only move to pieces that are accessible, i.e., not crossing a wall or on the same floor.
- **Sliding, Placing** :
  - *River Crossing*: a plank can be removed and placed elsewhere on an adjacent plank, so it can overlap its previous position.
- **Jumping, Changing pieces**:
  - *Flip It* : each piece can be in two states that are flipped when another piece jumps over it.
- **Sliding, Changing pieces:**
  - *Snow Problem*: some pieces can be put on top of others and thus removed from the board.
  - *Titanic*: the shipwrecked people (shown as circles) can be put on the boats, so they are removed from the board. Modifying the ship changes its maneuvers; full boats cannot move, restricting others.
  - *Tilt*:  send the green buttons into the central *black hole,* which makes them disappear, while avoiding sliding a blue button in the hole., As pieces are moved by tilting the board,  many pieces can change place in a single jump.
  - *Squirrel Go Nuts*: the goal is to slide squirrels with nuts over holes in which the nut will fall. Both the board and some pieces can change their state during the game.
  - *Express Courier*: pieces can unload and load their cargo only when they are adjacent to each other. Slide the trucks to pick up cargo crates of their color and then slide out of the board. During the game, trucks can change by adding or removing crates. A truck is removed once it exits the board. 
- **Placing, Changing pieces**:
  - *Laser Maze*:  place a laser, mirrors and targets on the board so that the laser reflects on all pieces while hitting a given number of targets. Some selected pieces in a given configuration can be moved or rotated. 
  - *City Maze*: the pieces are not all given in the starting configuration. The player must select some pieces and place them on the board with the proper orientation in order to form a path between a starting arrow and all final crosses. Since the pieces have a red or blue side, a variant of this game allows for paths of different colors. 
  - *Cats & Boxes*: a piece must be removed before being placed elsewhere, so in a way it can overlap its previous positions, but not another piece.
  - *Bend It*:  pieces can change their orientation and form by rotating some parts, possibly by rotating in 3D.
- **Jumping, Sliding, Changing pieces**:
  - *Cannibal Monsters*: monsters can eat others if their bases correspond strictly, so pieces evolve over time.
- **Sliding, Placing, Changing pieces:**
  - *TipOver* : a piece is a crate of a certain height that, when tripped, lies on the board and it stays as it is for the rest of the game.

Most of these games are already available in electronic form. They can be downloaded from a website, or from a smartphone app store. Their graphics are usually much more sophisticated than mine. My primary objective in crafting this document is pedagogical, aiming to structure the common functions and classes among these games. I also chose games that have different features for pieces and their movements. Writing this document has been very useful in helping me clarify my thoughts.

# Characteristics of the Games

In the following we use the following naming conventions:

- **board**: a rectangular *grid* with *M* rows and *N* columns\. In some games, some positions on the board have a special role. For example, in *Tilt*, *Anti-Virus* or *Rush Hour*, reaching a certain position indicates a winning situation.
- **piece**: an element of the game that can be placed on the board; it has a **position**: *i, j*,  row and column numbers starting from 0.  In some games, a piece can have an **orientation** identified either by a cardinal point or an arrow. In some games, pieces have other characteristics, such as being *flipped* or *stacked*  over other pieces.
- **reserve**: a section of the board in which pieces are kept before being placed on the board. 
- **display**: a screen representation of the board;
- **configuration**: encoding of the position and orientation of the pieces at the start of the game in a form that is convenient to input from what is shown in the game booklet.  
- **state**: encoding of the position and orientation of each piece during the game; a state must be able to represent all possible game situations while being efficient to be encoded and decoded during the game. 
  - The *initial* state is obtained from the configuration. 

  - A *winning* state is a *configuration* identified as the goal of the game. 
- **jump** : an action where a piece changes its position, possibly affecting other pieces on the board. Placing a piece to a position with an orientation can be thought of as a jump from the reserve to the board in the correct position. A jump is linked to a previous jump, so the jumps leading to a winning state can be displayed. It is also possible to undo previous jumps.
- **move** : consecutive jumps by the same piece.  

The starting state determines the initial position of pieces on the board. The goal of the game is to determine the jumps of the pieces around on the board according to a set of rules until they form a *winning* state. A *solution* is, therefore, a list of *jumps* that can  go from the initial state to the desired winning state.

These games come with a booklet of starting configurations, classified by level of difficulty, to achieve a winning configuration. Often, there are many ways to solve a puzzle. The booklet shows one solution with the fewest number of moves or jumps. 

Each game comes with its own set of challenges, and that’s all part of the fun\. 

The computer version of these games has several advantages :

- The constraints of each game are systematically enforced, while it can happen that a player with a physical board sometimes forgets a side effect of a move or performs an illegal move. 
- For sliding  games, the allowed moves are displayed at each step from which the player chooses one. This is helpful in not forgetting allowed moves, so in a way it simplifies the game because it shows all possibilities, while a player might miss a possibility with a physical board.
- It is very easy to *undo* the moves and even restart a configuration, while this is error-prone or inconvenient with the physical board.
- It is less noisy and annoying for other people in the room who do not play (e.g., my wife)!
- The system can compute and display a solution very fast, which can also be a bit intimidating at times.

The disadvantage is that players do not get physical feedback from the pieces. Also, the game increases screen time on the computer or phone. 

After developing several of these games, I noticed that they have many commonalities. Therefore, I developed a framework that describes generalizable processes that can be applied across different games. This document uses *Flip It* as an example because it is relatively straightforward, but it also highlights some intriguing challenges. 

When tackling a new game, I suggest starting by developing an algorithm to determine the jumps from the starting state to a winning state without a graphical user interface. This *compels* to define the notation of the states, the allowed moves, the state changes after a move and the process to find a solution. Once that is done, this algorithm can be embedded into the graphical framework we have established. This process is further explained in section [4.1](#steps-for-building-a-new-game).

# Searching for a Solution

The goal of each game is finding a set of jumps between a starting state to a winning one. This sequence of jumps can be discovered using traditional AI search algorithms. Specifically, these games are single-player with complete information and full transparency. Given that the number of possible jumps  at each step is limited, a breadth-first search approach ensures finding the shortest possible path to a solution in the minimum number of jumps or proving that no such a path exists.

We first describe how this search is implemented using  *Flip It* as an example, as its state description is straightforward. However, the search algorithm remains the same for other games.

*Flip It* is a variation of the classic *Solitaire* game played on a 4 × 4 grid, as illustrated in the top row of Table 2. Each space is designated by a letter, and the initial setup depicts turtles resting with their orange bellies facing upward (as seen in the first image). The letter associated with each grid cell can be inferred based on its surroundings or by hovering your cursor over the turtle, revealing its position. The goal is to find a series of jumps to turn them all onto their bellies.  A turtle flips onto its belly or back when another jumps over it. The jumping turtle is not flipped. A turtle can only jump over one or two other turtles located on the same row, column, or diagonal. In the figures below, possible jumps are shown with a blue arrow.

The second picture shows when the turtle in A jumped to C, flipping the turtle in B and then to K, flipping G\. These consecutive jumps with the same piece are called a move\. The two following jumps flip the turtles in K and F, giving rise to a situation where all turtles are belly up, thus forming a winning situation. Note that, in the third picture, a different winning situation could have arisen if K had moved to A.

<table>
    <tr>
        <td><img src="./images/Flip-It-4-A.jpg" style="zoom:40%;" /></td>
        <td><img src="./images/Flip-It-4-1-A.jpg" style="zoom:40%;"></td>
        <td><img src="./images/Flip-It-4-2-A.jpg" style="zoom:40%;" /></td>
        <td><img src="./images/Flip-It-4-3.jpg" style="zoom:40%;" /></td>
    </tr>
    <tr>
        <td>Initial state</td>
        <td>Move A-CK</td>
        <td>Jump G-O</td>
        <td>Jump B-J - Win!</td>
    </tr>
    <tr>
        <td>ABFG</td>
        <td>bFgK</td>
        <td>bFko</td>
        <td>bfko</td>
    </tr>
    <tr>
        <td>A-C,A-K,B-J,B-L,F-H,G-E</td>
        <td>B-J,B-L,F-H,G-E,G-O,K-A</td>
        <td>B-J,F-P,K-A,O-G</td>
        <td></td>
    </tr>
    <caption>Table 2: Initial state, followed by a move and a jump to get to a <i>winning</i> state  in <i>Flip It</i>. 
The third line shows the state string that encodes it.
The last line shows the list of possible jumps in each state.</caption>
</table>

## Definition of a State

In this type of puzzle, a state is defined by the *position* of each piece on the board given by its row and column indices; a piece can also be in a given state such as its orientation or stacking other pieces.  To prevent endless loops, it is crucial to efficiently mark explored states. This can be accomplished by encoding the state in a way that makes it simple and quick to determine whether a position has already been visited or needs to be explored in the future.

In JavaScript, one can achieve this using either a `Set` or a `Map` data structure, with a string as the key. For *Flip It*, we opted for the encoding displayed in the third row of Table 2. Only the positions that have a turtle are specified, using the corresponding letter; when the turtle is on its back, we use the corresponding lowercase character. Certainly, we could have opted for a more compact encoding, where each position has just three states: empty, belly or back. With 2 bits for 16 positions, we could have used 32 bits. However, for development convenience, we chose to use a more descriptive string for each position.

For more complex state definitions, we merely *stringify* the JSON encoding of the state and use this string as  a key in the *Set* or *Map*.

## Definition of Configurations

Each game comes with a booklet that contains a numbered list of interesting configurations, organized into levels by the game designer. The content of the booklet must be converted into a computer-readable format that serves as an initial state. For *Flip I*t we use only the letter corresponding to a cell with a turtle. Therefore, the problem description is in the same format as the initial state, but this is not always the case. For example, for *Titanic*, the input format was chosen to be easy to enter. Unfortunately, it did not allow for encoding all possible states, including those involving boats carrying passengers, as will be discussed in the next subsection. 

A JavaScript file contains a list of levels, each with its unique attributes, along with an object that maps problem numbers to their respective initial input states. 

This file also contains code for validating input states. For *Flip It* this consists of a string containing between three and fifteen uppercase letters from A to P, with no duplicates. Problem strings can also serve as starting states, so the conversion from the input to a starting state is only a name change in the export directive.

```json
export {levels, problems as startStates}
const levels =[{"en":"Beginner","fr":"Débutant","from":1,"to":10},
               {"en":"Intermediate","fr":"Intermédiaire","from":11,"to":20},
               {"en":"Advanced","fr":"Avancé","from":21,"to":30},
               {"en":"Expert","fr":"Expert","from":31,"to":40}];

const problems = {
      1:"ABH",
      ...
      40:"ABCDEFGHIJLMNOP"
   }

// validate problems and convert them to start states
```

## Conversion from a problem to a starting state

For most games, the configuration must be encoded in a state that can be easily parsed, as this operation is done at each step of the solving process. 

The second column of Table 3 shows the input string corresponding to the problem shown in the *Titanic* booklet as in the first column . The direction of each boat is indicated by an arrow followed by the number of the boat in a template literally enclosed in backticks. The passengers are represented by the corresponding letter, while empty spaces are represented by dashes. This is appropriate for a starting position without any passengers on the boat. However, a comprehensive state must accommodate boats carrying passengers and passengers aware of their current vessel. The third column displays the JSON representation associated with the initial position. We had previously created a simpler, ad hoc encoding  parsed with a regular expression. However, we discovered that the JSON encoding and decoding process is significantly more efficient at run-time. 

<center>Table 3: Input  format and the corresponding JSON encoding for <i>Titanic</i></center>

| <img src="./images/Titanic-1.jpg" style="zoom:25%;" /> | <img src="./images/Titanic-1-input.jpg" style="zoom:150%;" /> | <img src="./images/Titanic-1-JSON.jpg" style="zoom:150%;" /> |
| :----------------------------------------------------------: | ------------------------------------------------------------ | ------------------------------------------------------------ |

The game of *Anti-Virus* presents an intriguing example of a transformed state. Due to the inclined board, the lines of the grid have varying lengths, making indexing slightly more complicated. However, for the initial position input, we use the *visible* portion of the grid. 

The initial cell on the first row of Table 4 displays a board that shows the coordinates of the intersections: a zero-based index for each row and a zero-based index from the left for each row. The adjacent cell shows the corresponding input notation for this problem: each piece is enclosed in square brackets, starting with the piece number, followed by the coordinates as zero-based line and column numbers from the top and left. The position of the *center* is given first, followed by the positions of the other dots. 

The left cell of the second line of Table 4 shows how the *visible lo*zenge is embedded in a rectangular grid of 8 lines of 7 cells each. Unused positions are shown with a dot and empty positions with an underline. This grid numbering is used to encode states in JSON with embedded lists. The right cell of the second line shows an example. In it, the first sublist of a piece indicates the line and column numbers of its center. Other sublists are relative positions from this center. By using relative positions, moving a piece after a jump becomes easier. Only the *center* needs to be translated, since the entire SVG is relocated due to its built-in relative translation capabilities.

<center>Table 4: Input format and internal representation for <i>Anti-Virus</i></center>

| <img src="./images/AntiVirus-2-coord.jpg" style="zoom:50%;" /> | <img src="./images/AntiVirus-2-input.jpg" style="zoom:150%;" /> |
| :----------------------------------------------------------: | ------------------------------------------------------------ |
| <img src="./images/AntiVirus-2-coord-abs.jpg" style="zoom:100%;" /> | <img src="./images/AntiVirus-2-JSON.jpg" style="zoom:80%;" /> |



## Possible jumps for each piece

To begin, the set of all possible jumps for each state must be established. For *Flip It,* each turtle is examined to determine if it is adjacent to another turtle horizontally, vertically, or diagonally, and if it can jump over one or two other turtles. Table 2’s fourth row displays the potential jumps for the first three stages. Of course, in some games, jumps can be more intricate, such as not overlapping another piece or rotating or turning it over. 

As a breadth-first search technique is used, it is usually a good heuristic to select the pieces with the least possible number of moves at each step. In that way, the search tree width is somewhat limited, but this can be counterproductive, in some cases, if the *wrong* piece and orientation are first tried.

After each jump, the game’s state must be updated to reflect where the piece has moved, as well as any potential side effects. In *Flip It*, this means *turning over* the turtles that were jumped. In some games, such as *Titanic* and *Squirrels Go Nuts*, a jump can change the piece (boarding people or losing a nut)  and the board (removing people from the sea or filling a hole) . But that effect is only taken into account if this move is chosen, but it should be computed when finding the possible moves.

For some games, finding possible moves can be more involved. For placing games, such as *City Maze* or *Laser Maze*, in order to limit the number of possible moves, pieces from the reserve should not be tried everywhere on the board but only on free places along the path of the ray or the laser. Moreover, when there are similar pieces in the reserve, only one of each kind should be tried at a given step. For *Laser Maze*, at each step, we first pick the pieces from the reserve with the least number of orientations. 

The parts in *Grizzly G*ears only turn 90 degrees in either direction, making one might believe that figuring out the moves would be easy\. However, the task proved to be quite complex due to the unique shape of each piece and the orientation of its neighbors\. The presence of a shared rotating disk between two moving boats further complicates the problem\.

In *Bend It*, the pieces in the reserve can be manipulated in three different ways at each end\: they can be bent, rotated, or flipped\. Once prepared, they are placed on the board\. Once placed on the board, each enclosed area must have a minimum of six empty spaces\. However, we have chosen to disregard this challenging\-to\-implement requirement, as exhaustively exploring all possible positions is already sufficiently fast\.

##  Exploring States

The following algorithm outlines a *simili* JavaScript implementation of systematic state exploration using breadth\-first search\. It also keeps track of the transitions between configurations, starting with the current `state` represented as a string\. This implementation leverages the property of a JavaScript `Map` that preserves the insertion order of its elements during traversal, making it possible to remove the *first* element, which is the *old*est’ one\.

```javascript
done = new Set()  // set of seen configurations
to_do = new Map() // Map: key: configuration, value: the last jump
lastJump = null
to_do.set(state,last_jump)
while (to_do.size>0){
   [state,last_jump] = remove_first(to_do)
   current = new Board(config);
   allowed_jumps = current.allowed_jumps();
   reorder(allowed_jumps) // optional
   for (jump of allowed_jumps){
       current.play(jump)
       if (current.isComplete()) // exit as soon as a solution is found
          	return [current,jump.extend(lastJump)] 
       else { // save new state if it has not yet been seen or saved
            state_new = state.to_config();
            if (!done.has(state_new) && !to_do.has(state_new))
                to_do.set(state_new,jump.extend(lastJump))
       }
       current = new Board(config) // recover the initial state for this iteration
   }
}
return null // no solution found after having explored all states
```

This algorithm guarantees finding the solution with the fewest jumps, but not necessarily in the fewest moves. It achieves this by evaluating all states following n jumps before progressing to those following n\+1 jumps, and terminating as soon as a solution is found\.

To maximize the number of consecutive jumps on a single piece, the permitted jumps (as defined in line 9) are reorganized to prioritize exploratory jumps that continue the previous jump with the same piece\. This approach is advantageous, but it does not guarantee the minimum number of moves\. 

The sequence of jumps can be recovered by following the links between each jumps. This inverted list is then condensed, with successive jumps involving the same piece combined into one move (as displayed in the second column of Table 2)\. This approach shows the path to the solution\.

This algorithm is very fast for *Flip It* and other games, taking only a few milliseconds on a MacBook Pro for most problems. However, a very difficult problem (the state `ABCDFGJKMNOP` with four empty spaces) took almost 10 minutes after more than 2 million iterations, leaving 1.7 million configurations unexplored for a solution in 11 jumps. We thus see that even a seemingly simple game can lead to many different states.

# Web application

Using a computer to solve a puzzle can be intriguing, but nothing beats the excitement of manually manipulating pieces on a digital screen or engaging in hands-on play with a tangible version. 

On the computer, however, the system allows only permitted moves and displays a message of congratulations upon encountering a winning situation. Sometimes, the system can discern that a solution is unattainable from a specific state. At the moment, it recognizes this scenario when no piece can move from that state. However, a piece may still be able to move, albeit only to a previous state. In theory, one could implement the algorithm from the previous section after each move to identify an insoluble case. We have chosen not to do so.  The computer program’s convenience is that it allows for an easy reversal of recent jumps or restoration to the initial state. 

<figure>
<figcaption style="text-align:center">Figure 1: Graphical User Interface for <i>Flip It</i></figcaption>
<img src="./images/FlipIt-GUI-A.jpg" style="width:780px; border: thin solid black"/>
</figure>

The common screen layout for all games is described once again using *Flip It* (Figure 1). The center is for the board. Turtles are made to jump by clicking an arrow. Additionally, if one turtle jumps over another, the latter is *flipped*.  Arrows only indicate the permitted directions\. The user can thus only choose a valid move at each step. This greatly simplifies programming, as there is no need for jump validation. This might be considered as a simplification of the game, because it might show moves that could have been *overlooked* by the player. 

Another approach allows dragging a turtle to another square.If a turtle is moved to an unauthorized position, it returns to its initial spot. This slightly complicates the GUI programming, but is perhaps more intuitive for the user.  

The arrow on the left of the board is used to *undo* the previous jump; the arrow on the right *restarts* the current problem. These buttons are hidden on a small screen, such as on a smartphone, so that the game display appears at the top.

The bottom left part of the board is used to select an initial configuration from a range of levels of difficulty. These correspond to the numbered configurations listed in the manual or physical game cards.

The lower right corner serves as a message area, where the system displays either the user’s jump sequences leading to a winning configuration, or a solution found upon clicking the `Solve` button. 

By clicking on the top-right corner, you will find explanations of the game’s rules and how to use the graphic interface. These instructions are available in both English and French.

Each game has its own distinctive method of moving pieces on the board, which sets it apart. For instance, in *Snow Problem* players roll a snowball by clicking on an arrow. In *Titanic* players can also navigate boats using the arrow keys on the keyboard. For *River Crossing*, clicking is used for either moving the hiker or for showing where a plank must be put.

The fundamental principles of all games remain the same: a board, pieces, and a way to move them around. This is a classic example of the Model-View-Controller architecture, with the state serving as the model, the display as the view, and the mouse and keyboard as the controller.

## Application Organization

The application uses an object\-oriented structure, where each component is a subclass of the `Piece` class, which stores its identification, row, and column index on the board\.  The behavior of a piece for each game is given by a subclass, which must implement at least methods to draw itself (in the context of the graphical application), to change its state (e.g., flipping in *Flip It* ) and to compute all possible jumps given a grid configuration. The board is represented by the class `Board`. It stores the current state and a link to the associated display (in the context of a graphic application). Subclasses of `Board` must define methods for calculating all available moves in the current state, verifying its completion, executing a move, and reversing the previous move\. This method can be invoked multiple times to undo multiple moves\.

Using instances of subclasses of `Piece` and `Board`, the solver of [Section 2\.4](#exploring-states) returns the list of moves and jumps\. The generic `solveAll` method calls the solver on a set of starting states, then prints the corresponding list of moves to reach the final state\.

## Web Application Organization

However, it is more *spectacular* to develop a web application\. To do this, we define a class `Display` that creates the background content to which the drawings of the pieces will be added\. It also handles user actions, such as tracking mouse movements and choosing problems, and launches undo of moves.

All applications have a common screen interface for choosing problems, *undo*, *replay*, and language selection\. This part remains the same in all games\.

We chose SVG for graphics because SVG elements can be easily moved and rotated to match physical actions. Moreover, overlapping drawings simulate the board in the background with pieces of different shapes over it. Furthermore, these graphics can seamlessly adapt to any screen size, all while using a single internal coordinate system\.  

Transforming the screen pixel coordinates of a mouse click into SVG coordinates is more intricate\. It considers the global SVG element’s location on the screen, as well as its width and height, along with the dimensions of the view box\. 

A listener can be attached to each SVG element that can move\. This allows the specific element to be identified using the `currentTarget` field of the event when a mouse click occurs\. Since only valid moves are displayed as choices, there is no need to validate the jumps during the game\. 

Since several graphics in a game share a similar form, they can be described only once within a `defs` tag\. Subsequent `use` tags can then reference them in either the `background` or `pieces` sections\. This setup ensures that the pieces are displayed over the background representing the physical board because the graphic elements are displayed in document order\. 

```html
<svg viewBox="0 0 4 4" xmlns="http://www.w3.org/2000/svg" id="svg_element" width="400px">
    <defs id="defs"></defs>
    <g id="background"></g>
    <g id="pieces"></g>
</svg>
```

 *Anti-Virus*, shown in the second table of section 2.3, makes use of the power of SVG. It creates the board and pieces using absolute coordinates in an 8 × 7 grid that is rotated 45° within the view\. In addition, a *filter* that softens and shifts the drawings of the pieces creates a drop shadow effect that makes them stand out\. This filter effect is also used in other games\. Unfortunately, the Safari browser does not implement it correctly, so it is not applied when the game is running in this browser\.

Creating SVG elements, a natural choice would have been *D3*\. However this library is geared towards data analysis and animation\.  Instead, we used *jQuery* because it makes it easy to manipulate HTML elements\. As SVG elements are in a specific name space, we used a function to create them with an object whose keys are the attribute names and values are their corresponding values\.

```javascript
function svg(tagName,attrs,...body){
    var $e = $(document.createElementNS('http://www.w3.org/2000/svg',tagName));
    if(arguments.length>1){
        $e.attr(attrs);
        if(body!=null)$e.append(body);
    }
    return $e;
}
```

The following subsection shows an example of invoking this function\.

### Board representation

The playing surface is an MxN grid. To facilitate drawing and position calculation, each position on the board is a square unit\. The `viewBox` attribute of the global `svg` element shown above ensures that the system adjusts the graphics to the precise pixel coordinates\.  

The following code defines a single cell on the board that will be *used* 16 times in *Flip It*\. This cell consists of a rectangle covering the entire 1 by 1 square, and then draws a circle with a radius of 0\.4 and a center at 0\.5, 0\.5\. Because the color of the circle differs slightly from that of the rectangle, it recalls the colors of the original game\.   

```swift
svg("g",{id:"board-def"},
   svg("rect",{width:1,height:1, fill:"#AAFF00",stroke:"#00FF00","stroke-width":0.02}),
   svg("circle",{cx:0.5,cy:0.5,r:0.4,fill:"#90EE90", stroke:"#00FF00","stroke-width":0.05})
)
```

### Piece 

Each piece of a given game is represented by a subclass of the following *abstract* class `Piece`. 

```javascript
class Piece {
    constructor (id,i,j) {
        this.id = id;
        this.i  = i;
        this.j  = j;
        this.drawing = null;
    }
    
    toString(){
        return `Piece(${this.id},${this.i},${this.j})`
    }
    
    toState(){ // returns a state representation
        throw new Error("Piece.toState: should be redefined in a subclass")
    }
    
    possibleJumps(grid){ // returns a list of instances of a subclass of Jump
        throw new Error("Piece.possibleJumps: should be redefined in a subclass")
    }
    
    draw(){ // creates this.drawing and returns it
        throw new Error("Piece.possibleJumps: should be redefined in a subclass")
    }
}
```

### Jump representation

It is important to keep track of the jumps and moves. We recall that a jump is the movement of a piece from position on the board to another, with possible other side effects or change of direction. The list of jumps that have been played up to a given state must be kept up to date. 

For this, we define the `Jump` class, whose structure is given in the following code block. This class is usually subclassed for customizing its behaviour for a given game: for example,  fields can be added when a jump implies more than a simple change of position; redefining `toString()` and `moveToString()` allows the string representation of jumps and moves to match the notation of the original physical game. 

The `precedent` field is used in `extend` to link this jump to a previous one; as many jumps are possible from a given jump, this allows sharing without repeating the list in each case. This linked list is also used when *undoing* jumps. 

This class also has useful methods: `direction()` for computing the difference in coordinates between the start and the end positions of the jump. From this direction, it is possible to compute an appropriate arrow symbol and rotation angle for the SVG arrow to represent this jump. A default arrow presentation is also provided.

```javascript
class Jump {
    constructor(from,to){  // from,to are arrays of two integers i,j
        this.from = {i:from[0],j:from[1]}
        this.to   = {i:to[0],  j:to[1]}
        this.precedent = null; 
    }
  	// representation
    toString(){...}
    moveToString(){...}
    // linking
    extend(previousJump){
        this.precedent = previousJump;
        return this;
    }
    // displacement
    direction(){...}
    arrow(){...}
    rotation(){...}
    showArrow(stroke){...}
}
```

### Display

For most web games, possible jumps in a given configuration are displayed as arrows over pieces. When an arrow is clicked, the piece is moved accordingly, the display is updated and possible new moves are displayed unless a winning configuration is reached, in which case a congratulatory message is shown. At each step, the display keeps track of the chosen jump, so at the end, the list of moves is displayed.  It is also possible to undo the last moves up to the starting configuration.  All these operations can be represented by the following *abstract* `Display` class.

```swift
class Display {  
    constructor (){
        this.makeDefs($("#defs"))
        this.allJumps = null  
        this.board  = null // current board
    }
    
    makeDefs($defs){ 
        // SVG representations for the reset and undo "buttons" and for an arrow
    }
    
    makeBackground($background,grid){
        throw new Error("Display.makeBackground: should be redefined in a subclass")
    }
    
    setBoard(board){ 
      // set backround and draw all pieces
    }
    
    showPossibles(arrowColor="blue"){ 
      // display arrows and link to the action
    }

    undo(){ 
      // undo by going back in the move list
    }
    
    pointerdown(e){ 
      // handle click on an arrow
    }

    showBravo(allJumps,showMoves,M,N){...}
}
```

### Using this framework

When a game can be cast into this framework, the game display can be simplified to the sole definition of `makeDefs` to add specific definitions and `makeBackground` to set up the board. The following code gives an overview of the code for the display for the game *Flip It*.

Each drawing is created in a square unit\. Each cell forming the bottom of the board is a square with a circle inside. A turtle drawing is defined with a set of ellipses of varying sizes. However, a more skilled graphic designer could undoubtedly create a more realistic version\. There is another very similar drawing for the *belly\-up* turtle\.  The SVG definitions will be used in the drawing of a piece when called in the `setBoard` method shown above.

```swift
class FlipIt_Display extends Display {    
    makeDefs($defs){
      	function turtle(tummy){...} // north oriented turtle
        super.makeDefs($defs);
        $defs.append(
            svg("g",{id:"fond-def"},
                svg("rect",{width:1,height:1, fill:"#AAFF00","stroke":"#00FF00","stroke-width":0.02}),
                svg("circle",{cx:0.5,cy:0.5,r:0.4,fill:"#90EE90", stroke:"#00FF00","stroke-width":0.05})
            ),
            svg("g",{id:"turtle-flipped",transform:rotate(30,0.5,0.5)},
                ...turtle("#40826D")
            ),
            svg("g",{id:"turtle",transform:rotate(-30,0.5,0.5)},
                 ...turtle("orange")             
            )
        )
    }
    
    makeBackground($background,grid){ 
        grid.forEach((i,j,v)=>{
            $background.append(
                svg("use",{href:"#fond-def",class:"fond",id:"f"+i+j,transform:translate(j,i)}),
                cText(ij2letter[i][j],j+0.5,i+0.5,"#DCDCDC")
            )
        })
    }
}
```

This framework is used verbatim for 12 sliding or jumping games : *AntiVirus, Cannibal Monsters, Express Courier, Flip It, Hansel & Gretel, Hot Spot, Jump In, Lunar Lockout, Rush Hour, Snow Problem, Squirrel Go Nuts, Toads and Frogs*.There was no need to add anything to go from the batch system to the web application outside of defining how to draw a piece. The GUI programming was thus greatly simplified.

### Special display for some games

However, this display scheme is not appropriate for all games, especially when pieces can be rotated or taken from a reserve.  So we customize the display while keeping intact the saving of jumps and the undo mechanism. In some cases, jumps can also be specified using the keyboard arrows. Here are games which feature special display mechanisms  :

- *AsteroidEscape* : each cell is divided into four, and some pieces, notably the plane, can span over the neighbouring cells. Big stones can also obstruct the movement of other pieces. In order to keep the visual aspect of the game, pieces must be drawn in two steps: first to draw the bottom of the tile and then the overlapping parts of the pieces. Only the pieces adjacent to the hole can be moved\. Therefo*re*, there is no need for directional arrows, as clicking on a movable piece causes it to move in a single direction\. This simplifies the user interface, but a way must be found to indicate that the user has clicked on an unmovable piece\. We use *flashing* to do this.
- *Bend It* : pieces can change form and orientation but they can also be flipped horizontally or vertically. So a piece in the reserve must first be put in a folding area where it can be manipulated before being placed on the board, The user interface for these manipulations proved to be somewhat intricate.
- *City Maze*: its underlying grid is 18 by 18 and not 6 by 6, as would be expected just by looking at the board. This is necessary to take into account the possible shapes and orientations of arrows that can block the placement of others. 
- *Grizzly Gears* : the round shapes for the board, the disks and the boats are quite different than the usual rectangles for other games. They were implemented using the circle and arcs of the SVG `path` commands. The fact that a boat can be *shared* between two disks added a level of complexity when determining the origin of its rotation. 
- *River Crossing*: jumps involve putting planks between posts and not sliding of jumping on a rectangular grid.
- *Temple Trap* : there are two types of pieces, tiles with walls or an explorer, with different types of moves. Tiles can only slide on a adjacent hole, but the explorer can follow a long path for which the arrow rotation does not necessarily correspond to the final spot of the jump.
- *Tilt*: it is the board that is moved (tilted, in fact), causing all the pieces to slide in the direction of the tilt\. It would be interesting to detect tilting on a phone or tablet, but for the moment we show the allowed moves with arrows displayed around the board.
- *TipOver* : there are two kinds of pieces with different behaviours: towers, which can fall and cover many squares on the board, and the tipper, which can run over pieces and jump on another one to tip it in many directions. These two kinds of movements must be distinguished for the user, so we use arrows of two colours.
- *Titanic*: a different method was explored in which the player taps on a ship to activate it, and then the arrow keys on the keyboard are used to maneuver it. The user interface is more complex to code, but it feels natural when playing on a computer. However, it is not ideal for mobile devices without a keyboard. An alternative solution could be implementing drag-and-drop functionality.

For games using drag-and-drop, such as *City Maze*, *Laser Maze*, or *CatsNBoxes*, upon being clicked, an object is moved by monitoring the cursor’s movement and adjusting its coordinates accordingly\. However, before moving any piece, it must first be relocated to the end of the `pieces` array\. This is achieved by *appending* this element at the end of the `pieces` array, which moves it to the end while removing it from its previous location in the HTML document. 

# Creating a New Game

All these games share the same control graphical interface except for the moves within the game area. These controls are defined in an HTML template, creating the base page, as seen in Figure 2\. This page is then modified to suit the needs of each game, such as loading problems or undoing and restarting\.

<figure>
<figcaption style="text-align:center">Figure 2 : HTML template common to all games</figcaption>
<img src="./images/template-html.jpg" style="width:780px; border: thin solid black" />
</figure>

Template stub files are provided for game *Pieces*, *Boards*, *Displays* and the necessary JavaScript code for changing the user interface language between French and English and for showing and hiding the explanations\. Of course, these templates can be changed, but they help in keeping uniformity between the games.

## Steps for Building a New Game

Here are the steps we have found helpful for adapting a game to this framework.

1. As these types of games come with a set of cards categorized by their level of difficulty, we must first find a way to encode the initial configuration in a machine\-readable format, as we discussed in [Section 2.2](#definition-of-configurations). This format is designed to be similar to the content of the game card and thus faster and easier to input. This input process is relatively cumbersome, explaining why many of our games still do not show initial configurations for all cards. 
2. As the input chosen for the input does not necessarily capture all possible states, especially when pieces can change during the game, e.g., in *Titanic*, boats can board shipwrecked people\. In *Squirrel Go Nuts*, pieces can lose their nuts\. In *TipOver* a piece changes its form once it is tipped. The initial configuration must be transformed into a format for both the initial state and the possible transformations of the piece. This process was described in [Section 2.3](#conversion-from-a-problem-to-a-starting-state). 
3. It also proved to be very convenient to already develop a `toString()` for the `Board` class that outputs a human readable representation of the grid corresponding to the current state. This is very useful for checking the effects of board modifications after the play of a jump.
4. Given a state, develop a method to determine if it is a *winning* state.
5. Find an encoding for jumps and compute the allowed ones at a given state\. See [Section 2.4](#possible-jumps-for-each-piece)
6. Implement the state changes according to a jump.
7. Test solving from starting states using the solver describes in [Section 2.5](#Exploring-States) in batch mode.
8. Embed this algorithm in the Graphical User Interface: first develop SVG representations for the board and the pieces. Move representation must be developed: this often corresponds to the positioning of arrows to the pieces that can move. In *placing* games such as *Flip It*, *City Maze* or *Hot Spot*, a drag-and-drop of pieces must be implemented.
9. Implement *undo* of a jump: in some cases it is only a matter of playing the jump inverting the source and target, but when pieces can change the form, this process is more involved because the original form must be restored.

# Conclusion

This document outlined the process of developing a unified web\-based user interface for single\-player sliding games\. Although all games share many characteristics, each one comes with its own challenges for the display and modification of the game state\.

The current layout was designed with a computer screen and mouse in mind\. While it can be used on a phone or tablet, the display is less user\-friendly\. Further development is needed in this area\.

# Links for playing on the web and to the source code

|                                                              | Play                                                         | Source code                             |
| ------------------------------------------------------------ | ------------------------------------------------------------ | --------------------------------------- |
|                                                              |                                                              | [Template](./Template)                  |
| <img src="./images/AntiVirus.jpg" style="width:50px;" />     | [Anti-Virus](AntiVirus/AntiVirus.html)                       | [Anti-Virus](./AntiVirus)               |
| <img src="./images/AsteroidEscape.jpg" style="width:50px;" /> | [Asteroid Escape](AsteroidEscape/AsteroidEscape.html)        | [Asteroid Escape](./AsteroidEscape)     |
| <img src="./images/BendIt.jpg" style="width:50px;" />        | [Bend it](BendIt/BendIt.html)                                | [Bend It](./BendIt)                     |
| <img src="./images/CannibalMonsters.jpg" style="width:50px;" /> | [Cannibal Monsters](CannibalMonsters/CannibalMonsters.html)  | [Cannibal Monsters](./CannibalMonsters) |
| <img src="./images/CatsNBoxes.jpg" style="width:50px;" />    | [Cats & Boxes](CatsNBoxes/CatsNBoxes.html)                   | [CatsNBoxes](./CatsNBoxes)              |
| <img src="./images/CityMaze.jpg" style="width:50px;" />      | CityMaze : [Express Delivery](CityMaze/CityMaze_Express_Delivery.html), [On the Double](CityMaze/CityMaze_On_the_Double.html) | [City Maze](./CityMaze)                 |
| <img src="./images/ExpressCourier.jpg" style="width:50px;" /> | [ExpressCourier](./ExpressCourier/ExpressCourier.html)       | [ExpressCourier](./ExpressCourier)      |
| <img src="./images/FlipIt.jpg" style="width:50px;" />        | [Flip It](FlipIt/FlipIt.html)                                | [Flip It](./FlipIt)                     |
| <img src="./images/GraveyardShift.jpg" style="width:50px;" /> | [Graveyard Shift](GraveYardShift/GraveYardShift.html)        | [Graveyard Shift](./GraveYardShift)     |
| <img src="./images/GrizzlyGears.jpg" style="width:50px;" />  | [Grizzly Gears](GrizzlyGears/GrizzlyGears.html)              | [Grizzly Gears](./GrizzlyGears)         |
| <img src="./images/HotSpot.jpg" style="width:50px;" />       | [Hot Spot](HotSpot/HotSpot.html)                             | [Hot Spot](./HotSpot)                   |
| <img src="./images/JumpIn.jpg" style="width:50px;" />        | [Jump In](JumpIn/JumpIn.html)                                | [Jump in](./JUmpIn)                     |
| <img src="./images/LaserMaze.jpg" style="width:50px;" />     | [Laser Maze](LaserMaze/LaserMaze.html)                       | [Laser Maze](./LaserMaze)               |
| <img src="./images/LunarLockout.jpg" style="width:50px;" />  | [Lunar Lockout](LunarLockout/LunarLockout.html)              | [Lunar Lockout][LunarLockout]           |
| <img src="./images/RiverCrossing.jpg" style="width:50px;" /> | [River Crossing](RiverCrossing/RiverCrossing.html)           | [River Crossing](./RiverCrossing)       |
| <img src="./images/RushHour.jpg" style="width:50px;" />      | [Rush Hour](RushHour/RushHour.html)                          | [Rush Hour](./RushHour)                 |
| <img src="./images/SnowProblem.jpg" style="width:50px;" />   | [Snow Problem](SnowProblem/SnowProblem.html)                 | [Snow Problem](./SnowProblem)           |
| <img src="./images/SquirrelsGoNuts.jpg" style="width:50px;" /> | [Squirrels Go Nuts](SquirrelsGoNuts/SquirrelsGoNuts.html)    | [Squirrels Go Nuts](./SquirrelsGoNuts)  |
| <img src="./images/TempleTrap.jpg" style="width:50px;" />    | [Temple Trap](TempleTrap/Temple Trap.html)                   | [Temple Trap](./TempleTrap)             |
| <img src="./images/Tilt.jpg" style="width:50px;" />          | [Tilt](Tilt/Tilt.html)                                       | [Tilt](./Tilt)                          |
| <img src="./images/TipOver.jpg" style="width:50px;" />       | [Tip over](TipOver/TipOver.html)                             | [TiipOver](./TilpOver)                  |
| <img src="./images/Titanic.jpg" style="width:50px;" />       | [Titanic](Titanic/Titanic.html)                              | [Titanic](./Titanic)                    |
| <img src="./images/ToadsNFrogs.jpg" style="width:100px;" />  | [Toads and Frogs](ToadsNFrogs/ToadsNFrogs.html)              | [Toads and Frogs](./ToadsNFrogs)        |

