import {svg,translate, cText} from "../SVGtools.js"
import {Piece} from "../Piece.js"
import {Jump,dir2rot} from "../Jump.js"
import { LunarLockout_Jump } from "./LunarLockout_Jump.js"
export {LunarLockout_Piece}

const didjs=Object.values(dir2rot).map(([_,di,dj])=>[di,dj])

const colors = {
    "R":"red",
    "B": "blue",
    "O" :"orange",
    "Y": "yellow",
    "G": "green",
    "P":"purple"
}

class LunarLockout_Piece extends Piece {
    constructor (id,i,j){
        super(id,i,j)
    }
    
    toString(){
        return this.id
    }
    
    toState(){
        return [this.id,this.i,this.j]
    }
    
    static fromState(state){
        //  create a piece from a state string
    }
    
    canMove(newI,newJ,di,dj,grid){
        newI+=di
        newJ+=dj
        while (grid.check(newI,newJ)){
            const piece=grid.get(newI,newJ)
            if (piece != null) return [newI-di,newJ-dj]
            newI+=di
            newJ+=dj
        }
        return [-1,-1]
    }
    
    possibleJumps(grid){
        let jumps = []
        for (const [di,dj] of didjs){
            let newI=this.i+di, newJ=this.j+dj;
            if (grid.isNull(newI,newJ)){
                [newI,newJ] = this.canMove(newI,newJ,di,dj,grid);
                if (newI>=0)
                    jumps.push(new LunarLockout_Jump([this.i,this.j],[newI,newJ],this))
            }
        }
        return jumps
    }
    
    draw(){
        this.drawing=svg("g",{transform:translate(this.j,this.i)},
            svg("use",{href:"#piece-def",fill:colors[this.id]}),
            cText(this.id,0.8,0.8,"white",0.2)
        )
        return this.drawing;
    }
}
