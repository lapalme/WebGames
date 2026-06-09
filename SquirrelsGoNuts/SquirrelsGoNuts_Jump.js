import { Jump } from "../Jump.js"

export {SquirrelsGoNuts_Jump}

class SquirrelsGoNuts_Jump extends Jump{
    constructor(piece,i,j,nutInHole){
        super([piece.i,piece.j],[i,j])
        this.id=piece.id;
        this.nutInHole = nutInHole;
    }
    
    toString(){
        return this.id+this.arrow()+(this.nutInHole?"🌰":"")
    }
}