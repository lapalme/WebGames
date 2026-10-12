import {svg,makePoints,translate,rotate,cText,translateSVG_rel,translateSVG,getPos} from "../SVGtools.js"
import {Display,message,d} from "../Display.js"
import {showMoves} from "./LunarLockout_Board.js"
import { jumps2moves } from "../Jump.js";

export {LunarLockout_Display}

let allJumps;

class LunarLockout_Display extends Display {
        constructor(){
        super();
    }

    makeDefs($defs){
        super.makeDefs($defs);
        $defs.append(
            svg("rect",{id:"case-def",x:0,y:0,width:1,height:1,fill:"lightgray",
                        stroke:"black","stroke-width":0.05}),
            svg("circle",{id:"target",cx:0.5,cy:0.5,r:0.3, fill:"red"}),
            svg("rect",{id:"piece-def",x:0.1,y:0.1,width:0.8,height:0.8,rx:0.1})
        )
    }
    
    makeBackground($background,grid){ 
        $background.empty()
        $background.append(
            svg("rect",{x:-0.25,y:-0.25,width:5.5,height:5.5,rx:0.05,fill:"slategray"}),
        )
        grid.forEach((i,j,_)=>
            $background.append(svg("use",{href:"#case-def",transform:translate(j,i)}))
        )
        $background.append(
            svg("use",{href:"#target",transform:translate(2,2)})
        )
    }
    
    showPossibles(grid){
        const possibles = super.showPossibles(grid)
        $("#impasse").remove()
        if (possibles.length==0){
            if (!this.board.isComplete())
                $("#svg_element").append(
                    cText("Impasse",2.5,2.5,"white",1).attr("id","impasse")
                )
        }
    }
}
