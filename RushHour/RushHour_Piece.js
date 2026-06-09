import {svg,isSafari,translate,rotate,makePoints,cText,rotateSVG} from "../SVGtools.js"
import {Piece} from "../Piece.js"

export {RushHour_Piece}

const tile_color = {
        "A":"rgb(38%, 84%, 67%)",
        "B":"rgb(91%, 73%, 17%)",
        "C":"rgb(17%, 52%, 95%)",
        "D":"rgb(95%, 68%, 74%)",
        "E":"rgb(51%, 33%, 82%)",
        "F":"rgb(09%, 46%, 20%)",
        "G":"rgb(33%, 33%, 33%)",
        "H":"rgb(100%, 77%, 55%)",
        "I":"rgb(100%, 91%, 34%)",
        "J":"rgb(75%, 52%, 29%)",
        "K":"rgb(49%, 51%, 36%)",
        "O":"rgb(100%, 92%, 09%)",
        "P":"rgb(97%, 73%, 100%)",
        "Q":"rgb(15%, 13%, 85%)",
        "R":"rgb(36%, 64%, 12%)",
        "X":"rgb(94%, 12%, 11%)",
        "Y":"rgb(100%, 100%, 100%)",
        "Z":"rgb(100%, 100%, 100%)",
}
const tile_length = {
        "A":2,
        "B":2,
        "C":2,
        "D":2,
        "E":2,
        "F":2,
        "G":2,
        "H":2,
        "I":2,
        "J":2,
        "K":2,
        "O":3,
        "P":3,
        "Q":3,
        "R":3,
        "X":2,
        "Y":3,
        "Z":2,    
}


class RushHour_Piece extends Piece {
    constructor (id,i,j,dir){
        super(id,i,j)
        this.dir = dir;
        this.color = tile_color[id];
        this.length = tile_length[id];
        this.isHoriz = dir=="H" || dir == "C";
        this.isGoal = dir=="C";
        this.drawing=null;
    }
    
    toString(){
        return this.id;
    }
    
    toState(){
        return this.dir+this.id+this.i+this.j;
    }
    
    draw(){
        const transform = translate(this.j,this.i)+(this.isHoriz?"":rotate(90,0.5,0.5))
        const l = this.length;
        const d = 0.03
        const w = l-2*d, h= 1-2*d;
        this.drawing = svg("g",{transform:transform,filter:isSafari()?"none":"url(#shadow)"},
            svg("rect",{x:d,y:d,width:w,height:h,rx:0.1,
                        fill:this.color,stroke:"black","stroke-width":0.02}),
            svg("polygon",{points:makePoints([l-0.2,0.2, l-0.45,d, l-0.45,1-d, l-0.2,0.8]),stroke:"black","stroke-width":0.02,fill:this.color}),
            svg("rect",{x:2*d+0.4,y:2*d,width:l-1,height:h-2*d,fill:this.color,stroke:"black","stroke-width":0.02}),
            // "de"-rotate the letter of vertical tile
            rotateSVG(cText(this.id,l/2,0.5,"white","0.4"),this.isHoriz?0:-90,l/2,0.5), 
            this.isGoal?svg("circle",{cx:l/2,cy:0.47,r:0.3,stroke:"black",
                                       "stroke-width":0.02,fill:"none"}):null,
            svg("use",{href:"#arrow-def", id:this.id+"l", class:"arrow",stroke:"black",
                        transform:translate(0,1)+rotate(-90,0,0)}),
            svg("use",{href:"#arrow-def", id:this.id+"r", class:"arrow",stroke:"black", 
                        transform:translate(l-0.1,0)+rotate(90,0,0)})
        )
        this.drawing.data("piece",this);   
    }
    
}
