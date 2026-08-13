import {svg,translate} from "../SVGtools.js"
import {Piece} from "../Piece.js"
import {ToadsNFrogs_Jump} from "./ToadsNFrogs_Jump.js"

export {ToadsNFrogs_Piece}

class ToadsNFrogs_Piece extends Piece {
    constructor (id,i,j,kind){
        super(id,i,j)
        this.kind=kind;
    }
    
    toString(){
        return this.toState()
    }
    
    toState(){
        return this.kind;
    }
    
    // static fromState(state){
    // }
    
    isToad(){
        return this.kind=="T"
    }
    
    // Toad only goes to right (+1) and must move to left
    // Frog only goes to left  (-1) 
    possibleJumps(grid){
        let possibles=[]
        const j= this.j
        if (this.isToad()){// go forward
            if (j<grid.N-1){
                if (grid.isNull(0,j+1))
                    possibles.push(new ToadsNFrogs_Jump([0,j],[0,j+1]));
                else if (j<grid.N-2 && !grid.isNull(0,j+1) && grid.isNull(0,j+2))
                    possibles.push(new ToadsNFrogs_Jump([0,j],[0,j+2]));
            }
        } else { // go backward
            if (j>0){
                if (grid.isNull(0,j-1))
                    possibles.push(new ToadsNFrogs_Jump([0,j],[0,j-1]));
                else if (j>1 && !grid.isNull(0,j-1) && grid.isNull(0,j-2))
                    possibles.push(new ToadsNFrogs_Jump([0,j],[0,j-2]));
            }
        }
        return possibles
    }
    
    play(jump){
        this.j=jump.to.j;
        if (this.drawing!=null){
            this.drawing.attr("transform",translate(this.j,0))
        }   
    }
    
    draw(){
        this.drawing = svg("use",{href:this.isToad()?"#toad":"#frog", 
                                  transform:translate(this.j,0)})
        return this.drawing;
    }
}
