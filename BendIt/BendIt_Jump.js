import { Jump } from "../Jump.js"

export {BendIt_Jump}

class BendIt_Jump extends Jump{
    constructor(from,to,piece){
        super(from,to)
        this.piece=piece;
    }
    
    toString(){
        return super.toString()+":"+this.piece.toString()
    }
}
