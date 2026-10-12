import {startStates} from "./Problems.js"
import {solveAll} from "../Solver.js"
import {LunarLockout_Board,showMoves} from "./LunarLockout_Board.js"

// this is useful for testing the game without GUI
const no=1
// const startState=startStates[no]
// let brd = new LunarLockout_Board(no,startState)
// console.log(brd.toState())
// console.log(brd.toString())
// const possibles = brd.possibleJumps()
// console.log(possibles.join(", "))
// for (const jump of possibles){
//     console.log("play",jump.toString())
//     brd.play(jump);
//     console.log(brd.toString())
//     brd = new LunarLockout_Board(no,startState)
// }

// Testing with a GUI
// for a single case
// const ss = {}
// ss[no]=startStates[no] 
// solveAll(ss,LunarLockout_Board,showMoves,true)

// for all cases
solveAll(startStates,LunarLockout_Board)
