import {svg,makePoints,translate,rotate,cText,translateSVG_rel,translateSVG,getPos} from "../SVGtools.js"
import {Display,message,d} from "../Display.js"
import {showMoves} from "./ToadsNFrogs_Board.js"
import { jumps2moves } from "../Jump.js";

// import {M,N} from "./ToadsNFrogs_Board.js";
export {ToadsNFrogs_Display}

let allJumps;

class ToadsNFrogs_Display extends Display {
        constructor(){
        super();
    }

    makeDefs($defs){
        super.makeDefs($defs);
        $defs.append(
            svg("rect",{id:"case",x:0,y:0,width:1,height:1,fill:"white",
                        stroke:"black","stroke-width":0.005}),
            svg("image",{id:"toad",href:"Toad.jpg",x:0.1,y:0.1,width:0.8,height:0.8}),
            svg("image",{id:"frog",href:"Frog.jpg",x:0.1,y:0.1,width:0.8,height:0.8}),
        )
    }
    
    makeBackground($background,grid){
        for (let k=0;k<grid.N;k++){ 
            $background.append(svg("use",{href:"#case",x:k,y:0}),
                               cText(""+k,k+0.5,0.95,"black",0.1))
        }
    }
    
    setBoard(board){
        $("#bravo,#impasse").remove();
        $("#svg_element")
            .attr("viewBox",`0 0 ${board.grid.N} 1`)
            .attr("width",board.grid.N*100)
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
        $("#bravo,#impasse").remove();
        if (allJumps == null) return;
        const jump = allJumps;
        allJumps = allJumps.precedent;
        // const i = jump.from.i, j=jump.from.j;
        this.board.undo(jump);
        // const $drawing = this.board.grid.get(i,j).drawing
        // translateSVG($drawing,j,i);        
    }

}

function pointerdown(e){
    $("#bravo,#impasse").remove()
    const $current = $(e.currentTarget);
    const $svg_element = $("#svg_element");
    let {board,display} = $svg_element.data();
    const piece = $current.data("piece")
    
    const jumps = piece.possibleJumps(board.grid)
    if (jumps.length>0){
        board.play(jumps[0]); // always a single jump is allowed
        allJumps = jumps[0].extend(allJumps)
        if (board.isComplete()){
            display.showBravo(allJumps,showMoves,1,board.grid.N)
        } else if (board.possibleJumps().length==0){
            $svg_element.append(
                cText("Impasse",board.grid.N/2,0.5,"green",0.5).attr({id:"impasse"})
            )
        }       
    }    
}
