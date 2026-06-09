import {svg,makePoints,translate,rotate,cText,translateSVG_rel,translateSVG,getPos} from "../SVGtools.js"
import {Display,message,d} from "../Display.js"
import {showMoves} from "./XXX_Board.js"
import { jumps2moves } from "../Jump.js";

// import {M,N} from "./XXX_Board.js";
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
    
    setBoard(board){
        this.makeBackground($("#background"),board.grid);
        $("#pieces").empty();
        allJumps = null;
        this.board = board;
        this.$svg_element.data({board:board,display:this});
        for (const piece of board.pieces){
            piece.draw()
                .data({piece:piece})
                .on("pointerdown",pointerdown);
            $("#pieces").append(piece.drawing)
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

    console.log("pointerdown to be implemented");
    $current.on("pointerup",pointerup);
    
    function pointerup(e){
        if (board.isComplete()){
            display.showBravo(allJumps,showMoves,nbLines,nbCols)
        }        
    }
}
