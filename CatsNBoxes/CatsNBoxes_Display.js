import {svg,pts,translate,rotate,cText,translateSVG,rotateSVG,getPos,
        translateSVG_rel, getTranslateInfos,M,L,Q} from "../SVGtools.js"
import {Display,message,d} from "../Display.js"
// import {showMoves} from "./CatsNBoxes_Board.js"
import { jumps2moves,nextDir,dir2rot,dirInv } from "../Jump.js";

import {showMoves,M as nbLines,N as nbCols} from "./CatsNBoxes_Board.js";
export {CatsNBoxes_Display}

let allJumps;

class CatsNBoxes_Display extends Display {
        constructor(){
        super();
    }

    makeDefs($defs){
        super.makeDefs($defs);
        const d=0.05, d2=d+d // small inset for the box (same as in CatsNBoxes_Piece.js)
        const earPoints=pts([0.5,0.2], [0.6,0.4], [0.4,0.4])
        $defs.append(
            svg("g",{id:"cat","stroke-width":0.02},
                 svg("polygon",{points:earPoints,transform:rotate(30,0.5,0.5)}),// ears
                 svg("polygon",{points:earPoints, transform:rotate(-30,0.5,0.5)}),
                 svg("ellipse",{cx:0.5,cy:0.5,rx:0.23,ry:0.17}), // head
                 svg("ellipse",{cx:0.43,cy:0.45,rx:0.05,ry:0.02, fill:"none"}), //eyes
                 svg("ellipse",{cx:0.57,cy:0.45,rx:0.05,ry:0.02, fill:"none"}),
                 svg("path",{d:M(0.4,0.55)+Q(0.45,0.65,0.5,0.55)+Q(0.55,0.65,0.6,0.55),fill:"none"}) //whiskers
            ),
            svg("g",{id:"box"},
                 svg("rect",{x:d2,y:d2,width:1-2*d2,height:1-2*d2,
                              "stroke-width":d2})),
            svg("pattern",{id:"flower",width:1,height:1,
                            patternUnits:"userSpaceOnUse"},
                 svg("rect",{x:0,y:0,width:1,height:1, fill:"#87CEEB"}),
                 ...[0,60,120,180,240,300].map(rot=> // rotate 6 petals
                        svg("path",{d:M(0.5,0.1)+Q(0.35,0.3,0.5,0.5)+Q(0.65,0.3,0.5,0.1), 
                                     transform:rotate(rot,0.5,0.5),fill:"none",
                                     stroke:"blue","stroke-width":0.02})),
                 )
        )
    }
    
    makeBackground($background,grid){ 
        $background.append(
            svg("rect",{x:-0.25,y:-0.25,width:5.5,height:5.5,rx:0.25,fill:"#1E90FF"})
        )
        grid.forEach(function (i,j,_val){
            $background.append(
                svg("rect",{x:j+0.1,y:i+0.1,width:0.8,height:0.8,fill:"none",stroke:"blue","stroke-width":0.05})
            )})
    }  
    
    setBoard(board){
        this.makeBackground($("#background"),board.grid)
        $("#pieces").empty();
        this.board = board;
        allJumps = null;
        this.$svg_element.data({board:board,display:this});
        for (const cid in board.cats){
            const cat = board.cats[cid]
            cat.draw()
            $("#pieces").append(cat.drawing)
        }
        for (const pid in board.pieces){
            const piece = board.pieces[pid]
            piece.draw()
                .data({piece:piece});
            $(":last",piece.drawing).on("pointerdown",pointerdown); // make only the box clickable
            $("#pieces").append(piece.drawing)
        }
    }
    
    undo(){
        $("#bravo").remove();
        if (allJumps == null) return;
        const jump = allJumps;
        allJumps = allJumps.precedent;
        this.board.undo(jump);
    }
}

let lastOrientation=null,lastPiece=null;

function pointerdown(e){
    let pointerdownTime = e.timeStamp;
    $(".current").removeClass("current");
    $("#bravo").remove()
    let [xPrev,yPrev]= getPos(e)
    const [xStart,yStart] = [xPrev,yPrev];
    const $current = $(e.currentTarget).parent(); // set current as the piece and not only the box...
    $current.addClass("current");
    const piece = $current.data("piece")
    if (lastOrientation!=null && lastPiece !=null && piece != lastPiece){ 
        // changed rotated piece, so put it back
        lastPiece.drawing.attr("transform",translate(lastPiece.j,lastPiece.i)+rotate(lastPiece.ori,0.5,0.5))
    }

    const $svg_element = $("#svg_element");
    // move element at the end so that it appears above the others when it moves
    let {board,display} = $svg_element.data();
    let allowedJumps = piece.possibleJumps(board.grid)
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
        pointerdownTime=null;
        translateSVG_rel($current,x-xPrev,y-yPrev);
        // $current.attr("transform",translate(piece.j+x-xOrig,piece.i+y-yOrig));
        xPrev=x;
        yPrev=y;
    }

    
    function pointerup(e){
        const diffPrevStart = Math.abs(xPrev-xStart)+Math.abs(yPrev-yStart)
        let newI=piece.i, newJ=piece.j;
        if (diffPrevStart<0.01){
            lastPiece = piece;
            lastOrientation = nextDir(lastOrientation);
            const rot = dir2rot[dirInv[lastOrientation]][0];
            rotateSVG($current,rot,0.5,0.5);
        } else {
             // snap snap on the grid position
            const infos = getTranslateInfos($current);
            newI = Math.round(infos.y);
            newJ = Math.round(infos.x);
            const idx = allowedJumps.findIndex(jump=>jump.to.i==newI && jump.to.j==newJ && jump.ori==lastOrientation)
            if (idx>=0){ // move to new position and orientation
                const jump = allowedJumps[idx]
                allJumps = jump.extend(allJumps);
                piece.play(jump,board.grid);
                if (board.isComplete()){
                    display.showBravo(allJumps,showMoves,nbLines,nbCols)
                }        
            } else {
                $current.attr("transform",translate(piece.j,piece.i)+rotate(piece.ori,0.5,0.5))
            }
            $current.removeClass("current");              
            lastOrientation=null;
            lastPiece=null;
        }
        $svg_element.off("pointermove");
        $svg_element.off("pointerup");
    }
}
