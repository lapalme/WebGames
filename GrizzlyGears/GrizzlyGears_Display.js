import {svg,makePoints,translate,rotate,cText,translateSVG_rel,
        translateSVG,getPos,M,A,L} from "../SVGtools.js"
import {Display,message,d} from "../Display.js"
import {showMoves} from "./GrizzlyGears_Board.js"
import { jumps2moves } from "../Jump.js";

export {GrizzlyGears_Display}

let allJumps;

// radius of a circle centered at 0.5,0.5 and touching the corners of a unit square
// only three decimals to make the code more readable
// This is used for the multiple A commands of SVG path
const r = Math.trunc(Math.sqrt(0.5)*1000)/1000

const strokeC = {stroke:"black","stroke-width":0.05}
const strokeG = {stroke:"black","stroke-width":0.01}
// stroke for the shape of gears
const strokeA = {stroke:"#1f1f1f","stroke-width":0.05,"stroke-linejoin":"round"}
const strokeB = {stroke:"gray","stroke-width":0.05,"stroke-linejoin":"round"}
// stroke for arrow
const stroke_arrow = {stroke:"white","stroke-width":0.08,
                      "stroke-linecap":"round"}

const half_circle_up_d   = M(0.2,0.5)+A(0.3,0.3,0,0,1,0.8,0.5);
const half_circle_down_d = M(0.2,0.5)+A(0.3,0.3,0,0,0,0.8,0.5);
const right_circled_arrow_d= half_circle_up_d+L(0.9,0.3)
const left_circled_arrow_d = half_circle_down_d+L(0.9,0.7)

// trick to draw a partial arc...
//    adapted from https://codepen.io/mjurczyk/pen/wvBKOvP 
// generate attributes for showing only a part of an arc
function partialArc(radius,strokeOffset,angle){
    const circumference = 2*Math.PI*radius
    const strokeDasharray = (angle / 360) * circumference;
    return {"stroke-dasharray": strokeDasharray+" "+(circumference - strokeDasharray),
            "stroke-dashoffset":strokeOffset}
} 
 
const colors = {
    "A": "pink",  // girl
    "B": "orange", // beaver
    "C": "lightskyblue",  // lumberjack
    "D": "tan",   // goat
    "E": "brown", // bear
    "F": "silver"  // hare
}
const targets = [[-1,0,"A"],[-1,1,"B"],[-1,2,"C"],
                 [3.5,0,"D"],[3.5,1,"E"],[3.5,2,"F"]]

class GrizzlyGears_Display extends Display {
        constructor(){
        super();
    }

    makeDefs($defs){
        let ptsG = [[0,0],[1,0],[1,1],[0,1]]
        // g : M 0,0  A 0.707,0.707 0 0 0 1,0 A 0.707,0.707 0 0 1 1,1 A 0.707,0.707 0 0 0 0,1 A 0.707,0.707 0 0 1 0,0
        let ptsH = [[0,0],[1,0],[0,1]]
        // H : M 0,0 A 0.707,0.707 0,0,0 1,0 A 0.707,0.707 0,0,1 0,1 A 0.707,0.707 0,0,0 0,0
        let ptsP = [[1,0],[0,0]]
        // boat : M 0,0 A 0.707,0.707 0 0 0 1,0 A 0.707,0.707 0 0 0 0,0  
        function makePiece(pts){
            let path="M"+pts[0].toString()+" "
            for (let k=1;k<pts.length+1;k++)
                path+=A(r,r,0,0,k%2==0?1:0,pts[k%pts.length][0],pts[k%pts.length][1])
            return path 
        }
        super.makeDefs($defs);
        $defs.append(
            svg("g",{id:"G"},
                svg("path",{d:makePiece(ptsG),fill:"mediumseagreen",...strokeA}),
                svg("circle",{cx:0.5,cy:0.5,r:0.225,fill:"darkgreen"})
            ),
            svg("g",{id:"H"},
                svg("path",{d:makePiece(ptsH),fill:"mediumseagreen",...strokeA}),
                svg("circle",{cx:0.5,cy:0.5,r:0.275,fill:"darkgreen"})
            ),
            svg("g",{id:"boat"},
                svg("path",{d:M(0,0)+A(r,r,0,0,0,1,0)+A(r,r,0,0,0,0,0),
                            ...strokeA})
            ),
            svg("rect",{id:"target",x:0,y:0.2,width:0.5,height:0.6,rx:0.1}),
            // arrows
            // curved arrow shown as an arc that is then drawn only on specific length 
            svg("g",{id:"clockwise-turn-def"},
                svg("path",{d: right_circled_arrow_d,
                    fill:"transparent",
                    ...stroke_arrow, "stroke-opacity":0.75,
                    ...partialArc(0.3,30,120)
                }),
                svg("line",{x1:0.78,y1:0.37,x2:0.6,y2:0.35,
                    ...stroke_arrow
                }),
                svg("line",{x1:0.78,y1:0.37,x2:0.78,y2:0.2,
                    ...stroke_arrow
                }),            
            ),
            // mirror image and translate of the preceding def
            svg("g",{id:"anticlockwise-turn-def"},
                svg("use",{href:"#clockwise-turn-def",transform:"translate(0,1) scale(1,-1)"})
            )
        )
    }
    
    makeBackground($background,grid){ 
        $background.append(
            svg("rect",{x:-1.2,y:-0.5,width:5.4,height:4,rx:0.2,fill:"lightgray",
                        stroke:"green","stroke-width":0.1})
        )
        // background circles
        for (let i=0;i<3;i++)
            for (let j=0;j<3;j++)
                $background.append(
                    svg("circle",{cx:j+0.5,cy:i+0.5,r:r,fill:"gray",
                                  ...strokeB
                                  })
                )
                        
        $background.append(
            ...targets.map(([x,y,id])=>
                svg("g",{id:id,transform:translate(x,y),},
                    svg("use",{href:"#target",fill:colors[id],stroke:"black","stroke-width":id=="E"?0.05:0.01}),
                    cText(id,0.25,0.5,"black",0.3)
                ))
            )
        // add numbers over everything (i.e after pieces) so that they are not affected by rotations
        $("#svg_element").append(svg("g",{id:"piece_numbers"}))
        const pn = $("#piece_numbers");
        for (let i=0;i<3;i++)
            for (let j=0;j<3;j++)
                pn.append(cText(""+i+j,j+0.5,i+0.5,"white",0.2))
    }
    
    setBoard(board){
        this.makeBackground($("#background"),board.grid);
        $("#pieces").empty();
        $(".arrow,#bravo").remove()
        allJumps = null;
        this.board = board;
        this.$svg_element.data({board:board,display:this});
        for (const disk of board.disks){
            disk.draw()
                .data({piece:disk})
                .on("pointerdown",pointerdown);
            $("#pieces").append(disk.drawing)
        }
        for (const boat of board.boats){
            boat.draw().data({piece:boat});
            $("#pieces").append(boat.drawing);
        }
        const jumps = this.board.possibleJumps();
        this.showPossible(jumps);
    }
    
    showPossible(jumps){
        $(".arrow").remove()
        for (const jump of jumps){
            const piece = this.board.grid.get(jump.from.i,jump.from.j)
            let i,j,rot,href;
            if (jump.delta>0){
                i = piece.i; j=piece.j+0.1; rot=90;href="#clockwise-turn-def";
            } else {
                i = piece.i; j=piece.j-0.1; rot=90;href="#anticlockwise-turn-def";
            }
            $("#svg_element").append(
                svg("use",{href:href,class:"arrow",stroke:"black",
                            transform:translate(j,i)+rotate(rot,0.5,0.5),
                            }).data({jump:jump}).on("pointerdown",pointerdown)
            )
        }
    }
  
    undo(){
        $("#bravo").remove();
        if (allJumps == null) return;
        const jump = allJumps;
        allJumps = allJumps.precedent;
        const i = jump.from.i, j=jump.from.j;
        this.board.undo(jump);
        const $drawing = this.board.grid.get(i,j).drawing
        translateSVG($drawing,j,i);        
    }

}

function pointerdown(e){
    $("#bravo").remove()
    const $current = $(e.currentTarget);
    const $svg_element = $("#svg_element");
    let {board,display} = $svg_element.data();
    const jump=$current.data("jump");
    if (jump==null) return; // in some cases, the click returns a parent of the arrow for which there is no data
    board.play(jump);
    allJumps = jump.extend(allJumps);
    if (board.isComplete()){
        $(".arrow").remove()
        display.showBravo(allJumps,showMoves,3,3)
    } else {
        const jumps = board.possibleJumps();
        display.showPossible(jumps)
    }
}
