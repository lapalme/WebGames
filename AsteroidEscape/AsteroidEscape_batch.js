import {startStates} from "./Problems.js"
import {solveAll} from "../Solver.js"
import {AsteroidEscape_Board,showMoves} from "./AsteroidEscape_Board.js"

// let aeb = new AsteroidEscape_Board(1,startStates[1]);
// console.log(aeb.toString())
// const pjumps = aeb.possibleJumps()
// console.log(pjumps.join(", "));
// for (const jump of pjumps){
//     console.log("** play",jump.toString())
//     aeb.play(jump)
//     console.log(aeb.toString())
//     aeb = new AsteroidEscape_Board(1,startStates[1]);
// }

solveAll(startStates,AsteroidEscape_Board,showMoves)
