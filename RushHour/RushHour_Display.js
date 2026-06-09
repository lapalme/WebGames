import {svg,makePoints,translate,rotate,cText,translateSVG_rel,translateSVG,getPos} from "../SVGtools.js"
import {Display,message,d} from "../Display.js"
import {showMoves} from "./RushHour_Board.js"
import { RH_Jump } from "./RH_Jump.js";

import {C} from "../C.js"

import {M,N} from "./RushHour_Board.js";
export {RushHour_Display}

let allJumps;

class RushHour_Display extends Display {
        constructor(){
        super();
        
    }

    makeDefs($defs){
        const dims = {x:0.1,y:0.1,width:0.80,height:0.80}
        super.makeDefs($defs);
        $defs.append(
            svg("g",{id:"fond-def"},
                svg("rect",{width:1,height:1,fill:"#C0C0C0"}),
                svg("rect", Object.assign({"stroke":"#708090","stroke-width":0.02,fill:"#d3D3D3"},dims))
            ),
        )
    }
    
    makeBackground($background,grid){ 
        $background.append(
            svg("rect",{x:-0.5,y:-0.5,width:7,height:7,fill:"#C0C0C0"}),
            svg("rect",{x:-0.1,y:-0.1,width:6.2,height:6.2,rx:0.1,stroke:"blue", "stroke-width":0.1})
        );
        // draw cells
        grid.forEach((i,j,v)=>{
            $background.append(
                svg("use",{href:"#fond-def",transform:translate(j,i)},
                        svg("title",{},i+","+j))
            )})
        // draw exit
        $background.append(
            svg("use",{href:"#fond-def",transform:translate(6,2)})
        )
                
    }
        
    setBoard(board){
        this.makeBackground($("#background"),board.grid)
        $("#pieces").empty();
        allJumps = null;
        this.board = board;
        $("#svg_element").data({board:board,display:this});
        for (const piece of board.pieces){
            piece.draw();
            piece.drawing.data({piece:piece})
            piece.drawing.on("mousedown",mousedown);
            $(".arrow",piece.drawing).on("mousedown",mousedown);
            $("#pieces").append(piece.drawing)
        }
        board.checkAllArrows();
    }
    
    undo(){
        $("#bravo").remove();
        if (allJumps == null) return;
        const jump = allJumps;
        allJumps = allJumps.precedent;
        const i = jump.from.i, j=jump.from.j;
        const newTile=this.board.undo(jump);
        if (newTile!=null){
            $(".arrow",newTile.drawing).on("mousedown",mousedown);
            newTile.drawing.on("mousedown",mousedown);
        }
        const $drawing = this.board.grid.get(i,j).drawing
        translateSVG($drawing,j,i);
        this.board.checkAllArrows();

    }
}

let lastDir,lastPiece;

function mousedown(e){
    const $current = $(e.currentTarget);
    let piece,dir;
    if (!$current.hasClass("arrow")){
        piece = $current.data("piece");
        const id = piece.id;
        if ($current.data("piece")!=lastPiece){
            return;
        }
        if (!$(`#${id}${lastDir}`,$current).is(":visible")) return;
        dir = lastDir;
        piece = lastPiece;
    } else {
        e.stopPropagation()
        piece = $current.parent().data("piece");
        lastPiece = piece;
        dir = $current.attr("id").charAt(1);
        lastDir = dir;
    }
    const {board,display} = $("#svg_element").data();
    const from = new C(piece.i,piece.j)
    let to;
    if (piece.isHoriz) 
        to = new C(piece.i, piece.j +(dir=="l"? -1 : 1))
    else
        to = new C(piece.i +(dir=="l"?-1:1),piece.j);
    const jump = new RH_Jump(from,to,piece.id);
    allJumps = jump.extend(allJumps);
    board.play(jump);
    if (board.isComplete()){
        jump.to.j=N;  // keep track of the removal for undo
        board.removeGoal(piece);
        display.showBravo(allJumps,showMoves,M,N)
    }
    board.checkAllArrows();
}