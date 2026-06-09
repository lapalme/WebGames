import {svg,translate,cText,isSafari} from "../SVGtools.js"
import {Piece} from "../Piece.js"
import { HotSpot_Jump } from "./HotSpot_Jump.js"

export {HotSpot_Piece}

// relative displacement in [i,j] for all directions 
const deltaOri = {"↑": [[-1,0],[-2,0],[-3,0]], "→":[[0,1],[0,2],[0,3]],
                  "↓": [[1,0],[2,0],[3,0]],    "←":[[0,-1],[0,-2],[0,-3]]}

class HotSpot_Piece extends Piece {
    constructor (id,i,j){
        super(id,i,j)
        this.isLarge = id==0 || id>=6;
    }
    
    toString(){
        return this.id==0?"X":""+this.id;
    }
    
    toState(){
        return this.id;
    }

    touchLarge(i,j,grid){
        for (const ori in deltaOri){
            const [di,dj] = deltaOri[ori][0];
            const idi=i+di,jdj=j+dj;
            if (grid.check(idi,jdj) && !grid.isNull(idi,jdj) && grid.get(idi,jdj).isLarge)
                return true;
        }
        return false;
    }
    
    possibleJumps(grid){
        let jumps=[]
        const i=this.i,j=this.j;
        for (const ori in deltaOri){
            const deltas = deltaOri[ori];
            for (const k of [1,2]){
                const [di,dj] = deltas[k];
                const newI=i+di, newJ=j+dj;
                if (grid.check(newI,newJ) && grid.get(newI,newJ)==null){
                    const c1 = grid.get(i+deltas[0][0],j+deltas[0][1])
                    if (k==1){
                        if ( c1 != null && (!this.isLarge || !this.touchLarge(newI,newJ,grid)))
                            jumps.push(new HotSpot_Jump([i,j], [newI,newJ],this.id));
                    } else {
                        const c2 = grid.get(i+deltas[1][0],j+deltas[1][1])
                        if (c1 != null && c2 != null && (!this.isLarge || !this.touchLarge(newI,newJ,grid)))
                            jumps.push(new HotSpot_Jump([i,j], [newI,newJ],this.id));
                    } 
                }
            }
        }
        return jumps;
    }
    
    draw(){
        this.drawing = svg("g",{id:this.id,transform:translate(this.j,this.i),filter:isSafari()?"none":"url(#shadow)"},
                           svg("use",{href:`#${this.id==0?"red":this.isLarge?"blue":"green"}-robot`}),
                           cText(this.toString(),0.5,0.52,"black",0.3))
        return this.drawing;
    }
}
