import {svg,translate,cText} from "../SVGtools.js"
import {Piece} from "../Piece.js"
import {Jump} from "../Jump.js"
import {dirs} from "./TipOver_Board.js"

export {TipOver_Piece}
const heights = {r:1,y:2,g:3,b:4}
const color = {r:"red",y:"yellow",g:"green",b:"blue"}
class TipOver_Piece extends Piece {
    constructor (id,i,j,c,tipped){
        super(id,i,j)
        this.c = c;
        this.tipped = tipped;
        this.height=heights[c];
    };
    
    toString(){
        return this.c;
    }
    
    toState(){
        return [this.id,this.i,this.j,this.tipped]
    }
    
    putInGrid(grid){
        if (this.tipped==null){
            grid.set(this.i,this.j,this)
        } else {
            const [di,dj]=dirs[this.tipped];
            for (let k=1;k<=this.height;k++)
                grid.set(this.i+k*di,this.j+k*dj,this)
        }
    }
        
    // check this crate can be tipped in direction given by l
    // and that it falls adjacent to another crate
    allowedTip(grid,l){
        const i=this.i, j=this.j,h=this.height;
        const [di,dj]=dirs[l];
        for (let k=1;k<=h;k++){
            const i1=i+k*di, j1=j+k*dj;
            if (!grid.check(i1,j1) || grid.get(i1,j1)!=null) return false;
        }
        // check that it touches another crate
        for (let k=1;k<=h;k++){
            const i1=i+k*di, j1=j+k*dj;
            for (const [di1,dj1] of Object.values(dirs)){
                const i2=i1+di1,j2=j1+dj1
                if (grid.check(i2,j2)){
                    const other=grid.get(i2,j2);
                    if (other!=null && other.id != this.id) return true
                }
            }
        }
        return false;
    }
    
    draw(){
        const d=0.2
        this.drawing = svg("g",{transform:translate(this.j,this.i)})
        if (this.tipped==null){
            this.drawing.append(
                svg("title",{},""+(this.i*6+this.j+1)),
                svg("rect",{x:d,y:d,width:1-2*d,height:1-2*d,fill:color[this.c]}),
                this.c == "r" ? null: cText(this.height,0.5,0.5,"white",0.3,)
            )
        } else {
            const [di,dj] = dirs[this.tipped]
            const h = this.height
            // dimension for the rectangle corresponding to the tipped crate
            const x = dj == 0 ? 0 : dj<0 ? dj*h : 1;
            const y = di == 0 ? 0 : di<0 ? di*h : 1;
            const width = dj==0 ? 1-2*d : h-2*d;
            const height = di==0 ? 1-2*d : h-2*d;
            this.drawing.append(
                svg("title",{},""+(this.i*6+this.j+1)+this.tipped),
                svg("rect",{x:x+d,y:y+d,width:width,height:height,
                            fill:"none",stroke:color[this.c],"stroke-width":0.2})
            )
        }
        return this.drawing;
    }
}
