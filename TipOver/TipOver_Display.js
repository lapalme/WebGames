import {svg,translate,rotate,cText,translateSVG} from "../SVGtools.js"
import {Display,message,d} from "../Display.js"
import {showMoves} from "./TipOver_Board.js"
import { jumps2moves } from "../Jump.js";

export {TipOver_Display}

let allJumps;

class TipOver_Display extends Display {
        constructor(){
        super();
    }

    // makeDefs($defs){
    //     super.makeDefs($defs);
    // }
    
    makeBackground($background,grid){ 
        $background.append(
            svg("rect",{x:-0.25,y:-0.25,width:6.5,height:6.5,rx:0.2,fill:"darkgray"}),
            svg("rect",{x:0,y:0,width:6,height:6,fill:"lightgray"})
        )
        grid.forEach((i,j,_)=>{
            $background.append(
                svg("rect",{x:j+0.1,y:i+0.1,width:0.8,height:0.8,fill:"none",
                            stroke:"gray","stroke-width":0.05}),
                cText(i*6+j+1,j+0.5,i+0.5,"black",0.15)
            )   
        })
    }
    
    setBoard(board){
        this.makeBackground($("#background"),board.grid);
        $("#pieces").empty();
        $(".arrow").remove();
        allJumps = null;
        this.board = board;
        this.$svg_element.data({board:board,display:this});
        for (const piece of board.pieces){
            $("#pieces").append(piece.draw())
        }
        $("#pieces").append(
            svg("rect",{x:0.2,y:0.2,height:0.6,width:0.6,
                        transform:translate(board.tipper[1],board.tipper[0]),
                        fill:"none",stroke:"salmon","stroke-width":0.15,id:"tipper"})
        )
        this.showPossibles(board.possibleJumps())
        if(!($._data($("body")[0],'events'))){ // avoid add more than one key listener
            $("body").on("keydown",processKeydown);
            $("body").on("keyup",processKeyup);           
        }
    }
    
    showPossibles(jumps){
        $(".arrow").remove()
        const [i,j] = this.board.tipper;
        const crate = this.board.grid.get(i,j);
        for (const jump of jumps){
            $("#pieces").append(
                svg("use",{href:"#arrow-def",class:"arrow",stroke:jump.tipping?"deeppink":"black",
                           transform:translate(j,i)+rotate(jump.rotation(),0.5,0.5)}
                    )
                .data("jump",jump)
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
        this.showPossibles(this.board.possibleJumps());
    }
}

function pointerdown(e){
    $("#bravo").remove()
    const $current = $(e.currentTarget);
    const $svg_element = $("#svg_element");
    let {board,display} = $svg_element.data();
    const jump = $current.data("jump");
    board.play(jump);
    allJumps = jump.extend(allJumps)
    if (board.isComplete()){
        $(".arrow").remove();
        display.showBravo(allJumps,showMoves,6,6);
    } else {
        display.showPossibles(board.possibleJumps())
    }
}

let arrowFollowed;
  // HACK: as Keydown must be used to deal with arrow keys 
//       This can give rise to many events in a row
//       This the role of arrowFollowed when "finally" keyUp is detected
function processKeydown(e){
    if (e.which == 90 && (e.ctrlKey || e.metaKey)){ // control-Z ou cmd-Z
        $("#undo").trigger("pointerdown")
        e.preventDefault();
        return
    }
    if (arrowFollowed) return;
    // const keyCode2arrow = {37:"←",38:"↑",39:"→",40:"↓"};
    const keyCode2arrow = {37:"L",38:"U",39:"R",40:"D"};
    const arrow = keyCode2arrow[e.which];
    if (arrow == undefined) return;
    $(".arrow").each(function(idx){
        if ($(this).data("jump").l==arrow){
            arrowFollowed=true;
            $(this).trigger("pointerdown")
            return false;
        }
        return true;
    })
    arrowFollowed=true;
    e.preventDefault(); // prevent the default action (scroll / move caret)
}

function processKeyup(e){
    arrowFollowed=false;
}