import { Jump } from "../Jump.js"

export {Hansel_Gretel_Jump}

class Hansel_Gretel_Jump extends Jump{
    constructor(from,to,kind){
        super(from,to)
        this.kind = kind
    }
    
    toString(){
        return this.kind+this.from.i+this.from.j+this.arrow()
    }
    
    moveToString(){
        return this.arrow()
    }
}
