import {startStates} from "./Problems.js"
import {solveAll} from "../Solver.js"
import {HotSpot_Board} from "./HotSpot_Board.js"

// let hsb = new HotSpot_Board(30,startStates[30]);
// console.log(hsb.toString())
// const jumps = hsb.possibleJumps()
// console.log(jumps.map(j=>j.toString()).join(", "))
// for (const jump of jumps){
//     console.log("play",jump.toString())
//     hsb.play(jump);
//     console.log(hsb.toString());
//     hsb = new HotSpot_Board(30,startStates[30]);
// }

solveAll(startStates,HotSpot_Board)
