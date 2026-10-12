import {svg,makePoints,translate,rotate,cText,translateSVG_rel,translateSVG,getPos,svg_drag} from "../SVGtools.js"
import {Display,message,d} from "../Display.js"
import {M,N,ij2letter} from "./FlipIt_Board.js";
export {FlipIt_Display}

class FlipIt_Display extends Display {
    
    makeDefs($defs){
        function ellipse(rx,ry,cx,cy,fill="#40826D"){
            return svg("ellipse",{cx:cx,cy:cy,rx:rx,ry:ry,fill:fill,
                                stroke:"black","stroke-width":0.05})
        }
        function turtle(tummy){
            return [
                ellipse(0.075,0.0375,0.25,0.25), // pattes
                ellipse(0.075,0.0375,0.75,0.25),
                ellipse(0.075,0.0375,0.25,0.75),
                ellipse(0.075,0.0375,0.75,0.75),
                ellipse(0.06,0.08,0.5,0.1), // tête
                // queue
                svg("polygon",{points:makePoints([0.45,0.85,0.55,0.85,0.5,0.95]),
                                fill:"#40826D",stroke:"black","stroke-width":0.05}),
                ellipse(0.25,0.35,0.5,0.5),// corps
                ellipse(0.15,0.25,0.5,0.5,tummy), // carapace                
            ]
        }

        super.makeDefs($defs);
        $defs.append(
            svg("g",{id:"fond-def"},
                svg("rect",{width:1,height:1, fill:"#AAFF00","stroke":"#00FF00","stroke-width":0.02}),
                svg("circle",{cx:0.5,cy:0.5,r:0.4,fill:"#90EE90", stroke:"#00FF00","stroke-width":0.05})
            ),
            svg("g",{id:"turtle-flipped",transform:rotate(30,0.5,0.5)},
                ... turtle("#40826D")
            ),
            svg("g",{id:"turtle",transform:rotate(-30,0.5,0.5)},
                 ... turtle("orange")             
            )
        )
    }
    
    makeBackground($background,grid){ 
        grid.forEach((i,j,v)=>{
            $background.append(
                svg("use",{href:"#fond-def",class:"fond",id:"f"+i+j,transform:translate(j,i)}),
                cText(ij2letter[i][j],j+0.5,i+0.5,"#DCDCDC")
            )
        })
    }
}