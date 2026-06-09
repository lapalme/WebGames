import {Board} from "../Board.js"
import {Grid} from "../Grid.js"
import {Jump} from "../Jump.js"
import {FlipIt_Piece} from "./FlipIt_Piece.js"

export {M,N,FlipIt_Board,ij2letter,showMoves}

//  M: nombre de lignes, N: nombre de colonnes
const M=4,N=4;

//  Majuscule = Orange, Minuscule = Vert
const letter2ij = {
    "A":[0,0],"B":[0,1],"C":[0,2],"D":[0,3],
    "E":[1,0],"F":[1,1],"G":[1,2],"H":[1,3],
    "I":[2,0],"J":[2,1],"K":[2,2],"L":[2,3],
    "M":[3,0],"N":[3,1],"O":[3,2],"P":[3,3]
}

const ij2letter = Array.from({length:M}, (_)=> Array.from({length:N},(_)=>null))
for (const l in letter2ij){
    const [i,j] = letter2ij[l];
    ij2letter[i][j]=l;
}

function showMoves(jumpsList){
    let moves = [];
    for (const jumps of jumpsList){        
        let res = ij2letter[jumps[0].from.i][jumps[0].from.j]+"-"+ij2letter[jumps[0].to.i][jumps[0].to.j];
        for (let i=1;i<jumps.length;i++)
            res += ij2letter[jumps[i].to.i][jumps[i].to.j]
        moves.push(res)
    }
    return moves.join(", ")
}

class FlipIt_Board extends Board {
    constructor (no,state,display){
        super(no,state,display);
        this.grid = new Grid(4,4)
        this.pieces=[];
        for (const letter of state){
            const [i,j] = letter2ij[letter.toUpperCase()]
            const piece = new FlipIt_Piece(this.pieces.length,i,j,letter!=letter.toUpperCase());
            this.grid.set(i,j,piece);
            this.pieces.push(piece)
        }
        if (display != null)
            display.setBoard(this)
    }
    
    toString(){  // afficher la configuration avant le coup
        return this.state.toString();
    }
    
    toState(){
        let res = [];
        this.grid.forEach((i,j,v)=>{
            if (v!=null){
                let l = ij2letter[i][j];
                if (v.flipped)l=l.toLowerCase()
                res.push(l)
            }
        })
        return res.join("")
    }
    
    showGrid(){
        this.grid.showGrid(2)
    }
    
    possibleJumps(){
        return this.pieces.map(p=>p.possibleJumps(this.grid)).flat()
    }
    
    isComplete(){
        return this.pieces.every(p=>p.flipped)
    }
    
    play(jump){
        const grid=this.grid;
        const from=jump.from, to=jump.to;
        // HACK: save local variables that might be swapped!!! they must not be changed in the Jump
        let fromI=from.i,fromJ=from.j,toI=to.i,toJ=to.j; 
        const piece = grid.get(fromI,fromJ);
        if(piece==null){
            debugger;
        }
        // jump
        grid.set(fromI,fromJ,null);
        grid.set(toI,toJ,piece);
        piece.i=toI;
        piece.j=toJ;
        // flip jumped turtles
        if (fromI==toI){ // vertical
            if (fromJ>toJ)[fromJ,toJ]=[toJ,fromJ];
            for (let j=fromJ+1;j<toJ;j++)
                grid.get(fromI,j).flip()
        } else if (fromJ==toJ){ // horizontal
            if (fromI>toI)[fromI,toI]=[toI,fromI];
            for (let i=fromI+1;i<toI;i++)
                grid.get(i,fromJ).flip()
        } else {// diagonal
            const di=Math.sign(toI-fromI);
            const dj=Math.sign(toJ-fromJ);
            const len = Math.abs(toI-fromI);
            for (let k=1;k<len;k++){
                const i=fromI+k*di;
                const j=fromJ+k*dj;
                grid.get(i,j).flip()   
            }
        }
    }
    
    undo(jump){ // play the reverse of the jump
        this.play(new Jump(jump.to,jump.from))
    }

}