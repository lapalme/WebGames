import {svg,translate,rotateSVG} from "../SVGtools.js"
import {Piece} from "../Piece.js"
import {Jump,dir2rot} from "../Jump.js"
import { Hansel_Gretel_Jump } from "./Hansel_Gretel_Jump.js"

export {Hansel_Gretel_Piece,hasHole}

const hasHole = [[true,false,true,false],
                 [false,true,false,true],
                 [true,false,true,false],
                 [false,true,false,true]]

class Hansel_Gretel_Piece extends Piece {
    constructor (id,i,j,kind,dir){
        super(id,i,j)
        this.kind=kind;
        this.dir=dir
    }
    
    toString(){
        return this.kind
    }
    
    toState(){
        let state = [this.kind,this.i,this.j]
        if (this.kind=="r" || this.kind=="h")
            state.push(this.dir)
        return state;
    }
    
    static fromState(state){
        //  create a piece from a state string
    }
    
    possibleJumps(grid){
        let jumps = []
        switch (this.kind) {
            case "h":// house does not move
                return []
            case "l":// lollipop 
                if (hasHole[this.i][this.j]) return [] // in a hole
                // otherwise move one space
            case "b": case "g":
                if (this.i==3 && this.j==1){ // check for exit 
                    jumps.push(new Hansel_Gretel_Jump([3,1],[4,1],this.kind))
                }
                for (const [di,dj] of [[0,1],[0,-1],[1,0],[-1,0]]){
                    const newI=this.i+di,newJ=this.j+dj;
                    if (grid.isNull(newI,newJ)){
                        jumps.push(new Hansel_Gretel_Jump([this.i,this.j],[newI,newJ],this.kind))
                    }
                }
                return jumps
            case "r":
                if (this.dir=="↑"){
                    // change column
                    for (const [di,dj] of [[0,1],[0,-1]]){
                        const newI=this.i+di,newJ=this.j+dj;
                        if (grid.isNull(newI,newJ) && grid.isNull(newI+1,newJ))
                            jumps.push(new Hansel_Gretel_Jump([this.i,this.j],[newI,newJ],this.kind))
                    }
                    // move up
                    if (grid.isNull(this.i-1,this.j)) // no need to check next
                        jumps.push(new Hansel_Gretel_Jump([this.i,this.j],[this.i-1,this.j],this.kind))
                    // move down
                    if (grid.isNull(this.i+2,this.j))  // must check after the last position
                        jumps.push(new Hansel_Gretel_Jump([this.i,this.j],[this.i+1,this.j],this.kind))
                } else {
                    // change line
                    for (const [di,dj] of [[1,0],[-1,0]]){ 
                        const newI=this.i+di,newJ=this.j+dj;
                        if (grid.isNull(newI,newJ) && grid.isNull(newI,newJ+1))
                            jumps.push(new Hansel_Gretel_Jump([this.i,this.j],[newI,newJ],this.kind))
                    }
                    // move left
                    if (grid.isNull(this.i,this.j-1)) // no need to check next
                        jumps.push(new Hansel_Gretel_Jump([this.i,this.j],[this.i,this.j-1],this.kind))
                    // move right
                    if (grid.isNull(this.i,this.j+2))// must check after the last position
                        jumps.push(new Hansel_Gretel_Jump([this.i,this.j],[this.i,this.j+1],this.kind))
                }
                return jumps;
            default:
                console.log("*** Strange piece",this.kind)
                debugger;
        }
    }
    
    draw(){
        const kind2id={"g":"#girl","b":"#boy","r":"#rect-area","h":"#house","l":"#lollipop"};
        this.drawing = svg("use",{href:kind2id[this.kind],
                                  id:"piece-"+this.id,
                                  transform:translate(this.j,this.i)})
        if (this.dir != null && this.dir != "↑")
            rotateSVG(this.drawing,270,0.5,0.5)
        return this.drawing
    }
}
