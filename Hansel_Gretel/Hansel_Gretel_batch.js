import {startStates} from "./Problems.js"
import {solveAll} from "../Solver.js"
import {Hansel_Gretel_Board} from "./Hansel_Gretel_Board.js"

const no=3
const startState=startStates[no]
// let hgb = new Hansel_Gretel_Board(no,startState)
// console.log(hgb.toState())
// console.log(hgb.toString())
// const possibles = hgb.possibleJumps()
// console.log(possibles.join(", "))
// for (const jump of possibles){
//     console.log("play",jump.toString())
//     hgb.play(jump);
//     console.log(hgb.toString())
//     hgb = new Hansel_Gretel_Board(no,startState)
// }

const ss={}
ss[no]=startStates[no]
solveAll(startStates,Hansel_Gretel_Board,false)
