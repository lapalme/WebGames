import { translateSVG } from "../SVGtools.js"
import { sortState } from "./Problems.js"
import {Board} from "../Board.js"
import {Grid} from "../Grid.js"
import {JumpIn_Piece} from "./JumpIn_Piece.js"
import { JumpIn_Jump } from "./JumpIn_Jump.js"

export {JumpIn_Board,showMoves,isHole,M,N}

function showMoves(jumpsList){
    let moves = []
    for (const jumps of jumpsList){
        let move = jumps[0]
        for (const jump of jumps.slice(1))
            move+=jump.arrow()
        moves.push(move)
    }   
    return moves.join(" ");
}

const M=5,N=5;
function isHole(i,j){
    if (i==0 || i==4) return j==0 || j==4;
    if (i==2) return j==2;
    return false
}

const arrows="↓←↑→";
// second cell occupied by a fox depending on its orientation
const fox_occupies = {
    "↑":[1,0],"↓":[-1,0],"→":[0,-1],"←":[0,1]
}

class JumpIn_Board extends Board {
    constructor (no,state,display){
        super(no,state,display);
        this.grid = new Grid(M,N)
        this.pieces = [];
        this.movable = []
        let piece;
        for (const pieceS of JSON.parse(state)){
            const [kind,i,j] = pieceS;
            piece = new JumpIn_Piece(kind,i,j)
            this.grid.set(piece.i,piece.j,piece);
            if (!arrows.includes(kind)){
                if (piece.kind != "*")
                    this.movable.push(piece);
            } else {  // an arrow
                const [di,dj] = fox_occupies[piece.kind]
                this.grid.set(piece.i+di,piece.j+dj,piece)
                this.movable.push(piece)
            }
            this.pieces.push(piece);
        }
        if (display != null) // this call must come after pieces have been added
            display.setBoard(this);
    }
    
    toString(){
        return this.grid.show(3)
    }

    toState(){
         return JSON.stringify(this.pieces.map(p=>p.toState()).sort(sortState))
    }
    
    possibleJumps(){
        const jumps = this.movable.flatMap(p=>p.possibleJumps(this.grid));
        if (this.display){this.display.showPossible(jumps)}
        return jumps
    }
    
    isComplete(){
        return this.movable.filter(p=>!arrows.includes(p.kind)).every(r=>isHole(r.i,r.j))
    }
    
    play(jump){
        const i0=jump.from.i, j0=jump.from.j;
        const i1=jump.to.i,   j1=jump.to.j;
        const piece = this.grid.get(i0,j0);
        const kind = piece.kind;
        if (piece==null)debugger;
        if (arrows.includes(kind)){ // fox
            const [di,dj] = fox_occupies[kind];
            this.grid.set(i0,j0,null);     // remove current fox
            this.grid.set(i0+di,j0+dj,null);
            this.grid.set(i1,j1,piece);    // add fox at new position
            this.grid.set(i1+di,j1+dj,piece);
        } else { // rabbit
            this.grid.set(i0,j0,null);
            this.grid.set(i1,j1,piece);
        }
        piece.i=i1;
        piece.j=j1;
        if (this.display){
            translateSVG(piece.drawing,piece.j,piece.i)
        }
    }
    
    undo(jump){
        this.play(new JumpIn_Jump(jump.to,jump.from,jump.kind))        
    }
    
}