import {svg,makePoints,translate,rotate,cText,translateSVG_rel,translateSVG,getPos,M,L} from "../SVGtools.js"
import {Display,message,d} from "../Display.js"
import {showMoves} from "./TempleTrap_Board.js"
import { jumps2moves,dir2rot,dirInv } from "../Jump.js";

// import {M,N} from "./TempleTrap_Board.js";
export {TempleTrap_Display}

let allJumps;
const beige="wheat";
const level1="tan";
const level2="YellowGreen";
const w=0.2

class TempleTrap_Display extends Display {
        constructor(){
        super();
    }

    makeDefs($defs){
        super.makeDefs($defs);
        $defs.append(
            svg("g",{id:"straight2"},
                svg("rect",{x:0,y:0,width:w,height:1,fill:beige,stroke:"black","stroke-width":0.01}),
                svg("rect",{x:1-w,y:0,width:w,height:1,fill:beige,stroke:"black","stroke-width":0.01}),
                svg("rect",{x:w,y:0,width:1-2*w,height:1,fill:level2}),
            ),
            svg("g",{id:"straight1-2"},
                svg("rect",{x:0,y:0,width:w,height:1,fill:beige,stroke:"black","stroke-width":0.01}),
                svg("rect",{x:1-w,y:0,width:w,height:1,fill:beige,stroke:"black","stroke-width":0.01}),
                svg("rect",{x:w,y:0,width:1-2*w,height:1,fill:level1}),
                svg("rect",{x:w,y:0,width:1-2*w,height:0.3,fill:level2}),
                svg("line",{x1:w+0.05,y1:0.1,x2:1-w-0.05,y2:0.1,stroke:"white","stroke-width":0.02}),
                svg("line",{x1:w+0.05,y1:0.2,x2:1-w-0.05,y2:0.2,stroke:"white","stroke-width":0.02}),
                svg("circle",{cx:0.5,cy:0.5,r:0.075,fill:"black"}),
            ),
            svg("g",{id:"angle1"},
                svg("path",{d:M(0,0)+L(1,0)+L(1,w)+L(w,w)+L(w,1)+L(0,1)+" Z"
                            ,fill:beige,stroke:"black","stroke-width":0.01}),
                svg("rect",{x:w,y:w,width:1-w,height:1-w,fill:level1}),
                svg("circle",{cx:0.5,cy:0.5,r:0.075,fill:"black"}),
            ),
            svg("g",{id:"angle2"},
                svg("path",{d:M(0,0)+L(1,0)+L(1,w)+L(w,w)+L(w,1)+L(0,1)+" Z",fill:beige,stroke:"black","stroke-width":0.01}),
                svg("rect",{x:w,y:w,width:1-w,height:1-w,fill:level2}),
            ),
            svg("g",{id:"adventurer-def"},
                svg("circle",{cx:0.5,cy:0.5,r:0.15,stroke:"black","stroke-width":0.01,fill:"url(#gradient-1)"})),
            svg("radialGradient",{id:"gradient-1",cx:"10%", cy:"10%", r:"100%", fx:"30%", fy:"30%"},
                svg("stop",{offset:"10%","stop-color":"lightgreen"}),
                svg("stop",{offset:"95%","stop-color":"green"})
            ),

        )
    }
    
    makeBackground($background,grid){ 
        $background.append(
            svg("rect",{x:-0.25,y:-0.25,width:3.5,height:3.5,rx:0.2,fill:beige}),
            svg("rect",{x:0,y:0,width:3,height:3,fill:"DodgerBlue",stroke:"black","stroke-width":0.01}),
            svg("rect",{x:-0.25,y:w,width:0.25,height:1-2*w,fill:level2,stroke:"black","stroke-width":0.01})
        )
        grid.forEach((i,j,_)=>{
            $background.append(
                svg("circle",{cx:j+0.5,cy:i+0.5,r:0.075,fill:"black"})
            )   
        })
    }
    
    setBoard(board){
        $(".arrow").remove();
        this.makeBackground($("#background"),board.grid);
        $("#pieces").empty();
        allJumps = null;
        this.board = board;
        this.$svg_element.data({board:board,display:this});
        for (const piece of board.pieces){
            piece.draw()
                .data({piece:piece})
            $("#pieces").append(piece.drawing)
        }
        $("#pieces").append(
            svg("use",{href:"#adventurer-def",id:"adventurer",
                       transform:translate(board.adventurer[1],board.adventurer[0])})
        )
        this.showPossibleJumps()
    }
    
    showPossibleJumps(){
        $(".arrow").remove()
        const jumps = this.board.possibleJumps();
        for (const jump of jumps){
            let rot = jump.id=="!" ? dir2rot[dirInv[jump.path.charAt(0)]][0] : jump.rotation();
            $("#pieces").append(
                svg("use",{href:"#arrow-def",class:"arrow",stroke:jump.id=="!"?"green":"black",
                            transform:translate(jump.from.j,jump.from.i)+
                            rotate(rot,0.5,0.5)})
                    .data({jump:jump})
                    .on("pointerdown",pointerdown)
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
        this.showPossibleJumps();
    }
}

function pointerdown(e){
    $("#bravo").remove()
    const $current = $(e.currentTarget);
    const $svg_element = $("#svg_element");
    let {board,display} = $svg_element.data();
    
    const {jump} = $current.data();
    board.play(jump);
    allJumps = jump.extend(allJumps);
    if (board.isComplete()){
        display.showBravo(allJumps,showMoves,3,3)
    } else {
        display.showPossibleJumps()
    }  
}
