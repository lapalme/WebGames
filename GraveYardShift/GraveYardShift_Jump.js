import { Jump } from "../Jump.js"

export {GraveYardShift_Jump}

class GraveYardShift_Jump extends Jump{
    constructor(from,to,id,old_ori,new_ori){
        super(from,to);
        this.id = id
        this.old_ori=old_ori;
        this.new_ori=new_ori;
        
    }
    
    toString(){
        if (this.isImmobile()) return this.id+this.new_ori;
        return this.arrow()+this.id+this.new_ori;
    }
}
