import {Board} from "../Board.js"
import {Grid} from "../Grid.js"
import {dir2rot,allDirs,dirInv,Jump} from "../Jump.js"
import {AntiVirus_Piece} from "./AntiVirus_Piece.js"
import { AntiVirus_Jump } from "./AntiVirus_jump.js"

export {AntiVirus_Board,showMoves,M,N,NBCOLS,DECS}

function showMoves(jumpsList){
    let moves = []
    for (const jumps of jumpsList){
        moves.push(""+jumps[0]+jumps.slice(1).map(j=>j.arrow()).join(""))
    }    
    return moves.join(" ");
}

const M=8,N=7;
const NBCOLS = [1,1,3,5,7,5,3,1]
const DECS  =  [3,3,2,1,0,1,2,3];

class AntiVirus_Board extends Board {
    constructor (no,state,display){
        super(no,state,display);
        this.grid = new Grid(M,N)
        // mark places where it is possible to play
        for (let i=0;i<M;i++)
            for (let j=0;j<NBCOLS[i];j++)
                this.grid.set(i,DECS[i]+j,"_")
        this.pieces = [];
        const parsedState = JSON.parse(state)
        for (let p of parsedState){
            const [no,[i,j]] = p.slice(0,2)
            const piece = new AntiVirus_Piece(no,i,j,p.slice(2),this.grid)
            this.pieces.push(piece);
            for (const [i,j] of piece.pos()){
                if (this.grid.get(i,j)!="_"){
                    console.log("*** superposition for %s, at %d,%d with %s",piece,i,j,this.grid.get(i,j));
                    // debugger;
                } else 
                    this.grid.set(i,j,piece)
            }
        }
        if (display != null){ // this call must come after pieces have been added
            display.setBoard(this);
        }
    }
    
    toString(){
        return this.grid.show(3)
    }

    toState(){
         return JSON.stringify(this.pieces.map(p=>p.toState()))   
    }
    
    possibleJumps(){
        let jumps = [];
        for (const piece of this.pieces){
            for (const dir of allDirs){
                const [angle,di,dj]= dir2rot[dir];
                const group=piece.isMovable(di,dj,[piece]);
                if (group!=null){
                    // console.log("movable:",group.map(p=>p.id).join(","),":",dirInv[dir],di,dj)
                    if (group.length>0)
                        jumps.push(new AntiVirus_Jump([piece.i,piece.j],[piece.i+di,piece.j+dj],group)) 
                }
            }
        } 
        return jumps;
    }
    
    isComplete(){
        const place03 = this.grid.get(0,3);
        return place03 != null && place03.id == 0;
    }
    
    play(jump){
        const pieces = jump.ps.map(pid=>this.pieces.find(p=>p.id==pid));
        // clear current grid cells of pieces 
        for (const piece of pieces){
            for (const [i,j] of piece.pos())
                this.grid.set(i,j,"_");
        }
        const [di,dj] = jump.direction();
        // update piece and grid cells
        for (const piece of pieces){
            piece.i+=di;
            piece.j+=dj;
            for (const [i,j] of piece.pos())
                this.grid.set(i,j,piece);
        }
    }
    
    undo(jump){
        this.play(new AntiVirus_Jump(jump.to,jump.from,jump.ps))     
    }
    
}