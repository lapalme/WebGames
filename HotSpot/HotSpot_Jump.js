import { Jump } from "../Jump.js"

export {HotSpot_Jump}

class HotSpot_Jump extends Jump{
    constructor(from,to,pid){
        super(from,to)
        this.pid = pid;
    }
    
    toString(){
        return this.pid+super.arrow()
    }
}
