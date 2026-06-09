import {startStates} from "./Problems.js"
import {solveAll} from "../Solver.js"
import {GrizzlyGears_Board,showMoves} from "./GrizzlyGears_Board.js"

const no = 1

const aState = '{"disks":[[0,0,"H",2],[0,1,"G",1],[0,2,"H",3],[1,0,"G",3],[1,1,"G",2],[1,2,"H",0],[2,0,"H",1],[2,1,"H",0],[2,2,"H",0]],"boats":[[0,0,"e",1]]}'

// let ggb = new GrizzlyGears_Board(0,aState)
// console.log(ggb.toState())
// console.log(ggb.toString())
// for (const disk of ggb.disks){
//     if (disk.canTurn(ggb.grid)){
//         console.log("turn",1,disk.toString())
//         disk.turn(ggb.grid,1);
//         console.log(ggb.toString());
//         console.log("turn",-1,disk.toString())
//         disk.turn(ggb.grid,-1);
//         console.log(ggb.toString());   
//     }
// }

// const myStates=[]
// myStates[no]=startStates[no]
solveAll(startStates,GrizzlyGears_Board,showMoves,false)
