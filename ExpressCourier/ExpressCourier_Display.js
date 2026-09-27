import {svg,makePoints,translate,rotate,cText,translateSVG_rel,translateSVG,getPos} from "../SVGtools.js"
import {Display,message,d} from "../Display.js"
import {showMoves} from "./ExpressCourier_Board.js"
import { jumps2moves } from "../Jump.js";

// import {M,N} from "./ExpressCourier_Board.js";
export {ExpressCourier_Display}

let allJumps;
const strokes = {stroke:"darkgray","stroke-width":0.05}

class ExpressCourier_Display extends Display {
        constructor(){
        super();
    }

    makeDefs($defs){
        super.makeDefs($defs);
        $defs.append(
            svg("g",{id:"truck"},
                  svg("path",{d:"M 0.1,0.2 L 0.1,1.9 L 0.9,1.9 L 0.9,0.2 Q 0.49,0, 0.1,0.2",
                              fill:"white"}),
                  svg("rect",{x:0.1,y:0.2,width:0.8,height:1.7}),
                  svg("rect",{x:0.2,y:0.3,width:0.6,height:0.3,fill:"white",opacity:25,
                              ...strokes}),
                  svg("line",{x1:0.15,y1:1,x2:0.85,y2:1,stroke:"black","stroke-width":0.025}),
                  svg("rect",{x:0.15,y:1.125,width:0.7,height:0.7,fill:"black",opacity:0.1,...strokes})
                ),
            svg("g",{id:"cargo",transform:translate(0,1)},
                svg("rect",{x:0.15,y:0.125,width:0.7,height:0.7,...strokes}),
                svg("rect",{x:0.3,y:0.275,width:0.4,height:0.4,
                            fill:"white",opacity:0.4,...strokes})),
            svg("g",{id:"exit"},
                svg("rect",{x:0,y:0.27,width:1,height:0.73,...strokes,fill:"gray"}),
                svg("use",{href:"#arrow-def",transform:translate(0,0.4),opacity:0.6}))
        )
    }
    
    makeBackground($background,grid){ 
        // add drawings for the background using info from the grid
        $background.append(
            svg("rect",{x:-0.75,y:-0.75,width:6.5,height:5.5,fill:"#2F4F4F",rx:0.2}),
            svg("rect",{x:0,y:0,width:5,height:4,fill:"gray",...strokes})
        )
        grid.forEach((i,j,v)=>{
            $background.append(
                svg("rect",{x:j,y:i,width:1,height:1,fill:"none",...strokes}))
        })
        $background.append(
            svg("use",{href:"#exit",transform:translate(2,-1)}),
            svg("use",{href:"#exit",transform:translate(5,0)+rotate(90,0,1)}),
            svg("use",{href:"#exit",transform:translate(4,3)+rotate(180,0,1)}),
            svg("use",{href:"#exit",transform:translate(1,3)+rotate(180,0,1)}),
            svg("use",{href:"#exit",transform:translate(0,3)+rotate(270,0,1)})
        )
    }
    
    pieceFromColor(color){
        return this.board.pieces.find(p=>p.color == color);
    }
    
    showPossibles(){
        $(".arrow").remove()
        const possibles = this.board.possibleJumps()
        // console.log("possibles:",possibles.join(", "))
        for (const jump of possibles){
            const rot = jump.rotation()
            if (jump.cargoMove){
                const piece = this.board.grid.get(jump.from.i,jump.from.j)
                $("#pieces").append(
                    svg("use",{href:"#arrow-def",
                               transform:translate(piece.cargoJ,piece.cargoI)+rotate(rot,0.5,0.5),
                               class:"arrow",stroke:"blue"})
                    .data({jump:jump})
                    .on("pointerdown",pointerdown)
                )                
            } else {
                const piece = this.pieceFromColor(jump.piece_color);
                $("#pieces").append(
                    svg("use",{href:"#arrow-def",
                            transform:translate(piece.j,piece.i)+rotate(rot,0.5,0.5),
                            class:"arrow",stroke:"black"})
                    .data({jump:jump})
                    .on("pointerdown",pointerdown)
                )
            }
        }
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
            $("#pieces").append(piece.drawing)
        }
        this.showPossibles()
    }
    
    undo(){
        $("#bravo").remove();
        if (allJumps == null) return;
        const jump = allJumps;
        allJumps = allJumps.precedent;
        this.board.undo(jump);
        this.showPossibles()
    }

}

function pointerdown(e){
    $("#bravo").remove()
    const $current = $(e.currentTarget);
    const $svg_element = $("#svg_element");
    let {board,display} = $svg_element.data();
    const {jump} = $current.data();
    board.play(jump)
    allJumps = jump.extend(allJumps)   
    if (board.isComplete()){
        $(".arrow").remove()
        display.showBravo(allJumps,showMoves,4,5)
    } else {
        display.showPossibles()
    }
}
