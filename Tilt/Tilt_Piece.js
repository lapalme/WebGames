import {svg,translate,isSafari} from "../SVGtools.js"
import { C } from "../C.js";
import {Piece} from "../Piece.js"
import {Jump} from "../Jump.js"

export {Tilt_Piece}

class Tilt_Piece extends Piece {
    constructor (id,i,j,kind){
        super(id,i,j)
        this.kind = kind;
    }
    
    toString(){
        return this.kind;
    }
    
    possibleJumps(grid){
        // unused...
    }
    
    draw(){
        this.drawing = svg("use",{href:"#"+this.kind,transform:translate(this.j,this.i)})
        if (this.kind != "O" && !isSafari())
            this.drawing.attr("filter","url(#shadow)")
    }
}
