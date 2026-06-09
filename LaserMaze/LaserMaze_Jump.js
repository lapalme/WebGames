import {Jump} from "../Jump.js"
export {LaserMaze_Jump}

class LaserMaze_Jump extends Jump {
    constructor(from,to,id,newOri){
        super(from,to)
        this.id=id;
        this.newOri=newOri;
    }
    
    toString(){
        return this.id+this.to.i+this.to.j+this.newOri
    }
}