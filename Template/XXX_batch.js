import {startStates} from "./Problems.js"
import {solveAll} from "../Solver.js"
import {XXX_Board} from "./XXX_Board.js"

// this is useful for testing the game without GUI
// for testing separately
//  state creation 
const no=1
const startState=startStates[no]
let brd = new XXX_Board(no,startState)
console.log(brd.toState())
console.log(brd.toString())
// jump generation
const possibles = brd.possibleJumps()
console.log(possibles.join(", "))
// jump playing and updating the grid
for (const jump of possibles){
    console.log("play",jump.toString())
    brd.play(jump);
    console.log(brd.toString())
    brd = new XXX_Board(no,startState)
}

// for solving a single case
const ss = {}
ss[no]=startStates[no] 
solveAll(ss,XXX_Board,false)

// for all cases
// solveAll(startStates,XXX_Board,false)
