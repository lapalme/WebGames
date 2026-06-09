import {svg,makePoints,translate,rotate,cText,translateSVG_rel,translateSVG,getPos} from "../SVGtools.js"
import {Display,message,d} from "../Display.js"
import {showMoves} from "./Tilt_Board.js"
import { Jump,jumpList,dir2rot } from "../Jump.js";
import { Tilt_Jump } from "./Tilt_Jump.js";

import {M,N} from "./Tilt_Board.js";
export {Tilt_Display}

let allJumps,board,display; // useful for mousedown...

class Tilt_Display extends Display {
        constructor(){
        super();
    }

    makeDefs($defs){
        super.makeDefs($defs);
        $defs.append(
            svg("g",{id:"G"}, // green button
                svg("circle",{r:0.45,stroke:"black","stroke-width":0.02,fill:"green"}),
                svg("circle",{r:0.3,stroke:"lightgreen","stroke-width":0.05,fill:"transparent"})
            ),
            svg("g",{id:"B"}, // blue button
                svg("circle",{r:0.45,stroke:"black","stroke-width":0.02,fill:"blue"}),
                svg("circle",{r:0.3,stroke:"aqua","stroke-width":0.05,fill:"transparent"})
            ),
            svg("g",{id:"X"}, // block
                svg("rect",{x:-0.45,y:-0.45,width:0.9,height:0.9,fill:"gray",stroke:"black","stroke-width":0.02}),
                svg("rect",{x:-0.3,y:-0.3,width:0.6,height:0.6,fill:"transparent",stroke:"lightgray","stroke-width":0.05})
            ),
            svg("circle",{id:"O",r:0.55,fill:"black"}),
            svg("g",{id:"arrow"},
                svg("rect",{x:-1,y:0.1,width:2,height:0.2,stroke:"none",fill:"transparent"}), 
                svg("polyline",{points:makePoints([-1,0.2, 0,0, 1,0.2]),
                             "fill":"transparent","stroke-width":0.12})
            ),
        )
    }
    
    makeBackground($background,grid){ 
        const rails = svg("g",{"stroke":"white","stroke-width":0.1});
        for (let i=0;i<grid.M;i++) // horizontal lines
            rails.append(svg("line",{x1:-0.5,y1:i,x2:4.5,y2:i}))
        for (let j=0;j<grid.N;j++)
            rails.append(svg("line",{x1:j,y1:-0.5,x2:j,y2:4.5}))
        $background.append(
            svg("rect",{x:-1,y:-1,width:6,height:6, rx:0.4,fill:"#DCDCDC","stroke":"black","stroke-width":0.1}),
            svg("rect",{x:-0.5,y:-0.5,width:5,height:5,fill:"#BCBCBC","stroke":"white","stroke-width":0.03}),
            rails,
            // add inverse direction arrows to the board
            svg("use",{href:"#arrow",class:"arrow",id:"up",transform:translate(2,-0.8)}).data({dir:"↓"}),
            svg("use",{href:"#arrow",class:"arrow",id:"down",transform:translate(2,4.8)+rotate(180,0,0)}).data({dir:"↑"}),
            svg("use",{href:"#arrow",class:"arrow",id:"left",transform:translate(-0.8,2)+rotate(270,0,0)}).data({dir:"→"}),
            svg("use",{href:"#arrow",class:"arrow",id:"right",transform:translate(4.8 ,2)+rotate(90,0,0)}).data({dir:"←"})            
        )
        $(".arrow").attr("stroke","#008080").on("click",click).hide()
    }
    
    setBoard(newBoard){
        this.makeBackground($("#background"),newBoard.grid)
        $("#pieces").empty();
        $("#bravo").remove();
        $(".arrow").hide();
        allJumps = null;
        board = newBoard;
        display = this;
        for (const piece of board.pieces){
            piece.draw()
            piece.drawing.data({piece:piece})
            $("#pieces").append(piece.drawing)
        }
        this.showArrows()
    }
    
    showArrows(){
        $(".arrow").hide();
        $(".arrow").each((_,a)=> {
            const {dir}=$(a).data();
            if (board.canPlay(dir))$(a).show()
        })
    }
    
    undo(){
        $("#bravo").remove();
        $(".arrow").hide();
        if (allJumps != null){
            const jump = allJumps;
            allJumps = allJumps.precedent;
            board.undo(jump);
        }
        display.showArrows();
    }

}

function click(e){
    const $current = $(e.currentTarget);
    const {dir} = $current.data();
    const jump = new Tilt_Jump(dir);
    board.play(jump);
    allJumps = jump.extend(allJumps);
    // console.log(jumpList(allJumps,[]).reverse().join(", "))
    if (board.isComplete()){
        $("use[href='#G']").remove(); // this can be useful if two green are removed at the same
        display.showBravo(allJumps,showMoves,M-1,N-1)
    } else {
        display.showArrows()
    }       
}
