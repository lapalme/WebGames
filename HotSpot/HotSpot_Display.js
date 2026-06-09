import {svg,makePoints,translate,rotate,cText,translateSVG_rel,translateSVG,getPos,svg_drag} from "../SVGtools.js"
import {Display,message,d} from "../Display.js"
import {showMoves} from "./HotSpot_Board.js"
import { jumps2moves } from "../Jump.js";

// import {M,N} from "./HotSpot_Board.js";
export {HotSpot_Display}

let allJumps;
const sw=0.05; // large stroke-width;

class HotSpot_Display extends Display {
        constructor(){
        super();
    }

    makeDefs($defs){
        super.makeDefs($defs);
        $defs.append(
            svg("g",{id:"green-robot"},
                svg("circle",{cx:0.5,cy:0.5,r:0.4,stroke:"black","stroke-width":sw,fill:"greenyellow"}),
                svg("circle",{cx:0.5,cy:0.5,r:0.25,stroke:"black","stroke-width":sw,fill:"none"})
                ),
            svg("g",{id:"blue-robot"},
                svg("circle",{cx:0.5,cy:0.5,r:0.5,stroke:"black","stroke-width":sw,fill:"dodgerblue"}),
                svg("circle",{cx:0.5,cy:0.5,r:0.25,stroke:"black","stroke-width":sw,fill:"none"})
                ),
            svg("g",{id:"red-robot"},
                svg("circle",{cx:0.5,cy:0.5,r:0.5,stroke:"black","stroke-width":sw,fill:"red"}),
                svg("circle",{cx:0.5,cy:0.5,r:0.25,stroke:"black","stroke-width":sw,fill:"none"})
                ),
        )
    }
    
    makeBackground($background,grid){ 
        $background.append(
            svg("rect",{x:-0.75,y:-0.75,width:5.5,height:5.5,rx:0.25,fill:"darkgray"}),
            svg("rect",{x:0,y:0,width:4,height:4,rx:0.25,fill:"royalblue"}),
            svg("circle",{cx:0.5,cy:0.5,r:0.75,fill:"royalblue"})
        )
        grid.forEach((i,j,_)=>
            $background.append(
                svg("circle",{cx:j+0.5,cy:i+0.5,r:0.3,fill:"none","stroke-width":sw,"stroke":"black"})
            ))
        $background.append(
            svg("circle",{cx:0.5,cy:0.5,r:0.5,fill:"red","stroke-width":sw,"stroke":"black"}),
            svg("circle",{cx:0.5,cy:0.5,r:0.4,fill:"none","stroke-width":sw,"stroke":"black"})

        )
    }
    
    setBoard(board){
        this.makeBackground($("#background"),board.grid);
        $("#pieces").empty();
        allJumps = null;
        this.board = board;
        this.$svg_element.data({board:board,display:this});
        for (const piece of board.pieces){
            if (piece != null){
                piece.draw()
                    .data({piece:piece})
                    .on("pointerdown",pointerdown_new);
                $("#pieces").append(piece.drawing)
            }
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

function pointerdown_new(e){
    $("#bravo").remove()
    const $current = $(e.currentTarget);
    const piece = $current.data("piece")
    const $svg_element = $("#svg_element");
    let {board,display} = $svg_element.data();
    const possibleJumps = piece.possibleJumps(board.grid)
    svg_drag($current,piece,$svg_element,getPos(e),possibleJumps.map(jmp=>[jmp.to.i,jmp.to.j]),
             (idx,newI,newJ)=>{
                board.play(possibleJumps[idx]); 
                allJumps = possibleJumps[idx].extend(allJumps);
                if (board.isComplete()){
                    display.showBravo(allJumps,showMoves,4,4)
                }
             })
}

