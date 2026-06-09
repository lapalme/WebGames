import {svg,translate,rotate,cText} from "../SVGtools.js"
import {Piece} from "../Piece.js"
import {Jump} from "../Jump.js"

export {GraveYardShift_Piece}

// encoding of sides N,E,S,W of a piece : + : protruding, - : receding , | straight
const sides = {
    "A" : "+|||",
    "B" : "+--|",
    "C" : "+-||",
    "D" : "+-|-",
    "E" : "+||-",
    "F" : "+---",
    "G" : "+|--",
    "H" : "+|-|",
    "I" : "||||"
}
// build polygons of pieces
let polygons = {}
const d=0.15   // width of protrusion/recession
const gap=0.03, gap1=1-gap; // gap between tiles
let vertices = [[gap,gap],[gap1,gap],[gap1,gap1],[gap,gap1],[gap,gap]]
const sw=0.04 // stroke-width
for (const id in sides){
    let [x1,y1]=vertices[0];
    let polygon = [x1,y1];
    for (let k=0;k<4;k++){
        const [x2,y2]=vertices[k+1];
        const c = sides[id].charAt(k);
        if (c=="|") polygon.push(x2,y2)
        else if (c=="+"){ // protruding
            if (x1==x2){
                polygon.push(x1==gap?-d:1+d,(y1+y2)/2,x2,y2)
            } else { // y1==y2
                polygon.push((x1+x2)/2,y1==gap?-d:1+d,x2,y2)
            }
        } else { // receding
            if (x1==x2){
                polygon.push(x1==gap?d+gap:gap1-d,(y1+y2)/2,x2,y2)
            } else { // y1==y2
                polygon.push((x1+x2)/2,y1==gap?d+gap:gap1-d,x2,y2)
            }            
        }
        [x1,y1] = [x2,y2]
    }
    polygons[id]=polygon.join(",")    
}

const ori2shift = {"↑":0,"→":3,"↓":2,"←":1}
const didj = [[-1,0],[0,1],[1,0],[0,-1]] // deltas for n,e,s,w

class GraveYardShift_Piece extends Piece {
    constructor (id,i,j,ori){
        super(id,i,j)
        this.ori = ori;
    }
    
    toString(){
        return this.id+this.ori;
    }
    
    toState(){
        return [this.id,this.i,this.j,this.ori]
    }
    
    static fromState(state){
        //  create a piec from a state string
    }
    
    sides(ori=this.ori){
        const s=sides[this.id]
        if (ori=="↑") return s
        return (s+s).substr(ori2shift[ori],4)
    }
    
    canBeRotated(grid,ori,i,j){
        const sides = this.sides(ori);
        for (let k=0;k<4;k++){
            const side = sides.charAt(k);
            const i1 = i+1+didj[k][0],j1=j+1+didj[k][1]
            const other = grid.get(i1,j1);
            if (other!=null && other != this){
                const inv = k%2 == 0 ? 2-k : 4-k;
                const side_other = other.sides().charAt(inv)
                if (side == "|" && side_other == "+") return false;
                if (side == "+" && side_other != "-") return false;
            }
        }
        return true;
    }
        

    
    possibleJumps(grid){
        // TODO
    }
    
    draw(){
        if (this.id == "I"){
            this.drawing=svg("polygon",{points:polygons["I"],fill:"darkgray",
                                        stroke:"black","stroke-width":sw,
                                        transform:translate(this.j,this.i)})
        } else {
            this.drawing = svg("g",{id:this.id,transform:translate(this.j,this.i)+rotate(this.ori,0.5,0.5)},
                    svg("polygon",{points:polygons[this.id],fill:this.id=="A"?"deeppink":"SlateGray",
                                        stroke:"DarkSlateGray","stroke-width":sw}),
                    cText(this.id,0.5,0.5,this.id=="A"?"white":"black",0.4)
            )
        }
        return this.drawing;
    }
}
