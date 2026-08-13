import {startStates} from "./Problems.js"
import {solveAll} from "../Solver.js"
import {BendIt_Board,showMoves} from "./BendIt_Board.js"

const no=1
// console.log(startStates[no])
// let bib = new BendIt_Board(no,startStates[no])

// console.log(bib.toState())
// const possibles = bib.possibleJumps()
// console.log("possibles:",possibles.length)
// for (let k=0;k<possibles.length;k++){
//     console.log("Piece",possibles[k].newPiece.color)
//     console.log(possibles[k].toString())
//     bib.play(possibles[k]);
//     console.log(bib.grid.show())
//     bib = new BendIt_Board(no,startStates[no])
// }


// let s={}
// s[no]=startStates[no]
// solveAll(s,BendIt_Board,showMoves,false)

solveAll(startStates,BendIt_Board,showMoves)
