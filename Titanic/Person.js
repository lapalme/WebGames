import {svg,isSafari,translate,rotate,cText} from "../SVGtools.js"
import { C } from "../C.js";
import {Piece} from "../Piece.js"
import {Jump} from "../Jump.js"

export {Person}
const personColor={"A":"#008040","B":"#66FF66","C":"#FFFF33","D":"#FF0000","E":"#FF0080","F":"#800080","G":"#004080"}

class Person extends Piece {
    constructor (id,i,j){
        super(id,i,j)
        this.boat = null;
    }
    
    toString(){
        return this.id
    }
    
    toState(){
        return JSON.stringify({id:this.id,i:this.i,j:this.j,
                               boat:this.boat==null?null:this.boat.id})
    }
    
    
    static fromState(json){
        json = JSON.parse(json);
        const p =new Person(json.id,json.i,json.j);
        if (json.boat!=null)p.boat=json.boat.id;
        return p;
    }
    
    draw(){
        const id=this.id,i=this.i,j=this.j;
        return svg("g",{id:"p"+id,transform:translate(j,i),filter:isSafari()?"none":"url(#shadow)"},
            svg("title",{},i+','+j),
            // in-line définition to allow modification of the stroke-width with CSS
            // svg("use",{href:"#N",fill:colorNaugrage[id]}),
            svg("circle",{cx:0.5,cy:0.5,r:0.3,class:"plain",fill:personColor[id] }),
            cText(id.toUpperCase(),0.5,0.5,"white",0.3)
        )
    }
}
