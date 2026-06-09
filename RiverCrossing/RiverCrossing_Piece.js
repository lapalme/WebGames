import {svg,translate,rotate,cText} from "../SVGtools.js"
import {Piece} from "../Piece.js"
import { Jump } from "../Jump.js"
import { normalizePlankId,letter2ij  } from "./Problems.js"

export {Plank,Stump}

class Plank extends Piece {
    constructor (id,from,to){
        super(id);
        this.hasHiker = false;
        this.moveAt(from,to);
    }
    
    name(){
        return normalizePlankId(this.from.id,this.to.id);
    }
    
    toString(){
        return this.toState()
    }
    
    toState(){
        return this.name()+(this.hasHiker?"*":"");
    }
        
    moveAt(from,to){
        if (from.i>to.i)[to,from]=[from,to];
        this.from = from;
        this.to = to;
        this.i = from.i // for the drawing
        this.j = from.j
        this.rotation = new Jump([from.i,from.j],[to.i,to.j]).rotation() // 
        const di = to.i - from.i
        this.length = di != 0 ? di : Math.abs(to.j - from.j)   
        from.addPlank(this);
        to.addPlank(this);
    }
    
    touches(otherPlank){ // does this plank touch another...
        return this.from==otherPlank.from || this.from == otherPlank.to ||
               this.to  ==otherPlank.from || this.to   == otherPlank.to
    }
    
        
    intersects(pName){
        // check this plank intersects another that would be named pName
        const l0= this.length;
        if (l0==1) return false;  // piece of length 1  will surely not cross
        // find coordinates of pName
        const [i1,j1] = letter2ij[pName[0]], [i2,j2]=letter2ij[pName[1]];
        let di1 = i2-i1, dj1=j2-j1, l1=Math.max(Math.abs(di1),Math.abs(dj1));
        if (l1==1) return false;  // piece of length 1  will surely not cross
        // normalize increments di[01],dj[01] to 1
        const i0=this.from.i,j0=this.from.j,di0=(this.to.i-i0)/l0,dj0=(this.to.j-j0)/l0;
        di1=di1/l1,dj1=dj1/l1; 
        // compute sets of intermediary points for each
        let s0 = new Set()
        for (let k=1;k<l0;k++)s0.add((i0+k*di0)+","+(j0+k*dj0))
        let s1 = new Set()
        for (let k=1;k<l1;k++)s1.add((i1+k*di1)+","+(j1+k*dj1))
        return s0.intersection(s1).size != 0
    }
        
    draw(){
        this.drawing = svg("g",{id:"plank"+this.id,
                transform:translate(this.j,this.i)+rotate(this.rotation,0,0)},
                svg("use",{href:`#plank-${this.length}`,class:"installed"})
        )
        if (this.hasHiker){
            this.drawing.append(
                svg("use",{href:"#hiker",class:"hiker",transform:translate(0,-this.length/2)})
            )
        }
        return this.drawing;
    }
}

class Stump extends Piece {
    constructor(id,i,j){
        super(id,i,j);
        this.planks=[]
    }
    
    toString(){
        return this.id
    }
    
    toState(){
        return this.id;
    }
    
    isOnUpperBank(){
        return "6789Z".includes(this.id)
    }
    
    addPlank(plank){
        this.planks.push(plank);
    }
    
    removePlank(plank){
        const idx = this.planks.findIndex(p=>p==plank);
        if (idx>=0) return this.planks.splice(idx,1)[0]
        else 
            debugger;
    }
    
    draw (){
        this.drawing = svg("g",{id:this.id,transform:translate(this.j,this.i)},
                svg("use",{href:"#stump"}),
                cText(this.id,0,0,"black",0.1),
                svg("title",{},this.i+","+this.j))
        return this.drawing;
    }
}


