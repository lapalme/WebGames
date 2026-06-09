import { Jump } from "../Jump.js"

export {CatsNBoxes_Jump}

class CatsNBoxes_Jump extends Jump{
    constructor(from,to,pid,oldOri,ori){
        super(from,to)
        this.pid= pid;
        this.oldOri = oldOri;
        this.ori = ori;
    }
    
    toString(){
        return `${this.pid}:${this.to.i},${this.to.j}${this.ori}`;
    }
}
