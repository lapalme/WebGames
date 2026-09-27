import {svg,translate,rotate} from "../SVGtools.js"
import {Piece} from "../Piece.js"
import {dir2rot,dirInv} from "../Jump.js"
import { ExpressCourier_Jump } from "./ExpressCourier_Jump.js"
import { isExit } from "./ExpressCourier_Board.js"

export {ExpressCourier_Piece}
const arrow2letter = {"↓":"s", "←":"w", "↑":"n", "→":"e"}

const color2RGB = {
    "r":"#FF0000",
    "o":"#FFA500",
    "y":"#FFFF00",
    "g":"#00FF00",
    "a":"#00FFFF",
    "b":"#0000FF",
    "p":"#800080"
}

// function dir2ij(dir){
//     return  dir2rot[dirInv[dir]].slice(1)
// }

class ExpressCourier_Piece extends Piece {
    constructor (id,i,j,color,dir,cargo){
        super(id,i,j);
        this.color = color;
        this.dir = dir;
        this.cargo = cargo;
        const [_,di,dj]=dir2rot[this.dir]
        this.cargoI = this.i+di
        this.cargoJ = this.j+dj
    }
    
    toString(){
        return this.dir+this.color+(this.cargo==null?"":this.cargo)
    }
    
    toState(){
        return this.color+arrow2letter[this.dir]+this.i+this.j+(this.cargo==null?"":this.cargo)
    }
    
    static fromState(state){
        //  create a piece from a state string
    }
    
    hasCargo(){
        return this.cargo !== null
    }
    
    hasItsCargo(){
        return this.cargo == this.color
    }
    
    moveCargo(otherPiece){
        if (this.cargo == null) debugger;
        otherPiece.cargo = this.cargo;
        this.cargo = null;
    }
    
    
    checkMove(grid,i,j){
        return grid.isNull(i,j) || (isExit(i,j,this.dir) && this.hasItsCargo())
    }
    
    tryToMoveTruck(grid,newI,newJ,jumps,di,dj){
        if (this.checkMove(grid,newI,newJ))
            jumps.push(new ExpressCourier_Jump([this.i,this.j],[this.i+di,this.j+dj],this.color,false))
    }
    
    possibleJumps(grid){
        let jumps=[]
        // truck moves
        if (this.dir=="↑"){
            this.tryToMoveTruck(grid,this.i-1,this.j,jumps,-1,0)  // up
            this.tryToMoveTruck(grid,this.cargoI+1,this.j,jumps,1,0) //down
        } else if (this.dir == "↓"){
            this.tryToMoveTruck(grid,this.cargoI-1,this.j,jumps,-1,0) // up
            this.tryToMoveTruck(grid,this.i+1,this.j,jumps,1,0) //down
        } else if (this.dir=="→"){
            this.tryToMoveTruck(grid,this.i,this.cargoJ-1,jumps,0,-1) // left
            this.tryToMoveTruck(grid,this.i,this.j+1,jumps,0,1) // right        
        } else if (this.dir=="←"){
            this.tryToMoveTruck(grid,this.i,this.j-1,jumps,0,-1) // left
            this.tryToMoveTruck(grid,this.i,this.cargoJ+1,jumps,0,1) // right
        }
        // tilt cargo
        if (this.hasCargo()){
            for (let [di,dj] of [[-1,0],[1,0],[0,-1],[0,1]]){
                const newI=this.cargoI+di, newJ=this.cargoJ+dj;
                if (grid.check(newI,newJ)){
                    const otherTruck = grid.get(newI,newJ)
                    if (otherTruck!=this.piece && !otherTruck.hasCargo() &&
                        (otherTruck.i != newI || otherTruck.j != newJ)){
                        jumps.push(new ExpressCourier_Jump([this.cargoI,this.cargoJ],[newI,newJ],this.cargo,true))
                    }
                }
            }
        }
        return jumps;
    }
    
    draw(){
        this.drawing = svg("g",{id:"piece_"+this.id,
                                transform:translate(this.j,this.i)
                                +rotate(dir2rot[dirInv[this.dir]][0],0.5,0.5)},
            svg("use",{href:"#truck",fill:color2RGB[this.color]})
        )
        if (this.hasCargo()){
            this.drawing.append(
                svg("use",{href:"#cargo",class:"cargo",fill:color2RGB[this.cargo]})
            )
        }
        return this.drawing;
    }
}
