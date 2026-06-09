import { Jump } from "../Jump.js"

export {GrizzlyGears_Jump}

class GrizzlyGears_Jump extends Jump{
    constructor(pos,delta){
        super(pos,pos)
        this.delta=delta;
    }
    
    toString(){
        return ""+this.from.i+this.from.j+(this.delta>0?"⤾":"⤿")
    }
}
