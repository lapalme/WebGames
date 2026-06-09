import {svg,makePoints,translate,rotate,cText,translateSVG_rel,translateSVG,getPos,M as MV,L,Q} from "../SVGtools.js"
import {Display,message,d} from "../Display.js"
import {showMoves,isHole} from "./JumpIn_Board.js"
import { jumps2moves,dir2rot,dirInv } from "../Jump.js";

import {M,N} from "./JumpIn_Board.js";
export {JumpIn_Display}

let allJumps;
const radian = Math.PI/180

class JumpIn_Display extends Display {
        constructor(){
        super();
    }

    makeDefs($defs){
        // start the North arrow in the center of the unit square
        const arrow_d = MV(0.5,0.4)+L(0.5,0.1)+MV(0.40,0.20)+L(0.5,0.1)+L(0.60,0.20)
        super.makeDefs($defs);
        let dotPos=[];
        for (let angle=30;angle<360;angle+=60)
            dotPos.push([0.5+0.25*Math.cos(angle*radian),
                         0.5+0.25*Math.sin(angle*radian)]);
        const foxRight = [0.8,0.5, 0.65,0.6, 0.7,0.7, 0.65,0.8, 
                          0.75,1.25, 0.6,1.4, 0.5,1.7];
        let foxLeft =[]
        for (let k=foxRight.length-2;k>=0;k-=2){
            foxLeft.push([1.0-foxRight[k],foxRight[k+1]])
        }
        $defs.append(
            svg("g",{id:"rabbit"},
                 svg("circle",{cx:0.5,cy:0.6,r:0.3}),
                 svg("ellipse",{cx:0.8,cy:0.5,rx:0.2,ry:0.1,transform:rotate(-60,0.5,0.5)}),
                 svg("ellipse",{cx:0.8,cy:0.5,rx:0.2,ry:0.1,transform:rotate(-120,0.5,0.5)}),
                 svg("circle",{cx:0.4,cy:0.6,r:0.05,fill:"black"}),
                 svg("circle",{cx:0.6,cy:0.6,r:0.05,fill:"black"}),
                 svg("circle",{cx:0.5,cy:0.7,r:0.02,fill:"black"}),
                 svg("path",{d:MV(0.4,0.75)+Q(0.5,0.9, 0.6,0.75),fill:"none",stroke:"black","stroke-width":0.02})
            ),
            svg("g",{id:"black-rabbit"},
                 svg("circle",{cx:0.5,cy:0.6,r:0.3,stroke:"white","stroke-width":0.01}),
                 svg("ellipse",{cx:0.8,cy:0.5,rx:0.2,ry:0.1,transform:rotate(-60,0.5,0.5)}),
                 svg("ellipse",{cx:0.8,cy:0.5,rx:0.2,ry:0.1,transform:rotate(-120,0.5,0.5)}),
                 svg("circle",{cx:0.4,cy:0.6,r:0.05,fill:"white"}),
                 svg("circle",{cx:0.6,cy:0.6,r:0.05,fill:"white"}),
                 svg("circle",{cx:0.5,cy:0.7,r:0.02,fill:"white"}),
                 svg("path",{d:MV(0.4,0.75)+Q(0.5,0.9, 0.6,0.75),fill:"none",stroke:"white","stroke-width":0.02})
            ),            
            svg("g",{id:"fox"},
                 svg("ellipse",{cx:0.5,cy:1.6,rx:0.2,ry:0.4,fill:"white"}),
                 svg("polygon",{points:makePoints([0.5,0.05].concat(foxRight,foxLeft)),fill:"chocolate",stroke:"chocolate",
                                 "stroke-width":0.05,"stroke-linecap":"round"}),
                 svg("circle",{cx:0.4,cy:0.4,r:0.05,fill:"black"}), // eyes
                 svg("circle",{cx:0.6,cy:0.4,r:0.05,fill:"black"}),
                 svg("circle",{cx:0.5,cy:0.08,r:0.05,fill:"black"}),// nose
                 svg("line",{x1:0.35,y1:0.6,x2:0.65,y2:0.6,stroke:"white",
                              "stroke-width":0.05,"stroke-linecap":"round"})
            ),
            svg("g",{id:"mushroom"},
                 svg("circle",{cx:0.5,cy:0.5,r:0.4,fill:"red"}),
                 svg("circle",{cx:0.5,cy:0.5,r:0.1,fill:"white"}),
                 ...dotPos.map(([x,y])=>svg("circle",{cx:x,cy:y,r:0.1,fill:"white"}))
            ),
        )
    }
    
    makeBackground($background,grid){ 
        $background.append(
            svg("rect",{x:-0.25,y:-0.25,width:5.5,height:5.5,rx:0.25,
                         fill:"#36ad36",stroke:"black","stroke-width":0.05}),
            svg("rect",{x:0,y:0,width:5,height:5,rx:0.1,fill:"none",
                         stroke:"yellowgreen","stroke-width":0.02})
        )
        grid.forEach((i,j,v)=>{
            if (isHole(i,j))
                $background.append(
                    svg("rect",{x:j,y:i,width:1,height:1,rx:0.1,fill:"#36ad36",stroke:"yellowgreen","stroke-width":0.02})
                )
            $background.append(
                svg("circle",{cx:j+0.5,cy:i+0.5,r:0.4,
                fill:isHole(i,j) ? "#0F0F0F" : "darkgreen"})
            )
        })
    }
    
    setBoard(board){
        this.makeBackground($("#background"),board.grid)
        $("#pieces").empty();
        allJumps = null;
        this.board = board;
        this.$svg_element.data({board:board,display:this});
        for (const piece of board.pieces){
            piece.draw()
                .data({piece:piece})
            $("#pieces").append(piece.drawing);
        }
        board.possibleJumps()
    }
    
    showPossible(jumps){
        $("#bravo,.arrow").remove();
        for (const jump of jumps){
            $("#svg_element").append(
                svg("use",{href:"#arrow-def",class:"arrow",stroke:"blue",
                    transform:translate(jump.from.j,jump.from.i)
                    +rotate(dir2rot[dirInv[jump.arrow()]][0],0.5,0.5)})
                .data("jump",jump)
                .on("click",click)
            )
        }       
    }
    
    undo(){
        if (allJumps == null) return;
        $("#bravo,.arrow").remove();
        const jump = allJumps;
        allJumps = allJumps.precedent;
        const i = jump.from.i, j=jump.from.j;
        this.board.undo(jump);
        const $drawing = this.board.grid.get(i,j).drawing
        translateSVG($drawing,j,i);
        this.board.possibleJumps();        
    }

}

function click(e){
    $("#bravo").remove()
    const $current = $(e.currentTarget);
    const $svg_element = $("#svg_element");
    let {board,display} = $svg_element.data();
    const jump = $current.data("jump")
    board.play(jump);
    allJumps = jump.extend(allJumps);
    if (board.isComplete()){
        $(".arrow").remove()
        display.showBravo(allJumps,showMoves,M,N)
    } else {
        board.possibleJumps();
    }        
}
