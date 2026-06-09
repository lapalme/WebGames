import { translate } from "../SVGtools.js"
import {Board} from "../Board.js"
import {Grid} from "../Grid.js"
import {CannibalMonsters_Piece} from "./CannibalMonsters_Piece.js"

export {CannibalMonsters_Board,showMoves,M,N}

function showMoves(jumpsList){    
    return jumpsList.join();// TODO: change if needed
}

const M=4, N=4;

class CannibalMonsters_Board extends Board {
    constructor (no,state,display){
        super(no,state,display);
        this.grid = new Grid(M,N);
        this.pieces = CannibalMonsters_Board.fromState(state,this.grid);
        if (display != null) // this call must come after pieces have been added
            display.setBoard(this);
    }
    
    toString(){
        return this.grid.show(5)
    }

    toState(){
        return JSON.stringify(this.pieces.map(p=>p.toState()))       
    }
    
    static fromState(stateS,grid){
        const pieces = JSON.parse(stateS).map(s=>CannibalMonsters_Piece.fromState(s))
        for (const piece of pieces)
            grid.set(piece.i,piece.j,piece);
        return pieces;
    }
    
    possibleJumps(){
        const allJumps = this.pieces.flatMap(p=>p.possibleJumps(this.grid));
        if (this.display)this.display.showPossible(allJumps);
        return allJumps
    }
    
    isComplete(){
        return this.pieces.length==1;
    }
    
    play(jump){
        const topI=jump.from.i, topJ=jump.from.j;
        const tPiece = this.grid.get(topI,topJ);
        if (tPiece == null) debugger;
        this.grid.set(topI,topJ,null); // remove top
        const bPiece = this.grid.get(jump.to.i,jump.to.j);
        if (bPiece == null) debugger;
        if (this.display){
            bPiece.drawing.append(
                tPiece.drawing.attr("transform",translate(0,-bPiece.stack.length*0.15))
            )
        }
        bPiece.stack.push(...tPiece.stack); // // add to bottom
        this.pieces.splice(this.pieces.findIndex(p=>p==tPiece),1); // remove piece
    }
    
    undo(jump){
        const piece = this.grid.get(jump.to.i,jump.to.j);
        if (piece==null) debugger;
        const l = jump.eater.length-1; // number of piece eaten
        const eaterStack = piece.stack.splice(-l,l) // remove from stack
        const newPiece = CannibalMonsters_Piece.fromState([eaterStack,jump.from.i,jump.from.j]);
        this.grid.set(jump.from.i,jump.from.j,newPiece);
        this.pieces.push(newPiece);
        // update drawing
        newPiece.drawing = piece.drawing.children().last().remove();
        newPiece.drawing.attr("transform",translate(newPiece.j,newPiece.i))
        $("#pieces").append(newPiece.drawing);
        this.possibleJumps()
    }
    
}