import {Board} from "../Board.js"
import {Grid} from "../Grid.js"
import {Jump} from "../Jump.js"
import {ToadsNFrogs_Piece} from "./ToadsNFrogs_Piece.js"
import { ToadsNFrogs_Jump } from "./ToadsNFrogs_Jump.js"

export {ToadsNFrogs_Board,showMoves}

function showMoves(jumpsList){    
    return jumpsList.join();// TODO: change if needed
}

class ToadsNFrogs_Board extends Board {
    constructor (no,state,display){
        super(no,state,display);
        const parsedState=JSON.parse(state)
        this.nb = Math.trunc(parsedState.length/2)
        if (parsedState.length != no*2+1)debugger;
        this.grid = new Grid(1,parsedState.length)
        this.pieces = []
        for (let j=0;j<parsedState.length;j++){
            const kind = parsedState[j]
            if (kind!=null){
                const piece = new ToadsNFrogs_Piece(j,0,j,kind);
                this.pieces.push(piece)
                this.grid.set(0,j,piece)
            }
        }
        if (display != null) // this call must come after pieces have been added
            display.setBoard(this);
    }

    toState(){
        let values=[]
        this.grid.forEach((i,j,v)=> values.push(v==null?null:v.toState()))
        return JSON.stringify(values)     
    }
    
    toString(){
        return this.grid.show(2)
    }
    
    // Toad only goes to right (+1) and must move to left
    // Frog only goes to left  (-1) 
    possibleJumps(){
        return this.pieces.flatMap(p=>p.possibleJumps(this.grid))
    }
    
    isComplete(){
        for (let k=0;k<this.nb;k++){
            if (this.grid.isNull(0,k) || this.grid.get(0,k).isToad()) return false;
        }
        const upper = this.nb+1
        for (let k=0;k<this.nb;k++){
            if (this.grid.isNull(0,upper+k) || !this.grid.get(0,upper+k).isToad())return false
        }
        return true
    }
    
    play(jump){
        const piece = this.grid.get(0,jump.from.j)
        this.grid.set(0,jump.from.j,null)
        this.grid.set(0,jump.to.j,piece) 
        piece.play(jump)
    }
    
    undo(jump){
        this.play(new ToadsNFrogs_Jump(jump.to,jump.from))
    }
    
}