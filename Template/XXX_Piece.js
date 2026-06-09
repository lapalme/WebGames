import {svg,translate} from "../SVGtools.js"
import {Piece} from "../Piece.js"
import {Jump} from "../Jump.js"

export {XXX_Piece}

class XXX_Piece extends Piece {
    constructor (id,i,j){
        super(id,i,j)
        // TODO: add other attributes
    }
    
    toString(){
        return toState()
    }
    
    toState(){
        // create a state string
    }
    
    static fromState(state){
        //  create a piec from a state string
    }
    
    possibleJumps(grid){
        // TODO
    }
    
    draw(){
        // create drawing....
        return this.drawing;
    }
}
