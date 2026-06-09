import {startStates} from "./Problems.js"
import {solveAll} from "../Solver.js"
import {CannibalMonsters_Board,showMoves} from "./CannibalMonsters_Board.js"

// let cmb = new CannibalMonsters_Board(1,startStates[1]);
// console.log(cmb.toString())
// const jumps = cmb.possibleJumps();
// console.log(jumps.join(", "))
// for (const jump of jumps){
//     cmb.play(jump)
//     console.log(cmb.toString());
//     cmb = new CannibalMonsters_Board(1,startStates[1])
// }

// solveAll({48:startStates[48]},CannibalMonsters_Board,showMoves)

solveAll(startStates,CannibalMonsters_Board,showMoves)
