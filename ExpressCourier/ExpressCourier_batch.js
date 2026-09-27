import {startStates} from "./Problems.js"
import {solveAll} from "../Solver.js"
import {ExpressCourier_Board,showMoves} from "./ExpressCourier_Board.js"

const no=80
const state = startStates[no]
// console.log(state)
// let ecb = new ExpressCourier_Board(no,startStates[no])
// console.log(ecb.show())
// const jumps = ecb.possibleJumps()
// console.log("jumps:",jumps.map(j=>j.toString()).join(", "))
// for (const jump of jumps){
//     console.log("jump:",jump.toString())
//     ecb.play(jump)
//     console.log(ecb.show())
//     ecb = new ExpressCourier_Board(no,startStates[no])
// }
let states={}
states[no]=state
solveAll(states,ExpressCourier_Board,showMoves,false)
