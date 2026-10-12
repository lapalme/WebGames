import {Board} from "../Board.js"
import {Grid} from "../Grid.js"
import {Jump, allDirs} from "../Jump.js"
import {LunarLockout_Piece} from "./LunarLockout_Piece.js"
import { LunarLockout_Jump } from "./LunarLockout_Jump.js"
import { translate } from "../SVGtools.js"

export {LunarLockout_Board,showMoves}

function showMoves(jumpsList){    
    return jumpsList.join();// TODO: change if needed
}

class LunarLockout_Board extends Board {
    constructor (no,state,display){
        super(no,state,display);
        this.grid = new Grid(5,5)
        this.pieces = []
        for (let p of JSON.parse(state)){
            const piece = new LunarLockout_Piece(p[0],p[1],p[2])
            this.grid.set(p[1],p[2],piece)
            this.pieces.push(piece)
        }
        if (display != null) // this call must come after pieces have been added
            display.setBoard(this);
    }
    
    toString(){
        return this.grid.show(3)
    }

    toState(){
        return JSON.stringify(this.pieces.map(p=>p.toState()))
    }
    
    possibleJumps(){
        return this.pieces.flatMap(p=>p.possibleJumps(this.grid))
    }
    
    isComplete(){
        const red = this.pieces[0]
        return red.i==2 && red.j==2
    }
    
    play(jump){
        const fromI=jump.from.i,fromJ=jump.from.j;
        const toI=jump.to.i,toJ=jump.to.j;
        const piece = this.grid.get(fromI,fromJ)
        this.grid.set(fromI,fromJ,null)
        this.grid.set(toI,toJ,piece)
        piece.i=toI
        piece.j=toJ
        if (this.display!=null)
            piece.drawing.attr("transform",translate(toJ,toI))
    }
    
    undo(jump){
        this.play(new LunarLockout_Jump([jump.to.i,jump.to.j],[jump.from.i,jump.from.j]))        
    }
    
}