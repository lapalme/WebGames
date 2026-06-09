import {svg,translate,rotate,cText,translateSVG,rotateSVG,getPos,
        translateSVG_rel, getTranslateInfos,M,L,pts,isSafari} from "../SVGtools.js"
import {Display,message,d} from "../Display.js"
import {showMoves} from "./GraveYardShift_Board.js"
import { jumps2moves,nextDir,dir2rot,dirInv,allDirs } from "../Jump.js";

// import {M,N} from "./GraveYardShift_Board.js";
export {GraveYardShift_Display}

let allJumps;

class GraveYardShift_Display extends Display {
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
        const w=0.25, sw=0.02;
        $background.append(
            svg("rect",{x:-w,y:-w,width:4+2*w,height:3+2*w,rx:0.2,fill:"slategray"}),// border
            svg("rect",{x:0,y:0,width:4,height:3, fill:"black"}), // bottom
            svg("rect",{x:4,y:0,width:w,height:1}), // exit
            svg("polygon",{points:pts([4.1,0.2],[4.2,0.5],[4.1,0.8]),fill:"none",
                           stroke:"white","stroke-width":0.02,"stroke-linejoin":"round"})
            // svg("use",{href:"#arrow-def",transform:translate(3.25,0)+rotate(90,0.5,0.5),stroke:"pink"})
        )
        for (let x=1;x<=3;x++) // add vertical lines
            $background.append(
                svg("line",{x1:x,y1:0,x2:x,y2:3,stroke:"Gainsboro","stroke-width":sw})
            )
        for (let y=1;y<=2;y++) // add horizontal lines
            $background.append(
                svg("line",{x1:0,y1:y,x2:4,y2:y,stroke:"Gainsboro","stroke-width":sw})
            )
    }
    
    setBoard(board){
        this.makeBackground($("#background"),board.grid);
        $("#pieces").empty();
        allJumps = null;
        this.board = board;
        this.$svg_element.data({board:board,display:this});
        for (const piece of board.pieces){
            piece.draw();
            if (piece.id != "I")
                piece.drawing
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
        // const i = jump.from.i, j=jump.from.j;
        this.board.undo(jump);
        // const $drawing = this.board.grid.get(i,j).drawing
        // translateSVG($drawing,j,i);        
    }

}

let lastOrientation=null,lastPiece=null;

function pointerdown(e){
    $(".current").removeClass("current");
    $("#bravo").remove()
    let [xPrev,yPrev]= getPos(e)
    const [xStart,yStart] = [xPrev,yPrev];
    const $current = $(e.currentTarget);
    if (!isSafari())
        $current.addClass("current");
    const piece = $current.data("piece")
    if (lastOrientation!=null && lastPiece !=null && piece != lastPiece){ 
        // changed rotated piece, so put it back
        lastPiece.drawing.attr("transform",translate(lastPiece.j,lastPiece.i)+rotate(lastPiece.ori,0.5,0.5))
    }
    
    const $svg_element = $("#svg_element");
    // move element at the end so that it appears above the others when it moves
    let {board,display} = $svg_element.data();
    let allowedJumps = board.possibleJumps()
    // console.log("allowedJumps",allowedJumps.join(", "))
    lastOrientation = lastOrientation || piece.ori
    $("#pieces").append($current);
    
    $svg_element.on("pointermove",pointermove);
    $svg_element.on("pointerup",pointerup);

    // keep track of the drag relatively to the preceding value
    // HACK: relative translation is important so that the shift between the pointer position
    //       and the piece position can be ignored
    function pointermove(e){
        if ($current == null)return;
        const [x,y]=getPos(e);
        // console.log("pointermove",x-xPrev,y-yPrev)
        if (x==xPrev && y==yPrev) return;
        translateSVG_rel($current,x-xPrev,y-yPrev);
        // $current.attr("transform",translate(piece.j+x-xOrig,piece.i+y-yOrig));
        xPrev=x;
        yPrev=y;
    }
        
    function moveTo(newI,newJ,ori){
        const allowedMoves = allowedJumps.filter(jump=>jump.to.i==newI && jump.to.j==newJ && jump.id==piece.id);
        if (allowedMoves.length>0){
            // move to new position, try to use specified orientation otherwise go to the next
            const idx = allowedMoves.findIndex(jump=>jump.new_ori==ori)
            const jump = allowedMoves[idx>=0?idx:0]
            allJumps = jump.extend(allJumps);
            board.play(jump);
            if (board.isComplete()){
                display.showBravo(allJumps,showMoves,3,4)
            }
        } else { // return to original
            $current.attr("transform",translate(piece.j,piece.i)+rotate(piece.ori,0.5,0.5))
        }
    }

    function pointerup(e){
        const diffPrevStart = Math.abs(xPrev-xStart)+Math.abs(yPrev-yStart)
        let newI=piece.i, newJ=piece.j;
        if (diffPrevStart<0.01){ // rotation in place
            moveTo(newI,newJ,nextDir(lastOrientation))
        } else {
             // snap on the grid position after move of piece
            const infos = getTranslateInfos($current);
            newI = Math.round(infos.y);
            newJ = Math.round(infos.x);
            moveTo(newI,newJ,lastOrientation)
        }
        $current.removeClass("current");              
        lastOrientation=null;
        lastPiece=null;        
        $svg_element.off("pointermove");
        $svg_element.off("pointerup");
    }
}
