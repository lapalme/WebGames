
import { translate, rotate } from "../SVGtools.js"
import {Board} from "../Board.js"
import {Grid} from "../Grid.js"
import {Jump,dir2rot,allDirs,dirInv} from "../Jump.js"
import { GraveYardShift_Jump } from "./GraveYardShift_Jump.js"
import {GraveYardShift_Piece} from "./GraveYardShift_Piece.js"

export {GraveYardShift_Board,showMoves}

function showMoves(jumpsList){
    // CAUTION: this takes for granted that each List is on the same piece...
    // HACK: this changes the jumpsList
    for (let k=0;k<jumpsList.length;k++){
        let jumps = jumpsList[k];
        // keep only the last rotation of an immobile piece
        let k0=0;
        while (k0<jumps.length){
            let k1=k0+1;
            while (k1<jumps.length && jumps[k1].isImmobile()){
                jumps[k0].new_ori=jumps[k1].new_ori; // update rotation
                jumps.splice(k1,1); // remove this rotation 
            }
            k0++;
        }
    }                             
    return jumpsList.join();
}
// dummy I piece for the border
const i_padding = new GraveYardShift_Piece("I",-1,-1,"↑");
const didj = [[-1,0],[0,1],[1,0],[0,-1]] // deltas for n,e,s,w

class GraveYardShift_Board extends Board {
    constructor (no,state,display){
        super(no,state,display);
        // add invisible border of "I"  around the board to simplify checking if a piece can turn
        // this implies that access to element i,j must be indexed with i+1,j+1 in the grid
        this.grid = new Grid(5,6);
        for (let i=0;i<5;i++){
            this.grid.set(i,0,i_padding);
            if (i!=1) this.grid.set(i,5,i_padding) // leave exit to null
            if (i==0 || i==4){
                for (let j=1;j<5;j++)
                    this.grid.set(i,j,i_padding)
            }
        }
        const stateP = JSON.parse(state)
        this.pieces = []
        for (let p of stateP){
            const piece = new GraveYardShift_Piece(p[0],p[1],p[2],p[3])
            this.pieces.push(piece);
            this.grid.set(piece.i+1,piece.j+1,piece)
        }
        
        if (display != null) // this call must come after pieces have been added
            display.setBoard(this);
    }
    
    toString(){
        const subGrid = new Grid(3,4); // get only the inside of the grid for display
        subGrid.forEach((i,j,_)=>subGrid.set(i,j,this.grid.get(i+1,j+1)))
        return subGrid.show(3)
    }

    toState(){
         return JSON.stringify(this.pieces.map(p=>p.toState()))
    }
            
    possibleJumps(){
        let jumps = []
        for (const piece of this.pieces){
            if (piece.id != "I"){
                const pi = piece.i, pj=piece.j;
                // check for rotation in place
                for (const new_ori of allDirs){
                    if (new_ori != piece.ori && piece.canBeRotated(this.grid,new_ori,pi,pj)){
                        jumps.push(new GraveYardShift_Jump([pi,pj],[pi,pj],piece.id,piece.ori,new_ori))
                    }
                }
                // check for move and rotation
                for (let k=0;k<4;k++){
                    const newI = pi+didj[k][0], newJ = pj+didj[k][1];
                    if (this.grid.get(newI+1,newJ+1) == null){
                        for (const new_ori of allDirs){
                            if (piece.canBeRotated(this.grid,new_ori,newI,newJ)){
                                if (newI!=0 || newJ!=4) // avoid exit a piece on the side
                                    jumps.push(new GraveYardShift_Jump([pi,pj],[newI,newJ],piece.id,piece.ori,new_ori))
                            }
                        }
                    }
                }
            }
        }
        return jumps
    }
    
    isComplete(){
        const exit_piece = this.grid.get(1,4);
        return exit_piece!= null && exit_piece.id == "A" && (exit_piece.ori=="→" || exit_piece.ori=="←")
    }
    
    play(jump){
        const fromI = jump.from.i, fromJ=jump.from.j;
        const piece = this.grid.get(fromI+1,fromJ+1)
        this.grid.set(fromI+1,fromJ+1,null);
        const toI = jump.to.i, toJ = jump.to.j; 
        piece.i = toI; 
        piece.j = toJ;
        piece.ori = jump.new_ori;
        this.grid.set(toI+1,toJ+1,piece);
        if (piece.drawing){
            piece.drawing.attr("transform",translate(piece.j,piece.i)+rotate(piece.ori,0.5,0.5))
        }
    }
    
    undo(jump){
        this.play(new GraveYardShift_Jump(jump.to,jump.from,jump.id,jump.new_ori,jump.old_ori))         
    }
    
}