import {Jump} from "../Jump.js"

export {Titanic_Jump}
class Titanic_Jump extends Jump{
    constructor(from,to,boatId,boardings=[]){
        super(from,to);
        this.dir = this.arrow();
        this.boatId = boatId;
        this.boardings = boardings;
    }
    
    toString(){
        // return super.toString()+this.dir+"["+this.boardings.map(b=>b.toString()).join(",")+"]"
        return this.boatId+this.dir+[this.boardings.map(b=>b.personId)].join()
    }
}