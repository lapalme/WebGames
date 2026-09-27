import { Jump } from "../Jump.js"
import { isExit } from "./ExpressCourier_Board.js"

export {ExpressCourier_Jump}

class ExpressCourier_Jump extends Jump{
    constructor(from,to,piece_color,cargoMove){
        super(from,to)
        this.piece_color=piece_color
        this.cargoMove=cargoMove
    }
    
    toString(){
        const dir = this.arrow()
        const res = this.piece_color+dir
        if (this.cargoMove)
            return "*"+res
        if (isExit(this.to.i,this.to.j,dir))
            return "!"+res;
        return res
    }
}
