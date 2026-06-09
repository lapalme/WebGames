import {translate} from "../SVGtools.js"
import {Board} from "../Board.js"
import {Grid} from "../Grid.js"
import {SnowProblem_Piece} from "./SnowProblem_Piece.js"
import {Jump} from "../Jump.js"
export {M,N,SnowProblem_Board,showMoves}

const M=4, N=5;

function showMoves(jumpsList){
    let moves=[]
    for (const jumps of jumpsList){
        let res = jumps[0].from.toString()+jumps[0].arrow()
        for (let k=1;k<jumps.length;k++)
            res+=jumps[k].arrow();
        moves.push(res)
    }
    return moves.join(", ");
}

class SnowProblem_Board extends Board {
    constructor (no,state,display){
        super(no,state,display);
        this.grid = new Grid(M,N) 
        this.pieces = []
        let pNo=1;
        for (const pc of state.split(" ")){
            const i=parseInt(pc.charAt(0));
            const j=parseInt(pc.charAt(1));
            const kind=pc.substring(2);
            const piece = new SnowProblem_Piece(pNo,i,j,kind);
            this.pieces.push(piece)
            this.grid.set(i,j,piece);
            pNo++;
        }
        if (display != null) // this call must come after pieces have been added
            display.setBoard(this);
    }
    
    toString(){
        return this.grid.show(3)
    }

    toState(){
        return this.pieces.map(p=>p.toState()).sort().join(" ")
    }
    
    possibleJumps(){
        return this.pieces.map(p=>p.possibleJumps(this.grid)).flat()
    }
    
    isComplete(){
        return this.pieces.filter(p=>"yrb".includes(p.kind)).length==0;
    }
    
    isBlocked(){
        return this.pieces.every(p=>p.kind=="t" || p.possibleJumps(this.grid).length==0)
    }
    
    
    play(jump){
        if (this.display !=null) $(".animate").remove();
        const piece = this.grid.get(jump.from.i,jump.from.j);
        if (piece==null) debugger;
        const newI=jump.to.i, newJ=jump.to.j;
        this.grid.set(piece.i,piece.j,null);
        if(this.display!=null && this.grid.get(newI,newJ)==null){
            $("title",piece.drawing).text(newI+"@"+newJ);
            piece.rollTo(newI,newJ)
        }
        piece.i=newI;
        piece.j=newJ;
        const thatPiece = this.grid.get(newI,newJ);
        if (thatPiece != null){
            piece.stackOn(thatPiece);
            const idx = this.pieces.findIndex(p => p==piece);
            this.pieces.splice(idx,1)
            return 
        }
        // ensure that drawings are displayed in increasing order of i (back to front)
        if (this.display!=null){
            $("#pieces").append(this.pieces.sort((p1,p2)=>p1.i-p2.i).map(p=>p.drawing));
        }
        this.grid.set(newI,newJ,piece);
    }
    
    undo(jump){  // HACK: this is called only when display is not null
        $(".animate").remove();
        const piece = this.grid.get(jump.to.i,jump.to.j);
        if (piece==null) debugger;
        if (piece.kind=="l" || piece.kind=="m"){
            // play the reverse of the jump
            this.play(new Jump(jump.to,jump.from))
        } else { // must unstack pieces...
            const i=piece.i,j=piece.j;
            // unstack and create new pieces...
            const [di,dj] = jump.direction();
            const newI=i-di, newJ=j-dj;
            let newPiece;
            if (piece.kind == "lm"){
                const $d = $("g[id^='m']",piece.drawing);
                const id = $d.attr("id")
                // remove the "m" drawing
                $d.remove()
                newPiece = new SnowProblem_Piece(id.charAt(id.length-1),newI,newJ,"m");
                piece.kind = "l";
            } else { // remove head
                const newKind = piece.kind.charAt(piece.kind.length-1);
                const $d = $(`g[id^='${newKind}']`,piece.drawing);
                const id = $d.attr("id");
                $d.remove();
                newPiece = new SnowProblem_Piece(id.charAt(id.length-1),newI,newJ,newKind); 
                piece.kind = "lm";
            }
            newPiece.draw();
            this.pieces.push(newPiece);
            $("#pieces").append(this.pieces.sort((p1,p2)=>p1.i-p2.i).map(p=>p.drawing));
            this.grid.set(newI,newJ,newPiece);
            return newPiece           
        }
    }   
}