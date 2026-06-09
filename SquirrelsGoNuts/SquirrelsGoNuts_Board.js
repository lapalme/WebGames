import { translate,translateSVG } from "../SVGtools.js"
import {Board} from "../Board.js"
import {Grid} from "../Grid.js"
import {Jump,allDirs} from "../Jump.js"
import {SquirrelsGoNuts_Piece} from "./SquirrelsGoNuts_Piece.js"
import {positions} from "./Problems.js"
export {SquirrelsGoNuts_Board,showMoves,holePositions,overHole,M,N}

function showMoves(jumpsList){
    let moves = []
    for (const jumps of jumpsList){
        let move = jumps[0].toString();
        for (const jump of jumps.slice(1))
            move+=jump.toString().slice(1)
        moves.push(move)
    }
    return moves.join(" ")
}

const M=4,N=4;
const holePositions = [[0,2],[1,0],[2,1],[3,3]];


// return index of hole if it exists, -1 otherwise
function overHole(i,j){
    return holePositions.findIndex(([i1,j1])=>i1==i && j1==j)
}

class SquirrelsGoNuts_Board extends Board {
    constructor (no,state,display){
        state = JSON.parse(state);
        super(no,state,display);
        this.grid = new Grid(M,N);
        this.filledHoles = state.filledHoles;
        this.pieces = [];
        this.movable = [];
        for (const [id,i,j,dir,hasNut] of state.pieces){
            const piece = new SquirrelsGoNuts_Piece(id,i,j,dir,hasNut)
            this.grid.set(i,j,piece);
            if (id != "F")
                for (const [di,dj] of positions[id][dir])
                    this.grid.set(i+di,j+dj,piece);
            this.pieces.push(piece);
            if ("GRYB".includes(id))
                this.movable.push(piece);
        }
        if (display != null) // this call must come after pieces have been added
            display.setBoard(this);
    }

    toState(){
       return JSON.stringify({pieces:this.pieces.map(p=>p.toState()),filledHoles:this.filledHoles})
    }
    
    toString(){
        return this.grid.toString()
    }
    
    possibleJumps(){
        return this.movable.flatMap(p=>p.possibleJumps(this.grid))
    }
    
    isComplete(){
        // all pieces have lost their nut
        return this.movable.every(p=>!p.hasNut)
    }
    
    play(jump){
        const piece=this.movable[this.movable.findIndex(m=>m.id==jump.id)];
        const [di,dj] = jump.direction();
        piece.play(this.grid,di,dj);
        if (this.display != null)
            translateSVG(piece.drawing,piece.j,piece.i)
        if (piece.hasNut){
            const idx = overHole(piece.i,piece.j);
            if (idx>=0){
                if (!this.filledHoles[idx]){
                    jump.nutInHole=true;
                    piece.hasNut=false;
                    this.filledHoles[idx]=true;
                    if (this.display!=null){
                        const [i,j]=holePositions[idx];
                        $("#background").append(
                            $(".nut",piece.drawing).attr("transform",translate(j,i))
                        )
                        piece.drawing.attr("stroke","Green");
                        $("#hi"+idx).attr("fill","brown");
                    }
                }
            }
        }  
    }
    
    undo(jump){
        // invert play
        const piece=this.movable[this.movable.findIndex(m=>m.id==jump.id)];
        const [di,dj] = jump.direction();
        piece.play(this.grid,-di,-dj);
        translateSVG(piece.drawing,piece.j,piece.i)
        // if the move left the nut, put it back on the piece after the path (under the squirrel...)
        if (jump.nutInHole){
            piece.hasNut=true;
            piece.drawing.attr("stroke","yellow");
            const [holeI,holeJ] = [jump.to.i,jump.to.j];
            const nut = $(`.nut[transform="${translate(holeJ,holeI)}"]`);
            nut.attr("transform",null);
            $("path",piece.drawing).after(nut)
            const idx = overHole(holeI,holeJ);
            $("#hi"+idx).attr("fill","white");
            this.filledHoles[idx]=false;
        }
          
    }
    
}