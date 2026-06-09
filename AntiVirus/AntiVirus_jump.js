import {Jump,dirInv} from "../Jump.js"
import { Piece } from "../Piece.js"

export {AntiVirus_Jump}
class AntiVirus_Jump extends Jump {
    constructor(from,to,ps){
        super(from,to)
        this.ps = ps[0] instanceof Piece ? ps.map(p=>p.id) : ps
    }
    
    toString(){
        return this.ps.join()+this.arrow();
    }
    // specialised arrow for AntiVirus
    arrow(){
        const [di,dj] = this.direction()
        return (di==0?(dj<0?"↙":"↗"):di<0?"↖":"↘")
    } 
}