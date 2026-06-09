import {piecePos,catIds,pieceIds} from "./Problems.js"
import {Board} from "../Board.js"
import {Grid} from "../Grid.js"
import { CatsNBoxes_Jump } from "./CatsNBoxes_Jump.js"
import {Cat, Tile} from "./CatsNBoxes_Piece.js"

export {CatsNBoxes_Board,showMoves,M,N}

function showMoves(jumpsList){    
    return jumpsList.join();// TODO: change if needed
}

const M=5, N=5;

// HACK: there are still "assertions" that call the debugger just in case...
//       This code was quite subtle to debelop...
class CatsNBoxes_Board extends Board {
    constructor (no,state,display){
        super(no,state,display);
        this.grid = new Grid(M,N)
        this.cats = {}
        this.pieces = {}
        const [catsPos, piecesPosOri] = JSON.parse(state);
        // add cats and pieces to the grid
        for (let k=0;k<catIds.length;k++){
            const catId = catIds[k]
            const [i,j] = catsPos[k];
            const cat= new Cat(catId,i,j);
            this.cats[catId]=cat;
            this.grid.set(i,j,cat)
        }
        for (let k=0;k<pieceIds.length;k++){
            const pieceId = pieceIds[k]
            const [i,j,dir] = piecesPosOri[k];
            const tile = new Tile(pieceId,i,j,dir);
            this.pieces[pieceId] = tile;
            let cell = this.grid.get(i,j)
            if (cell==null){
                this.grid.set(i,j,tile)
            } else if (cell instanceof Cat){
                tile.myCat=cell.id;
                cell.tile = tile.id
            } else { // superposition of tiles that should never happen
                debugger;
            }
            if (tile.id == "I"){
                const [di,dj] = piecePos["I"][dir].at(-1)
                cell = this.grid.get(i+di,j+dj)
                if (cell==null){
                    this.grid.set(i+di,j+dj,tile)
                } else if (cell instanceof Cat){
                    tile.myOtherCat=cell.id;
                    cell.tile = tile.id
                } else { // superposition of tiles that should never happen
                    debugger;
                }
            }
            for (const [di,dj] of piecePos[pieceId][dir].slice(1,4)){
                const idi=i+di,jdj=j+dj;
                if (this.grid.get(idi,jdj)!=null)debugger;
                this.grid.set(i+di,j+dj,tile)
            }
        }
        if (display != null) // this call must come after pieces have been added
            display.setBoard(this);
    }
    
    // a bit complicated because of the possible superposition of pieces and cats
    toString(){
        // create temporary grid of chars because we have to know the i,j
        // to set the appropriate char
        const charGrid = this.grid.map((_i,_j,v)=>{
                if (v==null) return "_"
                if (v instanceof Cat) 
                    return (v.tile==null?"":v.tile)+v.id;
                return v.id
        })
        // show holes of pieces with * instead of a _
        for (const pid in this.pieces){
            const piece = this.pieces[pid]
            if (!(this.grid.get(piece.i,piece.j) instanceof Cat))
                charGrid.set(piece.i,piece.j,"*")
        }
        const pi = this.pieces["I"]
        const [di,dj]=pi.myPos[pi.ori][4]
        if (!(this.grid.get(pi.i+di,pi.j+dj) instanceof Cat))
            charGrid.set(pi.i+di,pi.j+dj,"*")
        return charGrid.show(3)
    }

    toState(){
        return JSON.stringify([catIds.map(cid=>this.cats[cid].toState()),
                               pieceIds.map(pid=>this.pieces[pid].toState())])      
    }
    
    possibleJumps(){
        return pieceIds.flatMap(pid=>this.pieces[pid].possibleJumps(this.grid))
    }
    
    isComplete(){
        return Object.values(this.cats).every(c=>c.isBoxed())
    }
    
    play(jump){
        this.pieces[jump.pid].play(jump,this.grid)
    }
    
    undo(jump){
        this.play(new CatsNBoxes_Jump(jump.to,jump.from,jump.pid,jump.ori,jump.oldOri))        
    }
}