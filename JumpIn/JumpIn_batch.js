import {startStates} from "./Problems.js"
import {solveAll} from "../Solver.js"
import {JumpIn_Board,showMoves} from "./JumpIn_Board.js"

// const no=53
// let jib = new JumpIn_Board(no,startStates[no]);
// console.log(jib.toString())
// const jumps = jib.possibleJumps()
// console.log(jumps.join(", "))

// for (const jump of jumps){
//     console.log("play",jump.toString())
//     jib.play(jump);
//     console.log(jib.toString());
//     jib = new JumpIn_Board(no,startStates[no]);
// }

// solveAll({56:startStates[56]},JumpIn_Board,showMoves)

solveAll(startStates,JumpIn_Board,showMoves)
