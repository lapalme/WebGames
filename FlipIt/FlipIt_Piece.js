import {svg,translate} from "../SVGtools.js"
import { C } from "../C.js";
import {Piece} from "../Piece.js"
import {ij2letter} from "./FlipIt_Board.js"
import {Jump} from "../Jump.js"

export {FlipIt_Piece}

// relative displacement in [i,j] for all directions 
const deltaDir = {"N": [[-1,0],[-2,0],[-3,0]], "E":[[0,1],[0,2],[0,3]],
                  "S": [[1,0],[2,0],[3,0]],    "O":[[0,-1],[0,-2],[0,-3]],
                  "NE":[[-1,1],[-2,2],[-3,3]], "SE":[[1,1],[2,2],[3,3]],
                  "SO":[[1,-1],[2,-2],[3,-3]], "NO":[[-1,-1],[-2,-2],[-3,-3]]}

class FlipIt_Piece extends Piece {
    constructor (id,i,j,flipped){
        super(id,i,j);
        this.flipped=flipped;
    }
    
    toString(){
        const l = ij2letter[this.i][this.j]
        return this.flipped ? l.toLowerCase() : l;
    }
    
    toState(){
         const l = ij2letter[this.i][this.j]
        return this.flipped ? l.toLowerCase() : l;       
    }
    
    flip(){
        this.flipped = !this.flipped;
        if (this.drawing != null){
            $("use",this.drawing).attr("href",this.flipped ? "#turtle-flipped" : "#turtle")
        }
    }
    
    draw(){
        this.drawing = svg("g",{"id":this.id, transform:translate(this.j,this.i),
                                class:"turtle"},
                            svg("use",{href:this.flipped ? "#turtle-flipped" : "#turtle"}),
                            svg("title",{},ij2letter[this.i][this.j])
                        )
        return this;
    }
    
    possibleJumps(grid){
        const i=this.i,j=this.j;
        let jumps = [];
        for (const dir in deltaDir){
            const deltas = deltaDir[dir];
            for (let k=1;k<=2;k++){
                const [di,dj] = deltas[k];  
                const newI=i+di,newJ=j+dj;
                if (grid.check(newI,newJ) && grid.get(newI,newJ) == null){
                    if (k==1){
                        if (grid.get(i+deltas[0][0],j+deltas[0][1]) != null)
                            jumps.push(new Jump(new C(i,j), new C(newI,newJ)));
                    } else {
                        if (grid.get(i+deltas[0][0],j+deltas[0][1]) != null &&
                            grid.get(i+deltas[1][0],j+deltas[1][1]) != null)
                            jumps.push(new Jump(new C(i,j), new C(newI,newJ)));
                    }
                }
            }
        }
        return jumps;
    }
}