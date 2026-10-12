export {Piece}

class Piece {
    constructor (id,i,j) {
        this.id = id;
        this.i  = i;
        this.j  = j;
        this.drawing = null;
    }
    
    toString(){
        return `Piece(${this.id},${this.i},${this.j})`
    }
    
    toState(){  // returns a state representation
        throw new Error("Piece.toState: should be redefined in a subclass")
    }
    
    possibleJumps(grid){ // returns a list of instances of a subclass of Jump
        throw new Error("Piece.possibleJumps: should be redefined in a subclass")
    }
    
    draw(){  // creates this.drawing and returns it
        throw new Error("Piece.possibleJumps: should be redefined in a subclass")
    }
}