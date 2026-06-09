import {Board} from "../Board.js"
import {Grid} from "../Grid.js"
import {RH_Jump} from "./RH_Jump.js"
import {C} from "../C.js"
import {RushHour_Piece} from "./RushHour_Piece.js"
import { translateSVG } from "../SVGtools.js";

export {M,N,RushHour_Board,showMoves}

function showMoves(jumpsList){  
    let moves = [];
    for (const jumps of jumpsList){        
        let res = jumps[0].toString();
        for (let i=1;i<jumps.length;i++)
            res += jumps[i].arrow()
        moves.push(res)
    }
    return moves.join(", ")
}

const M=6,N=6;

class RushHour_Board extends Board {
    constructor (no,state,display){
        super(no,state,display);
        this.grid = new Grid(M,N)
        this.pieces = []
        this.goals = []
        // create pieces
        for (const tileS of state.split(" ")){
            const [dir,id,i,j]=tileS.split("");
            const tile = new RushHour_Piece(id,parseInt(i),parseInt(j),dir)
            if (tile.isGoal)this.goals.push(tile)
            this.pieces.push(tile);
        }
        // update grid
        for (const tile of this.pieces){
            let [di,dj] = [0,0];
            if (tile.isHoriz) dj=1; else di=1;
            for (let k=0; k<tile.length;k++){
                this.grid.set(tile.i+k*di,tile.j+k*dj,tile);
            }
        }
        if (display != null) // this call must come after pieces have been added
            display.setBoard(this);
    }
    
    toString(){
        return this.grid.show(3)
    }

    toState(){
         return this.pieces.map(p=>p.toState()).join(" ")       
    }
    
    possibleJumps(){
        const check = (i,j)=> i>=0 && i<M && j>=0 && j<N && this.grid.get(i,j)==null;
        let jumps = [];
        for (const tile of this.pieces){
            const i=tile.i,j=tile.j, id = tile.id;
            const from = new C(i,j);
            if (tile.isHoriz){
                if (check(i,j-1)) jumps.push(new RH_Jump(from,new C(i,j-1),id))
                const j1=j+tile.length;
                if (check(i,j1))  jumps.push(new RH_Jump(from,new C(i,j+1),id))
            } else {
                if (check(i-1,j)) jumps.push(new RH_Jump(from,new C(i-1,j),id))
                const i1 = i+tile.length;
                if (check(i1,j)) jumps.push(new RH_Jump(from, new C(i+1,j),id))
            }
        }
        // check if a move of a goal tile is winning, if so put it at the start
        if (this.goals.length==1){
            const gId = this.goals[0].id;
            const idx = jumps.findIndex(j=>j.id == gId)
            if (idx>0) jumps.unshift(jumps.splice(idx,1)[0])
        }
        return jumps;
    }
    
    isComplete(){
        if (this.goals[0].j==N-this.goals[0].length)this.goals.shift();
        return this.goals.length==0;        
    }
    
    play(jump){
        const i = jump.from.i, j=jump.from.j;
        const tile = this.grid.get(i,j);
        if (tile == null) debugger;
        const l = tile.length;
        const [di,dj] = jump.direction();
        if (di==0){
            if (dj>0){
                this.grid.set(i,j,null);
                this.grid.set(i,j+l,tile);
            } else {
                this.grid.set(i,j+l-1,null);
                this.grid.set(i,j-1,tile);
            }
        } else { // di != 0
            if (di>0){
                this.grid.set(i,j,null)
                this.grid.set(i+l,j,tile)
            } else {
                this.grid.set(i+l-1,j,null)
                this.grid.set(i-1,j,tile)
            }
        }
        tile.i+=di;
        tile.j+=dj;
        if (this.display != null){
            translateSVG(tile.drawing,tile.j,tile.i);
        }
        // check for the case of two chosen tile
        if (tile.isGoal && tile.j==N-tile.length && this.goals.length>1){
            jump.to.j=N; // save tile removal for undo
            this.removeGoal(tile)
        }
    }
    
    removeGoal(tile){
        let idx = this.goals.findIndex(g=>g==tile); // in the case of not already complete...
        if (idx>=0) this.goals.splice(idx,1);
        idx = this.pieces.findIndex(p=>p==tile);
        this.pieces.splice(idx,1);
        for (let k=0;k<tile.length;k++) // free the grid
            this.grid.set(tile.i,tile.j+k,null);
        if (tile.drawing!=null)tile.drawing.remove();    
    }
    
    checkArrows(piece){
        const grid = this.grid;
        const id="#"+piece.id;
        const l = piece.length;
        $(`${id}l,${id}r`).show()
        if (piece.isHoriz){
            if (piece.j==0 || grid.get(piece.i,piece.j-1)!=null)$(id+"l").hide()
            if (piece.j==N-l || grid.get(piece.i,piece.j+l)!=null)$(id+"r").hide()
        } else {
            if (piece.i==0 || grid.get(piece.i-1,piece.j)!=null)$(id+"l").hide();
            if (piece.i==M-l || grid.get(piece.i+l,piece.j)!=null)$(id+"r").hide();
        }
    }
    
    checkAllArrows(){
        this.pieces.forEach(p=>this.checkArrows(p))
    }

    
    undo(rhjump){
        if (rhjump.to.j==N){// a tile was removed...
            const tile = new RushHour_Piece(rhjump.id,rhjump.from.i,rhjump.from.j,"C");
            tile.draw();
            this.pieces.unshift(tile);
            this.goals.push(tile);
            for (let k=0;k<tile.length;k++)
                this.grid.set(rhjump.from.i,rhjump.from.j+k,tile);
            this.checkAllArrows();
            $("#pieces").append(tile.drawing);
            return tile;
        } else {
            this.play(new RH_Jump(rhjump.to,rhjump.from,rhjump.id)) 
            return null;
        }       
    }
    
}