import {startStates} from "./Problems.js"
import {solveAll} from "../Solver.js"
import {TempleTrap_Board,showMoves} from "./TempleTrap_Board.js"

// const state = '{"pieces":[["x",0,1,"→"],["*",0,2,"↑"],["s",1,2,"↓"],["d",0,0,"←"],["o",2,1,"↓"],["<",1,1,"←"],["=",2,0,"←"],["+",2,2,"↑"]],"adventurer":[0,0]}';
// const no=0
// startStates[no]=state;
// let ttb = new TempleTrap_Board(no,startStates[no]);
// console.log(startStates[no]);
// console.log(ttb.toState())
// console.log(ttb.toString())

// const jumps = ttb.adventurerJumps()
// console.log("possible jumps:",jumps.join(", "));
// for (const jump of jumps){
//     console.log(jump.toString())
//     ttb.play(jump);
//     console.log(ttb.toString());
//     ttb = new TempleTrap_Board(no,startStates[no]);
// }

// solveAll({3:startStates[3]},TempleTrap_Board,showMoves)

solveAll(startStates,TempleTrap_Board,showMoves)
