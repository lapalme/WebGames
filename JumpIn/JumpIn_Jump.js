import { Jump,allDirs } from "../Jump.js"

export {JumpIn_Jump}

class JumpIn_Jump extends Jump{
    constructor(from,to,kind){
        super(from,to)
        this.kind=kind;
    }
    
    toString(){
        if (allDirs.includes(this.kind))
            return this.kind+"🦊"+this.arrow()
        return this.kind+this.arrow();
    }
}
