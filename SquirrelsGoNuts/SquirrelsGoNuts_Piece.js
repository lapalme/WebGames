import {svg,translate,rotate,makePoints,M,L,cText} from "../SVGtools.js"
import {positions} from "./Problems.js"
import { holePositions } from "./SquirrelsGoNuts_Board.js"
import {Piece} from "../Piece.js"
import { allDirs,dir2rot,dirInv } from "../Jump.js"
import {SquirrelsGoNuts_Jump} from "./SquirrelsGoNuts_Jump.js"


export {SquirrelsGoNuts_Piece}

// adapted from https://stackoverflow.com/questions/5737975/circle-drawing-with-svgs-arc-path
// for SVG create a circle with two arcs to embed in a path
// used to create a "hole" in the piece...
function circleWithArc(cx,cy,r){
    return `M ${cx},${cy} m ${r},0 a ${r},${r} 0 1,0 -${r*2},0 a ${r},${r} 0 1,0  ${r*2},0`
}

const tileGreen="limeGreen";

const squirrelColor = {"G":"silver",
                       "R":"lightPink",
                       "Y":"gold",
                       "B":"dimGray"}

class SquirrelsGoNuts_Piece extends Piece {
    constructor (id,i,j,dir,hasNut){
        super(id,i,j)
        this.dir = dir;
        this.hasNut = hasNut;
        if (id !="F"){
            this.myPos = [[0,0],...positions[id][dir]]
        }
    }
    
    toString(){
        return (this.hasNut?this.id:this.id.toLowerCase())+this.dir+this.i+this.j;
    }
    
    toState(){
        return [this.id,this.i,this.j,this.dir,this.hasNut]
    }
        
    newPos(di,dj){
        const [newI,newJ] = [this.i+di,this.j+dj]
        return this.myPos.map(([di1,dj1])=>[newI+di1,newJ+dj1]);
    }
    
    possibleJumps(grid){
        let temp = grid.copy()
        let jumps = []
        for (const [di,dj] of this.myPos)
            temp.set(this.i+di,this.j+dj,null); // clear current pos
        // check that the piece can be moved in one or more directions
        for (const dir of allDirs){
            const [_,di,dj]=dir2rot[dirInv[dir]];
            if (this.newPos(di,dj).every(([i,j])=>temp.isNull(i,j))){
                jumps.push(new SquirrelsGoNuts_Jump(this,this.i+di,this.j+dj,false))
            }
        }
        return jumps;
    }
    
    play(grid,di,dj){
        for (const [di,dj] of this.myPos)
            grid.set(this.i+di,this.j+dj,null); // clear current pos
        this.i+=di;
        this.j+=dj;
        for (const [di,dj] of this.myPos)
            grid.set(this.i+di,this.j+dj,this); // move to new pos
    }
    
    draw(){
        const d=0.03  // inset of pieces 
        const rot = dir2rot[dirInv[this.dir]][0]
        this.drawing = svg("g",{id:this.id,
                                 transform:translate(this.j,this.i)+rotate(rot,0.5,0.5),
                                 fill:tileGreen,"fill-rule":"evenodd",
                                  stroke:"yellow","stroke-width":0.03,"stroke-linejoin":"round"})
        switch (this.id) {
            case "F":
                this.drawing.append(
                    svg("rect",{x:0+d,y:0+d,width:1-2*d,height:1-2*d}),
                    svg("use",{href:"#flower",fill:"red",transform:translate(0.5,0.5)})
                )
                break;
            case "R": case "G" :
                this.drawing.append(
                    svg("path",{d:M(0+d,0+d)+L(1-d,0+d)+L(1-d,2-d)+L(0+d,2-d)+L(0+d,0+d)+
                                circleWithArc(0.5+d,0.5+d,0.25)}),
                    this.hasNut ? svg("use",{href:"#nut",class:"nut"}): null,
                    svg("use",{href:"#squirrel",fill:squirrelColor[this.id]})
                )
                break;
            case "Y":
                this.drawing.append(
                    svg("path",{d:M(0+d,0+d)+L(2-d,0+d)+L(2-d,1-d)+L(1-d,1-d)+L(1-d,2-d)+L(0+d,2-d)+L(0+d,0+d)+
                                    circleWithArc(0.5,0.5,0.25)}),
                    this.hasNut ? svg("use",{href:"#nut",class:"nut"}): null,
                    svg("use",{href:"#squirrel",fill:squirrelColor[this.id]}),
                    svg("use",{href:"#flower",fill:"yellow",transform: translate(1.6,0.4)})
                )
                break;
            case "B":
                this.drawing.append(
                    svg("path",{d:M(0+d,0+d)+L(1-d,0+d)+L(1-d,1+d)+L(2-d,1+d)+L(2-d,2-d)+L(0+d,2-d)+L(0+d,0+d)+
                                   circleWithArc(0.5,0.5,0.25)}),
                    this.hasNut ? svg("use",{href:"#nut",class:"nut"}): null,
                    svg("use",{href:"#squirrel",fill:squirrelColor[this.id]}),
                    svg("use",{href:"#flower",fill:"blue",transform: translate(1,1.6)}),
                    svg("use",{href:"#flower",fill:"pink",transform: translate(1.6,1.4)})
                )        
            default:
                break;
        }
        if (this.id !="F") 
            this.drawing.append(cText(this.id,0.15,1.85,"black",0.15).attr("transform",rotate(-rot,0.15,1.85)))
    }
}
