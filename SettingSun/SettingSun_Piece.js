import {svg,translate,cText} from "../SVGtools.js"
import {Piece} from "../Piece.js"
import {dir2rot,dirInv} from "../Jump.js"
import {SettingSun_Jump} from "./SettingSun_Jump.js"

export {SettingSun_Piece,posPieces}

const didjs=[[0,1],[0,-1],[1,0],[-1,0]]

// const p4x4=[[0,0],[0,1],[1,0],[1,1]]
// const p1x2=[[0,0],[0,1]]
// const p2x1=[[0,0],[1,0]]
// const p1x1=[[0,0]]

const posPieces = {"#":[[0,0],[0,1],[1,0],[1,1]],
                   "|":[[0,0],[1,0]],
                   "-":[[0,0],[0,1]],
                   "*":[[0,0]]}
const idPieces = {"#":"#p4x4",
                  "|":"#p2x1",
                  "-":"#p1x2",
                  "*":"#p1x1"}

class SettingSun_Piece extends Piece {
    constructor (id,i,j,kind){
        super(id,i,j)
        this.kind=kind;
    }
    
    toString(){
        return this.id
    }
    
    toState(){
        return [this.id,this.i,this.j,this.kind]
    }
    
    possibleJumps(grid){
        let jumps = []
        let newI,newJ;
        const pushJump=()=>jumps.push(new SettingSun_Jump([this.i,this.j],[newI,newJ],this))
        for (const [di,dj] of didjs){
            newI=this.i+di, newJ=this.j+dj;
            switch (this.kind) {
                case "*": // 1x1
                    if (grid.isNull(newI,newJ)){
                        pushJump()
                    }
                    break
                case "|": // 2x1 (vertical)
                    if (di==0){
                        if (grid.isNull(this.i,this.j+dj) && grid.isNull(this.i+1,this.j+dj))
                            pushJump()
                    } else if (di==-1){
                        if (grid.isNull(this.i-1,this.j))
                            pushJump()
                    } else if (di==1){ 
                        if (grid.isNull(this.i+2,this.j))
                            pushJump()
                    } else
                        debugger;
                    break;
                case "-": // 1x2 (horizontal)
                    if (dj==0){
                        if (grid.isNull(this.i+di,this.j) && grid.isNull(this.i+di,this.j+1))
                            pushJump()
                    } else if (dj==-1){
                        if (grid.isNull(this.i,this.j-1))
                            pushJump()
                    } else if (dj==1) {
                         if (grid.isNull(this.i,this.j+2))
                            pushJump()
                    } else
                        debugger;
                    break
                case "#": // 2x2
                    if (di==0){
                        if (dj==-1){
                            if (grid.isNull(this.i,this.j-1) && grid.isNull(this.i+1,this.j-1))
                                pushJump()
                        } else if (dj==1){
                            if (grid.isNull(this.i,this.j+2) && grid.isNull(this.i+1,this.j+2))
                                pushJump()
                        } else
                            debugger;
                    } else { // dj==0
                        if (di==-1){
                            if (grid.isNull(this.i-1,this.j) && grid.isNull(this.i-1,this.j+1))
                                pushJump()
                        } else if (di==1){
                            if (grid.isNull(this.i+2,this.j) && grid.isNull(this.i+2,this.j+1))
                                pushJump()
                        } else
                            debugger;
                    }
                     break;
                default:
                console.log("Strange piece:",this.id)
                    break;
            }
        }
        return jumps
    }
        
    
    draw(){
        this.drawing = svg("g",{transform:translate(this.j,this.i)},
            svg("use",{href:idPieces[this.kind]}),
            cText(this.id,0.2,0.2,"white",0.2)
        )
        return this.drawing;
    }
}
