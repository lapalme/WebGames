import { Jump } from "../Jump.js"

export {TipOver_Jump}

class TipOver_Jump extends Jump{
    constructor(from,to,l,c,tipping){
        super(from,to);
        this.l = l;  // letter: U(p),D(own),L(eft),R(ight) or null
        this.c = c;  // color
        this.tipping = tipping
    }
    
    toString(){
        return this.c+this.from.i+this.from.j+this.l
    }
    
    ij2number(){
        // notation used on the game cards
        return ((this.from.i)*6+(this.from.j+1))+this.l        
    }
}
