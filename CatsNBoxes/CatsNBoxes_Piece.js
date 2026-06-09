import {svg,translate,rotate,M,L,rotateSVG} from "../SVGtools.js"
import { C } from "../C.js";
import { Grid } from "../Grid.js";
import {Piece} from "../Piece.js"
import {CatsNBoxes_Jump} from "./CatsNBoxes_Jump.js"
import { piecePos, allOris } from "./Problems.js";
import { dirInv, dir2rot,nextDir } from "../Jump.js";

export {CatsNBoxes_Piece, Cat, Tile}

class CatsNBoxes_Piece extends Piece {
    constructor (id,i,j){
        super(id,i,j)
    }
    
    toString(){
        return this.id
    }
}

const catColors = {"w":"white","b":"black","g":"gray","o":"orange","t":"tan"}

class Cat extends CatsNBoxes_Piece {
    constructor(id,i,j){
        super(id,i,j);
        this.tile = null; // must be the id
    }
    
    toState(){
        return [this.i,this.j]
    }

    draw(){
        this.drawing = svg("use",{href:"#cat",fill:catColors[this.id],
                                   "stroke":this.id=="b"?"white":"black",
                                   transform:translate(this.j,this.i)})
        return this.drawing;
    }
    
    isBoxed(){
        return this.tile!= null;
    }
}

// paths for drawing the tiles at the original (North) orientation 
// paths start at the top left 
//     then move inside to make a hole
const d=0.05, d2=d+d // small inset
const box_path = M(d2,d2)+L(1-d2,d2)+L(1-d2,1-d2)+L(d2,1-d2)+L(d2,d2)
const paths = {
    "F": M(d,-2+d)+L(1-d,-2+d)+L(1-d,d)+L(2-d,d)+L(2-d,1-d)+L(d,1-d)+L(d,-2+d)+
               box_path,
    "G": M(d,-1+d)+L(2-d,-1+d)+L(2-d,-d)+L(1-d,-d)+L(1-d,2-d)+L(d,2-d)+L(d,-1+d)+
               box_path,
    "H": M(d,-1+d)+L(1-d,-1+d)+L(1-d,d)+L(2-d,d)+L(2-d,1-d)+L(-1+d,1-d)+L(-1+d,d)+L(d,d)+L(d,-1+d)+
               box_path,
    "I": M(1+d,-2+d)+L(2-d,-2+d)+L(2-d,-d)+L(1-d,-d)+L(1-d,1-d)+L(d,1-d)+L(d,-d)+L(-1+d,-d)+L(-1+d,-1+d)+L(1+d,-1+d)+L(1+d,-2+d)+
               box_path+
               M(1+d2,-2+d2)+L(2-d2,-2+d2)+L(2-d2,-1-d2)+L(1+d2,-1-d2)+L(1+d2,-2+d2)
}
               

// HACK: there are still "assertions" that call the debugger just in case...
//       This code was quite subtle to debelop...
class Tile extends CatsNBoxes_Piece {
    constructor(id,i,j,ori){
        super(id,i,j)
        this.ori = ori;
        this.myPos = piecePos[this.id]
        this.myCat = null;               // must be id
        if (id=="I")this.myOtherCat=null;
    }
        
    toState(){
        return [this.i,this.j,this.ori]
    }
    
    // find possible jumps on a copy of the original grid with only pieces id
    // taking care of not modifying the original piece...
    possibleJumps(originalgrid){
        function isCat(cell){
            return "wbgot".includes(cell)
        }
        function isOKForBox(cell){
            return cell==null || isCat(cell)
        }
        // copy the grid ids for testing the possible moves
        // important not to copy the objects that might be changed...
        const grid = originalgrid.map((_i,_j,cell)=>{
            // the following is subtle but important so that a cat covered by
            // nother piece not be covered except for this piece
            if (cell == null) return null
            if (cell instanceof Cat && cell.tile!=null && cell.tile != this.id)
                return cell.tile
            return cell.id
        })
        let jumps=[]
        const myPos = this.myPos;
        const myPosOri = myPos[this.ori]
         // clear piece positions except for cats
        for (const [di,dj] of myPosOri){
            const cell = grid.get(this.i+di,this.j+dj)
            if (!isCat(cell))
                grid.set(this.i+di,this.j+dj,null)
        }
        for (const newOri of allOris){
            const newPosOri = myPos[newOri];
            grid.forEach((i,j,v0)=>{
                if(i==this.i && j== this.j && newOri==this.ori) return // skip current pos+ori
                if (!isOKForBox(v0))return;
                if (this.id == "I"){
                    const [di,dj]=newPosOri[4];
                    if (!grid.check(i+di,j+dj)) return
                    const v1= grid.get(i+di,j+dj);
                    if (!isOKForBox(v1)) return // other end cannot overlap a Tile
                }  // check other pos for null
                if (newPosOri.slice(1,4).every(([di,dj])=>grid.isNull(i+di,j+dj))){
                    jumps.push(new CatsNBoxes_Jump([this.i,this.j],[i,j],this.id,
                                                   this.ori,newOri))
                }
            })
        }
        return jumps;
    }
    
    play(jump,grid){
        let cell;
        const [toI,toJ] = [jump.to.i,jump.to.j];
        // clear the current cells from the grid
        const myPosOri = this.myPos[this.ori]
        // clear piece positions except for cats
        for (const [di,dj] of myPosOri){
            const cell = grid.get(this.i+di,this.j+dj)
            if (cell instanceof Cat)
                cell.tile=null;
            else
                grid.set(this.i+di,this.j+dj,null)
        }
        // add new positions
        cell = grid.get(toI,toJ);
        if (cell instanceof Tile) debugger;
        if (cell instanceof Cat) {// check for cat at start
            cell.tile=this.id;
            this.myCat=cell.id;
        }
        for (const [di,dj] of this.myPos[jump.ori].slice(1,4)){
            if (grid.get(toI+di,toJ+dj!=null))debugger;
            grid.set(toI+di,toJ+dj,this)
        }
        if (this.id == "I"){ // check for cat at the end for I
            const [di,dj] = this.myPos[jump.ori][4];
            cell = grid.get(toI+di,toJ+dj);
            if (cell instanceof Tile) debugger;
            if (cell instanceof Cat){
                cell.tile=this.id;
                this.myOtherCat=cell.id;
            }
        }
        // update cells with new positions
        this.i = toI;
        this.j = toJ;
        this.ori = jump.ori;
        if (this.drawing){
            this.drawing.attr("transform",translate(this.j,this.i)+rotate(this.ori,0.5,0.5))
        }
    }
    
    draw(){
        this.drawing = svg("g",{transform:translate(this.j,this.i)+
                                 rotate(this.ori,0.5,0.5)},
            svg("title",{},this.id),
            svg("path",{d:paths[this.id],"fill-rule":"evenodd",
                                  stroke:"darkblue","stroke-width":0.03,"stroke-linejoin":"round",
                                  fill:"url(#flower)", // try to make this work later
                                //   fill:"#87CEEB"
                                  }),            
            svg("use",{href:"#box",fill:"transparent",stroke:"#5d4301"})
        )
        if (this.id=="I"){
            const [di,dj] = this.myPos["↑"][4]
            $(":last",this.drawing).before(
                svg("use",{href:"#box",transform:translate(dj,di),
                            fill:"none",stroke:"#DAA520"})
            )
        }
        return this.drawing;
    }
                                                   
}
