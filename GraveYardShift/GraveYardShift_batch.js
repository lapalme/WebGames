import {startStates} from "./Problems.js"
import {solveAll} from "../Solver.js"
import {GraveYardShift_Board,showMoves} from "./GraveYardShift_Board.js"

const no = 65
// const state = JSON.stringify([["I",0,0,"↑"],["C",2,0,"↑"],["I",0,2,"↑"],["A",1,3,"↑"],["I",2,2,"↑"]])
// let gysb = new GraveYardShift_Board(no,state)
// console.log(no,gysb.toState())
// console.log(gysb.toString())
// const jumps = gysb.possibleJumps()
// console.log(jumps.map(j=>j.toString()))
// for (const jump of jumps){
//     console.log("play:",jump.toString())
//     gysb.play(jump);
//     console.log(no,gysb.toState())
//     console.log(gysb.toString())
//     gysb = new GraveYardShift_Board(no,state)
// }

// let ss={}
// ss[no]=startStates[no]
// solveAll(ss,GraveYardShift_Board,showMoves,true)

solveAll(startStates,GraveYardShift_Board,showMoves)
