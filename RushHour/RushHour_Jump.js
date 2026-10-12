import {Jump} from "../Jump.js"
export {RushHour_Jump}

class RushHour_Jump extends Jump{
    constructor(from,to,id){
        super(from,to);
        this.id = id;
    }

    toString(){
        return this.id+this.arrow()
    }
    
    moveToString(){
        return this.arrow()
    }
}