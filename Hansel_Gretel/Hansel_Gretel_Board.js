import {Board} from "../Board.js"
import {Grid} from "../Grid.js"
import {Hansel_Gretel_Piece, hasHole} from "./Hansel_Gretel_Piece.js"
import {translateSVG} from "../SVGtools.js"
import { Hansel_Gretel_Jump } from "./Hansel_Gretel_Jump.js"
export {Hansel_Gretel_Board}

class Hansel_Gretel_Board extends Board {
    constructor (no,state,display){
        super(no,state,display);
        this.grid = new Grid(4,4)
        this.pieces = []
        this.removedPieces = []
        let id=0
        for (const s of JSON.parse(state)){
            const piece = new Hansel_Gretel_Piece(id++,s[1],s[2],s[0],s[3])
            this.grid.set(piece.i,piece.j,piece)
            if (piece.kind=="h" || piece.kind=="r"){
                if (piece.dir=="↑")
                    this.grid.set(piece.i+1,piece.j,piece)
                else
                    this.grid.set(piece.i,piece.j+1,piece)
            }
            this.pieces.push(piece)
        }
        if (display != null) // this call must come after pieces have been added
            display.setBoard(this);
    }

    toString(){
        return this.grid.show(2)
    }

    toState(){
        return JSON.stringify(this.pieces.map(p=>p.toState()))  
    }
    
    possibleJumps(){
        return this.pieces.flatMap(p=>p.possibleJumps(this.grid))
    }
    
    isComplete(){
        return !this.pieces.some(p=>p.kind=="g" || p.kind=="b")
    }
    
    play(jump){
        const fromI=jump.from.i, fromJ=jump.from.j;
        const toI  =jump.to.i,     toJ=jump.to.j;
        const piece = this.grid.get(fromI,fromJ)
        // remove current piece
        this.grid.set(fromI,fromJ,null)
        if (jump.kind=="r"){
            if (piece.dir=="↑"){
                this.grid.set(fromI+1,fromJ,null)
            } else {
                this.grid.set(fromI,fromJ+1,null)
            }
        }
        if ((piece.kind=="g" || piece.kind=="b")
            && fromI==3 && fromJ==1 && toI==4 && toJ==1){
            // remove piece from board
            const idx = this.pieces.findIndex(p=>p==piece)
            this.removedPieces.push(this.pieces.splice(idx,1)[0])
            if (this.display !=null)
                piece.drawing.remove()
        } else {
            // set to new piece
            this.grid.set(toI,toJ,piece)
            if (jump.kind=="r"){
                if (piece.dir=="↑"){
                    this.grid.set(toI+1,toJ,piece)
                } else {
                    this.grid.set(toI,toJ+1,piece)
                }
            }
        }
        piece.i = toI
        piece.j = toJ
        if (this.display != null){
            translateSVG(piece.drawing,piece.j,piece.i)
            if (piece.kind=="l" && hasHole[piece.i][piece.j]){
                                // must check in case of undo
                piece.drawing.attr({href:"#lollipop-locked"})
            }
        }      
    }
    
    undo(jump){
        const fromI = jump.from.i,fromJ = jump.from.j;
        const toI   = jump.to.i,  toJ   = jump.to.j;
        if (toI == 4 && toJ == 1){
            // recover piece   
            const piece = this.removedPieces.pop();
            this.pieces.push(piece)
            piece.i = fromI
            piece.j = fromJ
            this.grid.set(piece.i,piece.j,piece)
            translateSVG(piece.drawing,piece.j,piece.i)
            $("#pieces").append(piece.drawing);
        } else { 
            // play move in reverse
            this.play(new Hansel_Gretel_Jump([toI,toJ],[fromI,fromJ],jump.kind))
            if (jump.kind=="l"){
                const piece=this.grid.get(fromI,fromJ)
                piece.drawing.attr({href:"#lollipop"})
            }
        }                
    }
    
}