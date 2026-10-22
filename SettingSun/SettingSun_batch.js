import {startStates} from "./Problems.js"
import {solveAll} from "../Solver.js"
import {SettingSun_Board} from "./SettingSun_Board.js"

// this is useful for testing the game without GUI
const no=53
// let startState=startStates[no]
// startState = JSON.stringify(
// let brd = new SettingSun_Board(no,startState)
// console.log(brd.toState())
// console.log(brd.toString())
// const possibles = brd.possibleJumps()
// console.log(possibles.join(", "))
// for (const jump of possibles){
//     console.log("play",jump.toString())
//     brd.play(jump);
//     console.log(brd.toString())
//     console.log(brd.toState())
//     brd = new SettingSun_Board(no,startState)
// }
// Testing without a GUI
// for a single case
const ss = {}
ss[no]=startStates[no] 
solveAll(ss,SettingSun_Board,false,true)

// for all cases
// solveAll(startStates,SettingSun_Board,false)
