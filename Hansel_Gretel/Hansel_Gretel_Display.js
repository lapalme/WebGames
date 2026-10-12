import {svg,makePoints} from "../SVGtools.js"
import {Display,message,d} from "../Display.js"
import { hasHole } from "./Hansel_Gretel_Piece.js";

export {Hansel_Gretel_Display}

const strokes={stroke:"LightGreen","stroke-width":0.05}
const inset = 0.05

// create a list of polyline points for a spiral (used for lollipops) 
function createSpiralPoints(cx, cy, maxR, turns, totalPoints) {
  let points = [];
  let maxTheta = turns * 2 * Math.PI;
  for (let i = 0; i <= totalPoints; i++) {
    let theta = (i / totalPoints) * maxTheta;
    let r = (theta / maxTheta) * maxR;
    let x = cx + r * Math.cos(theta);
    let y = cy + r * Math.sin(theta);
    points.push(`${x.toFixed(2)},${y.toFixed(2)}`);
  }
  return points.join(' ');
}

class Hansel_Gretel_Display extends Display {
        constructor(){
        super();
    }

    makeDefs($defs){
        super.makeDefs($defs);
        $defs.append(
            svg("g",{id:"lollipop"},
                svg("rect",{x:inset,y:inset,width:1-2*inset,height:1-2*inset,fill:"LimeGreen",...strokes,rx:0.1}),
                svg("line",{x1:0.5,y1:0.5,x2:0.5,y2:0.9,stroke:"brown","stroke-width":0.1}),
                svg("ellipse",{cx:0.5,cy:0.45,rx:0.4,ry:0.35,fill:"pink"}),
                // svg("ellipse",{cx:0.5,cy:0.45,rx:0.3,ry:0.2,fill:"white"}),
                svg("polyline",{points:createSpiralPoints(0.5,0.5,0.3,2,30),
                                fill:"none",stroke:"white","stroke-width":0.07})
            ),
             svg("g",{id:"lollipop-locked"},
                svg("rect",{x:inset,y:inset,width:1-2*inset,height:1-2*inset,fill:"LimeGreen",...strokes,rx:0.1}),
                svg("ellipse",{cx:0.5,cy:0.60,rx:0.4,ry:0.35,fill:"pink"}),
                // svg("ellipse",{cx:0.5,cy:0.6,rx:0.3,ry:0.2,fill:"white"}),
                svg("polyline",{points:createSpiralPoints(0.5,0.6,0.3,2,30),
                                fill:"none",stroke:"white","stroke-width":0.07}),
                svg("text",{x:0.5,y:0.6,"dominant-baseline":"central",
                            "text-anchor":"middle","font-size":0.40},"🔒")
            ),
           
            svg("g",{id:"rect-area"},
                svg("rect",{x:inset,y:inset,width:1-2*inset,height:2-2*inset,fill:"LimeGreen",...strokes,rx:0.1}),
                ...([[0.3,0.5,0.12,"pink"],[0.6,0.3,0.15,"orange"],[0.5,1,0.25,"blue"],[0.3,1.6,0.2,"purple"],
                     [0.7,1.5,0.12,"yellow"]]
                    .map(([x,y,r,c])=>svg("circle",{cx:x,cy:y,r:r,fill:c}))
                )
            ),
            svg("g",{id:"house"},
                svg("rect",{x:inset,y:inset,width:1-2*inset,height:2-2*inset,fill:"LimeGreen",...strokes,rx:0.1}),
                svg("polygon",{points:makePoints([0.15,0.15, 0.85,0.15, 0.90,1, 0.85,1.85, 0.15,1.85, 0.10,1]),
                               fill:"red",stroke:"white","stroke-width":0.075,"stroke-linejoin":"round"}),
                svg("line",{x1:0.1,y1:1,x2:0.9,y2:1,stroke:"black","stroke-width":0.05}),
                svg("rect",{x:0.4,y:0.4,width:0.2,height:0.2,fill:"grey",stroke:"white",
                            "stroke-width":0.05,rx:0.02}),
                ...([[0.30,1,0.15,"yellow"],[0.70,1,0.15,"blue"]]
                    .map(([x,y,r,c])=>svg("circle",{cx:x,cy:y,r:r,fill:c}))
                )
            ),
            svg("g",{id:"boy"},
               svg("rect",{x:inset,y:inset,width:1-2*inset,height:1-2*inset,fill:"blue",...strokes,rx:0.1}),
                svg("text",{x:"0.5",y:"0.5","dominant-baseline":"central","text-anchor":"middle","font-size":0.70},"👦")

            ),
            svg("g",{id:"girl"},
               svg("rect",{x:inset,y:inset,width:1-2*inset,height:1-2*inset,fill:"DeepPink",...strokes,rx:0.1}), 
               svg("text",{x:"0.5",y:"0.5","dominant-baseline":"central","text-anchor":"middle","font-size":0.70},"👧")
            ),
        )
    }
    
    makeBackground($background,grid){ 
        $background.append(
            svg("rect", {x:-0.5,y:-0.5,width:5,height:5,rx:0.2,fill:"OliveDrab"}),
        )
        grid.forEach((i,j,_)=>{ // add 
            $background.append(
                svg("rect",{x:j,y:i,width:1,height:1,
                            fill:"none",stroke:"Green","stroke-width":0.15})
            )
            if (hasHole[i][j]){
                $background.append(
                    svg("circle",{cx:j+0.5,cy:i+0.5,r:0.1,fill:"DarkGreen"})
                )
            }
        })
         $background.append(// add exit
            svg("line",{x1:1,y1:4,x2:1,y2:4.5,stroke:"Green","stroke-width":0.15}),
            svg("line",{x1:2,y1:4,x2:2,y2:4.5,stroke:"Green","stroke-width":0.15})

        )
    }
    
    setBoard(board){
        this.makeBackground($("#background"),board.grid);
        $("#pieces").empty();
        // allJumps = null;
        this.allJumps = null
        this.board = board;
        this.$svg_element.data({board:board,display:this});
        for (const piece of board.pieces){
            piece.draw()
                .data({piece:piece})
            $("#pieces").append(piece.drawing);
            if (piece.kind=="l" && hasHole[piece.i][piece.j])
                piece.drawing.attr({href:"#lollipop-locked"})
        }
        this.showPossibles()
    }
}