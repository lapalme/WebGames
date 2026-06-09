import {Jump} from "../Jump.js"
export {RH_Jump}

class RH_Jump extends Jump{
    constructor(from,to,id){
        super(from,to);
        this.id = id;
    }

    toString(){
        return this.id+this.arrow()
    }
}