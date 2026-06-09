import {svg,translate,rotate,isSafari} from "../SVGtools.js"
import { C } from "../C.js";
import {Piece} from "../Piece.js"
import {Jump,dir2rot,allDirs,dirInv} from "../Jump.js";
import {JumpIn_Jump} from "./JumpIn_Jump.js";
import { isHole } from "./JumpIn_Board.js";

export {JumpIn_Piece}

const fox_must_be_free = {
    // [[di,dj],[ddi,ddj]]
    // for [di,dj] movement, ddi,ddj must be free 
    "↑":[[[-1,0],[-1,0]], [[1,0],[2,0]]],
    "↓":[[[-1,0],[-2,0]], [[1,0],[1,0]]],
    "←":[[[0,-1],[0,-1]], [[0,1],[0,2]]],
    "→":[[[0,-1],[0,-2]], [[0,1],[0,1]]]
}

const rabbit_colors = {"w":"white","t":"tan","g":"gray","b":"black"}

class JumpIn_Piece extends Piece {
    static nb=1;
    constructor (kind,i,j){
        super(JumpIn_Piece.nb++,i,j)
        this.kind=kind;
    }
    
    toString(){
        if (allDirs.includes(this.kind))
            return this.kind+"🦊"
        if ("gtwb".includes(this.kind))return this.kind;
        return "🍄"   //this.kind;
    }
    
    toState(){
        return [this.kind,this.i,this.j]
    }
    
    static fromState(state){
        return new JumpIn_Piece(...state)
    }
    
    possibleJumps(grid){
        function isFree(i,j){
            return grid.check(i,j) && grid.get(i,j)==null;
        }
        let jumps=[]
        if (allDirs.includes(this.kind)){// move fox (HACK: it has a length of 2)
            const i=this.i,j=this.j;
            for (const must_be_free of fox_must_be_free[this.kind]){
                const [[di,dj],[ddi,ddj]] = must_be_free;
                if (isFree(i+ddi,j+ddj))
                    jumps.push(new JumpIn_Jump([i,j],[i+di,j+dj],this.kind))
            }
        } else {// move rabbit in any direction while it encounters something
            for (const dir of allDirs){
                const [_,di,dj]=dir2rot[dir];
                let i = this.i+di, j=this.j+dj;
                if (!isFree(i,j)) { // first cell must not be free
                    while (grid.check(i,j)){
                        if (grid.get(i,j)==null){
                            jumps.push(new JumpIn_Jump([this.i,this.j],[i,j],this.kind))
                            break;
                        }
                        i+=di;j+=dj;
                    }
                }
            }
        }
        return jumps;
    }
    
    draw(){
        if (allDirs.includes(this.kind)){
            this.drawing = svg("use",{href:"#fox",transform:translate(this.j,this.i)+rotate(dir2rot[dirInv[this.kind]][0],0.5,0.5)})
        } else if (this.kind=="*"){
            this.drawing = svg("use",{href:"#mushroom",transform:translate(this.j,this.i)})
        } else {
            this.drawing = svg("use",{href:this.kind=="b"?"#black-rabbit":"#rabbit",
                fill:rabbit_colors[this.kind],transform:translate(this.j,this.i)})
        }
        if (!isSafari())this.drawing.attr("filter","url(#shadow)")
        return this.drawing;
    }
}
