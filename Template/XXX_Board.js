import {Board} from "../Board.js"
import {Grid} from "../Grid.js"
import {Jump} from "../Jump.js"
import {XXX_Piece} from "./XXX_Piece.js"

export {XXX_Board,showMoves}

function showMoves(jumpsList){    
    return jumpsList.join();// TODO: change if needed
}

class XXX_Board extends Board {
    constructor (no,state,display){
        super(no,state,display);
        this.grid = null // TODO
        this.pieces = []
        // add pieces
        if (display != null) // this call must come after pieces have been added
            display.setBoard(this);
    }

    toState(){
         throw new Error("XXX_Board.toState: should be redefined")       
    }
    
    possibleJumps(){
        throw new Error("XXX_Board.possibleJumps: should be redefined")
    }
    
    isComplete(){
        throw new Error("XXX_Board.isComplete: should be redefined")
    }
    
    play(jump){
        throw new Error("XXX_Board.play: should be redefined")    
    }
    
    undo(jump){
        throw new Error("XXX_Board.undo: should be redefined")         
    }
    
}