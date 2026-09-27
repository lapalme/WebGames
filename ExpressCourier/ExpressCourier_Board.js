import {Board} from "../Board.js"
import {Grid} from "../Grid.js"
import {ExpressCourier_Jump} from "./ExpressCourier_Jump.js"
import {ExpressCourier_Piece} from "./ExpressCourier_Piece.js"
import { translate,translateSVG } from "../SVGtools.js"

export {ExpressCourier_Board,showMoves,isExit,exitsH,exitsV}

const letter2arrow = {"s":"↓", "w":"←", "n":"↑", "e":"→"}
const arrow2letter = {"↓":"s", "←":"w", "↑":"n", "→":"e"}

function showMoves(jumpsList){    
    return jumpsList.join();// TODO: change if needed
}

const exitsV = [[-1,2],[4,0],[4,3]]
const exitsH = [[1,5],[3,-1]]

function isExit(i,j,dir){
    const exits = (dir == "↓" || dir == "↑") ? exitsV : exitsH;
    return exits.some(([ei,ej])=>ei==i && ej==j)
}

class ExpressCourier_Board extends Board {
    constructor (no,state,display){
        super(no,state,display);
        this.grid = new Grid(4,5)
        this.pieces = []
        this.removedPieces = []
        const stateV = JSON.parse(state)
        this.nbMoves = stateV[0]
        for (let k=1;k<stateV.length;k++){
            const s=stateV[k]
            const color = s.charAt(0)
            const dir = letter2arrow[s.charAt(1)]
            const i = parseInt(s.charAt(2))
            const j = parseInt(s.charAt(3))
            const box = s.length == 5 ? s.charAt(4) : null
            const piece = new ExpressCourier_Piece(k,i,j,color,dir,box)
            this.pieces.push(piece)
            this.grid.set(i,j,piece)
            this.grid.set(piece.cargoI,piece.cargoJ,piece)
        }
        if (display != null) // this call must come after pieces have been added
            display.setBoard(this);
    }

    toString(){
        let newGrid=this.grid.map((i,j,p)=>{
            if (p==null) return null;
            const color = p.color.toUpperCase()
            if (p.i==i && p.j==j) return color+p.dir;
            return color+(p.cargo==null ? p.dir : p.cargo);
        })
        return newGrid.show(3)
    }

    toState(){
        return JSON.stringify([this.nbMoves,...this.pieces.map(p=>p.toState())])  
    }
    
    possibleJumps(){
        return this.pieces.flatMap(p=>p.possibleJumps(this.grid))
    }
    
    isComplete(){
        return !this.pieces.some(p=>p.hasCargo())
    }
    
    play(jump){
        // console.log("play:",jump.toString())
        const fromI = jump.from.i,fromJ=jump.from.j;
        const piece=this.grid.get(fromI,fromJ);
        if (piece == null) debugger;
        const toI = jump.to.i, toJ= jump.to.j;
        if (jump.cargoMove){// move cargo from one piece to the other
            const piece_to=this.grid.get(toI,toJ)
            if (piece.cargo==null || piece_to==null || piece==piece_to)debugger;
            piece_to.cargo = piece.cargo
            piece.cargo = null;
            if (this.display !=null){
                piece_to.drawing.append($(".cargo",piece.drawing))
            }
        } else if (isExit(toI,toJ,piece.dir)){ // check for exit
            const idx = this.pieces.indexOf(piece)
            if (idx<0) debugger;
            this.removedPieces.push(this.pieces.splice(idx,1)[0])
            // must check i,j because one of the coordinates might be ootside the board
            if (this.grid.check(fromI,fromJ))this.grid.set(fromI,fromJ,null)
            if (this.grid.check(piece.cargoI,piece.cargoJ))
                this.grid.set(piece.cargoI,piece.cargoJ,null)
            if (this.display!=null){
                $("#piece_"+piece.id).remove()
            }
        } else { // move piece (and make the cargo position follow)
            this.grid.set(piece.i,piece.j,null) // remove from grid
            this.grid.set(piece.cargoI,piece.cargoJ,null)
            piece.i=toI;    // update position
            piece.cargoI+=toI-fromI;
            piece.j=toJ;
            piece.cargoJ+=toJ-fromJ;
            this.grid.set(piece.i,piece.j,piece) // replace on grid
            this.grid.set(piece.cargoI,piece.cargoJ,piece)
            if (this.display != null){
                translateSVG(piece.drawing,piece.j,piece.i)
            }  
        }
        // console.log(this.toString())
    }
    
    undo(jump){
        const fromI = jump.from.i,fromJ = jump.from.j;
        const toI   = jump.to.i,  toJ   = jump.to.j;
        if (isExit(toI,toJ,jump.arrow())){
            // recover piece   
            const piece = this.removedPieces.pop();
            this.pieces.push(piece)
            $("#pieces").append(piece.drawing);
            this.grid.set(piece.i,piece.j,piece)
            this.grid.set(piece.cargoI,piece.cargoJ,piece)
        } else { 
            // play move in reverse
            this.play(new ExpressCourier_Jump([toI,toJ],[fromI,fromJ],
                                    jump.piece_color,jump.cargoMove))
        }
    }
    
}