import {svg,makePoints,translate,rotate,cText,translateSVG_rel,translateSVG,getPos} from "../SVGtools.js"
import {Display} from "../Display.js"
import {showMoves} from "./SettingSun_Board.js"
import { jumps2moves } from "../Jump.js";

export {SettingSun_Display}

let allJumps;
const d=0.05
const strk={stroke:"saddlebrown","stroke-width":0.05}

class SettingSun_Display extends Display {
        constructor(){
        super();
    }

    makeDefs($defs){
        super.makeDefs($defs);
        $defs.append(
            svg("g",{id:"p4x4"},
                svg("rect",{x:d,y:d,width:2-2*d,height:2-2*d,fill:"sienna",...strk}),
                svg("circle",{cx:1,cy:1,r:0.25,fill:"red"})
            ),
            svg("g",{id:"p2x1"},
                svg("rect",{x:d,y:d,width:1-2*d,height:2-2*d,fill:"sienna",...strk}),
                svg("circle",{cx:0.5,cy:1,r:0.25,fill:"green"})
            ),
             svg("g",{id:"p1x2"},
                svg("rect",{x:d,y:d,width:2-2*d,height:1-2*d,fill:"sienna",...strk}),
                svg("circle",{cx:1,cy:0.5,r:0.25,fill:"blue"})
            ),
            svg("g",{id:"p1x1"},
                svg("rect",{x:d,y:d,width:1-2*d,height:1-2*d,fill:"sienna",...strk}),
                svg("circle",{cx:0.5,cy:0.5,r:0.25,fill:"white"})
            ),
        )
    }
    
    makeBackground(background,grid){ 
        background.append(
            svg("rect",{x:-0.25,y:-0.25,rx:0.2,width:4.5,height:5.5,fill:"maroon",...strk}),
            svg("rect",{x:0,y:0,width:4,height:5,fill:"none",...strk}),
            svg("rect",{x:1+d,y:5-d,width:2-2*d,height:0.25+d,fill:"sienna"})
        )
    }
}
