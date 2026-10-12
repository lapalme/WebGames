import { Jump } from "../Jump.js"

export {SnowProblem_Jump}

class SnowProblem_Jump extends Jump{
    
    toString(){
        return this.from.i+"@"+this.from.j+this.arrow()
    }
    
    moveToString(){
        return this.arrow()
    }
}
