import {Jump} from "../Jump.js"
export {CannibalMonsters_Jump}

class CannibalMonsters_Jump extends Jump {
    constructor(from,to,eater){
        super(from,to);
        this.eater=eater.toString()
    }
    
    toString(){
        return this.eater+this.arrow()
    }
}