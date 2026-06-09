import { Jump } from "../Jump.js"

export {AsteroidEscape_Jump}

class AsteroidEscape_Jump extends Jump{
    constructor(from,to,pid){
        super(from,to);
        this.pid = pid;
    }
    
    toString(){
        return this.pid+this.arrow()+super.toString()
    }
}
