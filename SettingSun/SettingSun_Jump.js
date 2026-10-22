import { Jump } from "../Jump.js"
import { translateSVG } from "../SVGtools.js"

export {SettingSun_Jump}

class SettingSun_Jump extends Jump{
    constructor(from,to,piece){
        super(from,to)
        this.piece = piece
    }
    
    toString(){
        return this.piece.id+this.arrow()
    }
    
    moveToString(){
        return this.arrow()
    }
    
    showArrow(){
        // show arrow at the center of the piece
        const arrowSVG=super.showArrow()
        const {x,y,width,height} = this.piece.drawing[0].getBBox()
        // arrow are shown at 0.5,0.5 
        translateSVG(arrowSVG,this.piece.j-0.5+x+width/2,this.piece.i-0.5+y+height/2)
        return arrowSVG
    }
}
