import {Board} from "../Board.js"
import {Grid} from "../Grid.js"
import {Jump} from "../Jump.js"
import {HotSpot_Piece} from "./HotSpot_Piece.js"
import { HotSpot_Jump } from "./HotSpot_Jump.js"
import { translateSVG } from "../SVGtools.js"


export {HotSpot_Board,showMoves}
const ori2let = {"↑":"U","→":"R","↓":"D","←":"L"}
function showMoves(jumpsList){ 
    // recreate the notation of the cards
    let moves = [];
    for (const jumps of jumpsList){
        let pid=""+jumps[0].pid;
        if (pid=="0")pid="X"
        moves.push(pid+ori2let[jumps[0].arrow()]+
                   jumps.slice(1).map(j=>"/"+ori2let[j.arrow()]).join(""))
    }    
    return moves.join(", ")
}


class HotSpot_Board extends Board {
    constructor (no,state,display){
        super(no,state,display);
        const stateP = JSON.parse(state);
        this.grid = new Grid(4,4)
        this.pieces = []
        let k=0;
        for (let i=0;i<4;i++)
            for (let j=0;j<4;j++){
                const v = stateP[k++];
                if (v>=0){
                    const piece = new HotSpot_Piece(v,i,j);
                    this.grid.set(i,j,piece);
                    this.pieces.push(piece);
                }
            }
        if (display != null) // this call must come after pieces have been added
            display.setBoard(this);
    }

    toState(){
        let vals = []
        this.grid.forEach((i,j,v)=>vals.push(v==null?-1:v.toState()))
        return JSON.stringify(vals)  
    }
    
    toString(){
        return this.grid.show(3)
    }
        
    possibleJumps(){
        return this.pieces.flatMap(p=>p.possibleJumps(this.grid))
    }
    
    isComplete(){
        const p00 = this.grid.get(0,0)
        return p00 != null && p00.id==0
        // return this.pieces[0].i==0 && this.pieces[0].j==0
    }
    
    play(jump){
        const fromI=jump.from.i,fromJ=jump.from.j;
        const toI=jump.to.i,toJ=jump.to.j;
        const piece = this.grid.get(fromI,fromJ);
        if (piece==null)debugger;
        this.grid.set(fromI,fromJ,null);
        piece.i=toI;
        piece.j=toJ;
        this.grid.set(toI,toJ,piece);
        if (this.display != null)
            translateSVG(piece.drawing,piece.j,piece.i)
    }
    
    undo(jump){
        this.play(new HotSpot_Jump([jump.to.i,jump.to.j],[jump.from.i,jump.from.j],jump.pid))
    }
    
}