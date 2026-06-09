import {Board} from "../Board.js"
import {Grid} from "../Grid.js"
import {Jump,dir2rot,dirInv} from "../Jump.js"
import {AsteroidEscape_Piece} from "./AsteroidEscape_Piece.js"
import { AsteroidEscape_Jump } from "./AsteroidEscape_Jump.js"

export {AsteroidEscape_Board,showMoves}

function showMoves(jumpsList){
    // only show arrows and add final down arrow
    return jumpsList.map(js=>js[0].pid+js[0].arrow()).join(" ")+" A↓"
}

class AsteroidEscape_Board extends Board {
    constructor (no,state,display){
        super(no,state,display);
        this.grid = new Grid(3,3);
        this.cells = new Grid(8,8);
        const states = JSON.parse(state);
        let iState=0;
        this.pieces = []
        this.hole = null;
        this.plane = null;
        for (let i=0;i<3;i++){
            for (let j=0;j<3;j++){
                const v = states[iState++];
                const piece = new AsteroidEscape_Piece(v.charAt(0),i,j,v.charAt(1))
                this.grid.set(i,j,piece)
                if (piece.id=="_")this.hole=piece;
                else if (piece.id=="A")this.plane=piece;
                piece.cells.forEach((i0,j0,v)=>{
                    if (v!=null){
                        const i1= i*2+i0, j1=j*2+j0;
                        if (this.hideable(this.cells.get(i1,j1)))
                            this.cells.set(i1,j1,v)
                        else if (piece.id != '_' && !this.hideable(v)){
                            // this test should probably have been done also at the problem creation!
                            console.log("*** Problem %d: superposition with %s for %s at %d,%d",no,this.cells.get(i1,j1),piece.toString(),i1,j1);
                            debugger;
                        }
                    }
                })
                this.pieces.push(piece);
            }
        }
        if (display != null) // this call must come after pieces have been added
            display.setBoard(this);
    }
    
    toString(){
        return this.grid.show(3)+"\n"+this.cells.show(3)
    }

    toState(){
        let pieces=[]
        this.grid.forEach((i,j,p)=>pieces.push(p.toState()))
        return JSON.stringify(pieces)
    }
    
    hideable(v){
        return v == null || v == '_' || v.toLowerCase() == v;
    }
    
    possibleJumps(){
        let jumps=[];
        // try to move the hole...
        const hi=this.hole.i,hj=this.hole.j;
        const hole_under_plane = this.plane.i==hi-1 && this.plane.j==hj;
        for (const ori in dir2rot){
            const [_angle,di,dj] = dir2rot[ori]
            const pi=hi-di, pj=hj-dj;
            if(this.grid.check(pi,pj)){
                const piece=this.grid.get(pi,pj);
                // check special cases with the plane for which only the front can block
                // a few tiles that stretch out:
                // Pieces B and C with specific orientations should go under the plane
                // This only occurs when the hole is under the plane
                // other cases are dealt with uniformly
                if (hole_under_plane &&
                    ((piece.id == "B" && piece.ori=="↑") ||
                     (piece.id == "C" && (piece.ori=="↑" || piece.ori == "←")))){
                        continue;
                }
                if (piece.canMove(this.cells,di,dj)){
                    jumps.push(new AsteroidEscape_Jump([pi,pj],[hi,hj],piece.id))
                }
            }
        }
        return jumps;
    }
    
    isComplete(){
        return this.plane.i==2 && this.plane.j==1 && 
                this.hideable(this.cells.get(6,2)) && this.hideable(this.cells.get(6,5))
    }
    
    play(jump){
        const fromI=jump.from.i,fromJ=jump.from.j;
        const toI=jump.to.i,toJ=jump.to.j;
        const piece = this.grid.get(fromI,fromJ);
        piece.i=toI;
        piece.j=toJ;
        this.grid.set(toI,toJ,piece);
        this.hole.i=fromI;
        this.hole.j=fromJ;
        this.grid.set(fromI,fromJ,this.hole)
        // reinit cells... simpler than trying to keep track of changes...
        this.cells = new Grid(8,8);
        this.pieces.forEach(
            piece=>{
                const i=piece.i,j=piece.j;
                piece.cells.forEach((i0,j0,v)=>{
                    if (v!=null){
                        const i1= i*2+i0, j1=j*2+j0;
                        if (this.hideable(this.cells.get(i1,j1)))
                            this.cells.set(i1,j1,v)
                        // the following test is useless (in principle...)
                        else if (piece.id != '_' && !this.hideable(v)){
                            // this test should probably have been done also at the problem creation!
                            console.log("Superposition with %s for %s at %d,%d",this.cells.get(i1,j1),piece.toString(),i1,j1);
                            debugger;
                        }
                    }
                })
            })
    }
    
    undo(jump){
        throw new Error("AsteroidEscape_Board.undo: should be redefined")         
    }
    
}