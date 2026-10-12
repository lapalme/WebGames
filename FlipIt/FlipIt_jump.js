import { Jump } from "../Jump.js"
import { ij2letter } from "./FlipIt_Board.js";

export {FlipIt_Jump}

class FlipIt_Jump extends Jump{
    constructor(from,to){
        super(from,to);
    }
    
    toString(){
        return ij2letter[this.from.i][this.from.j]+"-"+ij2letter[this.to.i][this.to.j]
    }
    
    moveToString(){
        return ij2letter[this.to.i][this.to.j]
    }
}
