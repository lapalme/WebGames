import {svg,isSafari,makePoints,translate,rotate,M,L,Q,C,S,A,cText,
    translateSVG_rel,translateSVG,getPos} from "../SVGtools.js"
import {Piece} from "../Piece.js"


export {AntiVirus_Piece}

const nbPos = [2,2,3,2,2,3,3,3,3,1]
const DECS  =  [3,3,2,1,0,1,2,3];
const colors = [
    "red",       // 0
    "#66FFFF",   // 1 (aqua)
    "orange",    // 2
    "pink",      // 3
    "#008000",   // 4 (trefle)
    "blue",      // 5
    "#800080",   // 6 (prune)
    "#66FF66",   // 7 (Flore)
    "yellow",    // 8
    "white",     // 9
]


const darkPieces = new Set([4,5,6])

class AntiVirus_Piece extends Piece {
    constructor (id,i,j,otherPos,grid){
        super(id,i,j);
        this.otherPos = otherPos;
        this.color = colors[this.id];
        this.isDark = darkPieces.has(this.id);
        this.grid = grid;
        this.drawing = null;
    }
    
    toString(){
        return "P"+this.id;
    }
    
    toState(){
        return [this.id,[this.i,this.j],...this.otherPos]
    }
    
    pos(){  // return the list of positions as [i,j]
        let res = [[this.i,this.j]]
        for (let k=0;k<this.otherPos.length;k++){
            res.push([this.i+this.otherPos[k][0],this.j+this.otherPos[k][1]])
        }
        return res
    }
    
    isMovable(di,dj,pieces){
        if (this.id == 9)return null;
        if (di==null){
            return this.isMovable(-1,0) != null || this.isMovable(1,0) != null ||
                    this.isMovable(0,-1) != null || this.isMovable(0,1) != null
        }
        if (pieces==null){
            return this.isMovable(di,dj,[this])
        }
        // try to move all pieces of a group
        //   by checking that the move stay legal for all coordinates of each piece of the group
        //   null is returned when it touches a side or an immobile piece (no==9)
        //   If a move touches another piece, add it to the group
        let added = [];
        for (const piece of pieces){
            for (const [i,j] of piece.pos()){
                const i1 = i+di, j1=j+dj;
                if (!this.grid.check(i1,j1))return null;
                const piece1 = this.grid.get(i1,j1);
                if (piece1 == null) return null;
                if (piece1 != "_"){// we are sure that there is piece here
                    if(piece1.id == 9)return null;
                    if (!pieces.includes(piece1) && !added.includes(piece1))
                        added.push(piece1)
                }
            }
        }
        // we could could not move without touching other pieces, add them to the group and
        // recursively move all the group.
        if (added.length>0){
            return this.isMovable(di,dj,pieces.concat(added))
        }
        return pieces;
    }

    draw(){
        const r=0.8, r2=r/2;
        const fill = colors[this.id];
        const sw = 0.02;
        
        // draw lines between positions (width:r is they are close, r2 otherwise)
        this.drawing = svg("g",{id:"P"+this.id,"stroke":"black","stroke-width":sw, 
                                 transform:translate(this.j+1,this.i), 
                                 filter:isSafari()?"none":"url(#shadow)"}
                           )
        if (this.id < 9 ){
            let x2=this.otherPos[0][1],y2=this.otherPos[0][0];
            let sw=Math.abs(x2)+Math.abs(y2)<=1.01 ? r :r2;
            this.drawing.append(
                svg("line",{x1:0,y1:0,x2:x2,y2:y2,
                            stroke:"white","stroke-width":sw})
            )
            if (this.otherPos.length>1){
                x2=this.otherPos[1][1],y2=this.otherPos[1][0];
                sw=Math.abs(x2)+Math.abs(y2)<=1.01 ? r :r2;
                this.drawing.append(
                    svg("line",{x1:0,y1:0,x2:x2,y2:y2,
                                stroke:"white","stroke-width":sw})
                )   
            }
        }
        // draw center dot with text
        this.drawing.append(
            svg("circle",{r:r2,fill:"white",stroke:"white",cx:0,cy:0}),            
            // add colored dots
            svg("circle",{r:r2-0.1,fill:fill,cx:0,cy:0}),
            cText(this.id,0,0,this.isDark?"white":"black",0.3).attr("transform",rotate(45,0,0))
        ) 
        // draw other dots
        for (const [i,j] of this.otherPos){
            this.drawing.append(
                svg("circle",{r:r2,fill:"white",stroke:"white",cx:j,cy:i}), 
                svg("circle",{r:r2-0.1,cx:j,cy:i,fill:fill})
            )
        }
    }
}
