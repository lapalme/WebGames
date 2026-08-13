import {Board} from "../Board.js"
import {Grid} from "../Grid.js"
import {Jump} from "../Jump.js"
import {BendIt_Piece} from "./BendIt_Piece.js"

export {BendIt_Board,showMoves}

function showMoves(jumpsList){
    let piecePos=[]
    for (const jumps of jumpsList){
        const piece = jumps[0].piece;
        const segs = piece.allSegments()
        piecePos.push("\n"+`${piece.color.padEnd(6)} : ${piece.i},${piece.j} : ${segs.map(s=>s.angle).join(",").padEnd(11) }: ${piece.flipped}`)
    }   
    return piecePos.join("")
}

class BendIt_Board extends Board {
    constructor (no,state,display){
        super(no,state,display);
        const parsed = JSON.parse(state)
        this.parsedGoal=parsed.goal
        this.pieces = parsed.pieces.map(BendIt_Piece.fromState)
        this.grid = new Grid(6,6)
        // save goal as a grid
        this.goal=this.grid.map((i,j,_)=>parsed.goal[i].charAt(j));
        // fill grid with pieces
        // considering that coordinates of pieces have been updated
        for (const piece of this.pieces){
            if (piece.j < 6){ // only update pieces on the board
                this.setPieceAt(piece,piece.i,piece.j)            
            }
        }
        if (display != null) // this call must come after pieces have been added
            display.setBoard(this);
    }

    toState(){
        return JSON.stringify({
            "goal":this.parsedGoal, // the goal never changes during a problem, so we just copy
            "pieces":this.pieces.map(p=>p.toState())
        })
    }
    
    toString(){
        // show colors of pieces
        let colorGrid = new Grid(6,6)
        for (const piece of this.pieces){
            if (piece.j<6){
                const coul = piece.color.charAt(0);
                for (const ball of piece.allBalls()){
                    colorGrid.set(piece.i+ball.i,piece.j+ball.j,coul)
                }
            }
        }
        return colorGrid.show()
    }
    
    possibleJumps(){
        // find possible jumps for each piece not yet on the board
        let possibles=[]
        for (let k=0;k<this.pieces.length;k++){
            if (this.pieces[k].j>=6)
                possibles.push(this.pieces[k].possibleJumps(this.grid,this.goal))
        }
        // sort pieces in increasing number of possible moves
        possibles.sort((p1,p2)=>p1.length-p2.length)
        return possibles.flat()
    }
    
    isComplete(){
        return this.grid.isSameAs(this.goal)
    }
    
    play(jump){
        const newPiece=jump.piece;
        this.setPieceAt(newPiece,newPiece.i,newPiece.j)
    }
    
    setPieceAt(newPiece,i0,j0){
        this.pieces[newPiece.id]=newPiece;
        for (const ball of newPiece.allBalls()){
            const i1=i0+ball.i;
            const j1=j0+ball.j;
            if (this.grid.isNull(i1,j1) && this.goal.get(i1,j1)==ball.c)
                this.grid.set(i1,j1,ball.c)
            else
                debugger;
        }        
    }
    
    undo(jump){
        jump.piece.moveTo(jump.from.i,jump.from.j)
    }
    
}