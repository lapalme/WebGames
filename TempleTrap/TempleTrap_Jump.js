import { Jump } from "../Jump.js"

export {TempleTrap_Jump}

class TempleTrap_Jump extends Jump{
    constructor(id,from,to,path=""){
        super(from,to);
        this.id =id;
        this.path=path;
    }
    
    toString(){
        if (this.id == "!"){
            return "●"+this.path
        } else {
            const sym ={"d":"◇","s":"□","<":"◁","*":"✱"}[this.id] || this.id
            return sym+this.arrow()
        }
    }
}
