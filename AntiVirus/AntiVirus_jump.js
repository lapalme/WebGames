import {Jump,dirInv} from "../Jump.js"
import { Piece } from "../Piece.js"
import { translateSVG_rel } from "../SVGtools.js"

export {AntiVirus_Jump}
class AntiVirus_Jump extends Jump {
    constructor(from,to,ps){
        super(from,to)
        this.ps = ps[0] instanceof Piece ? ps.map(p=>p.id) : ps
    }
    
    toString(){
        return this.ps.join()+this.arrow();
    }
    
    moveToString(){
        return this.arrow()
    }
    
    // HACK: shift arrow for an "unknown" reason...
    showArrow(stroke){
        const svg = super.showArrow(stroke)
        return translateSVG_rel(svg,0.5,-0.5)
    }


    
    // specialised arrow for AntiVirus
    arrow(){
        const [di,dj] = this.direction()
        return (di==0?(dj<0?"↙":"↗"):di<0?"↖":"↘")
    } 
}