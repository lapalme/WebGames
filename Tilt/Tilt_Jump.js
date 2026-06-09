import {Jump,dir2rot} from "../Jump.js"
import { translateSVG } from "../SVGtools.js";
export {Tilt_Jump}

class Tilt_Jump extends Jump {
    constructor (dir){
        const [_,di,dj] = dir2rot[dir]
        super([0,0],[di,dj]);
        this.inHole=null;
        this.piecesPos = [];
    }
    
    getInHole(){return this.inHole}
    
    putInHole(p){
        this.inHole = p;
    }
    
    savePos(p){
         // save the current position of each piece for undo
        this.piecesPos.push([p,p.i,p.j])
    }

    resetPos(grid){
        this.piecesPos.forEach(([p,i,j]) => {
            grid.set(p.i,p.j,null);
            p.i=i;p.j=j
            grid.set(i,j,p);
            translateSVG(p.drawing,j,i)
        });
    }
}