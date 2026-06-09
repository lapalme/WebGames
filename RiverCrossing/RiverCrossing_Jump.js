import { svg,translate,rotate } from "../SVGtools.js";
import { Jump } from "../Jump.js"

import { letter2ij, normalizePlankId } from "./Problems.js"
export {RiverCrossing_Jump}

class RiverCrossing_Jump extends Jump{
    // this subclass is quite special because these jumps are quite special 
    // the fromPname and toPname are plank names between two stumps
    // so that we can get the right arrow, we set the coordinates corresponding to
    // the toPname
    constructor(fromPname,toPname){
        let from = letter2ij[toPname.charAt(0)];
        let to   = letter2ij[toPname.charAt(1)];
        super(from,to)
        this.fromPname = fromPname;
        this.toPname=toPname;
    }
    
    toString(){
        return this.fromPname+this.arrow()+this.toPname
    }
    
    // contains(x,y){
    //     const delta=0.2;
    //     // does this plank touches x,y
    //     // useful for checking drag and drop (but not used anymore...)
    //     if (this.from.i==this.to.i){ // horizontal
    //         if (Math.abs(y-this.from.i)>delta) return false;
    //         return this.from.j<x && x <this.to.j
    //     }
    //     // vertical
    //     if (Math.abs(x-this.from.j)>delta) return false;
    //     return  (this.from.i<y && y<this.to.i) || (this.to.i<y && y<this.from.i)
    // }

    draw(){
        const di = this.from.i-this.to.i;
        const l = di!=0 ? Math.abs(di) : Math.abs(this.from.j-this.to.j);
        const drawing = svg("use",{href:"#plank-"+l,class:"tentative",
                transform:translate(this.from.j,this.from.i)+rotate(this.rotation(),0,0)})
        $("#pieces").append(drawing);
        return drawing;
    }
}
