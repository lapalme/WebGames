import { Jump } from "../Jump.js"

export {LunarLockout_Jump}

class LunarLockout_Jump extends Jump{
    constructor(from,to,piece){
        super(from,to)
        this.piece=piece
    }
    
    toString(){
        return this.piece.id+this.arrow()
    }
    
    moveToString(){
        return this.arrow()
    }
}
