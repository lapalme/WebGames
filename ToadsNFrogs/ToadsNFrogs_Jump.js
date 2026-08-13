import { Jump } from "../Jump.js"

export {ToadsNFrogs_Jump}

class ToadsNFrogs_Jump extends Jump{
    constructor(from,to){
        super(from,to)
    }
    
    toString(){
        return this.from.j+"=>"+this.to.j
    }
}
