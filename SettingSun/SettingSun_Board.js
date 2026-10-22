import { translate } from "../SVGtools.js"
import {Board} from "../Board.js"
import {Grid} from "../Grid.js"
import {SettingSun_Jump} from "./SettingSun_Jump.js"
import {SettingSun_Piece,posPieces} from "./SettingSun_Piece.js"

export {SettingSun_Board,showMoves}

function showMoves(jumpsList){    
    return jumpsList.join();// TODO: change if needed
}

class SettingSun_Board extends Board {
    constructor (no,state,display){
        super(no,state,display);
        this.grid = new Grid(5,4)
        this.pieces = []
        let k=0
        for (let [id,i,j,kind] of JSON.parse(state)){
            const piece = new SettingSun_Piece(id,i,j,kind)
            for (let [di,dj] of posPieces[kind])
                this.grid.set(i+di,j+dj,piece)
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
        const p=this.grid.get(3,1)
        return p!=null && p.kind=="#" && p.i==3 && p.j==1
    }
    
    play(jump){
        const fromI=jump.from.i,fromJ=jump.from.j;
        const piece=this.grid.get(fromI,fromJ)
        //clear grid
        for (let [di,dj] of posPieces[piece.kind])
            this.grid.set(fromI+di,fromJ+dj,null)
        piece.i=jump.to.i
        piece.j=jump.to.j
        // update grid
        for (let [di,dj] of posPieces[piece.kind])
            this.grid.set(piece.i+di,piece.j+dj,piece)
        if (this.display != null)
            piece.drawing.attr("transform",translate(piece.j,piece.i))
    }
    
    undo(jump){
        this.play(new SettingSun_Jump([jump.to.i,jump.to.j],[jump.from.i,jump.from.j]))        
    }
    
}