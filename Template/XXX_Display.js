import {svg,makePoints,translate,rotate,cText,translateSVG_rel,translateSVG,getPos} from "../SVGtools.js"
import {Display,message,d} from "../Display.js"
import {showMoves} from "./XXX_Board.js"
import { jumps2moves } from "../Jump.js";

export {XXX_Display}

let allJumps;

class XXX_Display extends Display {
        constructor(){
        super();
    }

    makeDefs($defs){
        super.makeDefs($defs);
        $defs.append(
            // add other definitions
        )
    }
    
    makeBackground($background,grid){ 
        // add drawings for the background using info from the grid
    }
}
