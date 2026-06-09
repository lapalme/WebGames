import {Jump} from "../Jump.js"

export {CM_Jump}

class CM_Jump extends Jump {
    constructor(from,to,kind,color,dir){
        super(from,to)
        this.kind = kind;
        this.color = color;
        this.dir = dir;
    }
    
    toString(){
        return this.kind+this.color+this.to.i+this.to.j+this.dir
    }
    
    isSameAs(that){
        return this.color==that.color && this.kind==that.kind && this.to.i == that.to.i && this.to.j == that.to.j;
    }
}