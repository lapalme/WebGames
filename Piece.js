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
    
    possibleJumps(grid){
        throw new Error("Piece.possibleJumps: should be redefined in a subclass")
    }
}