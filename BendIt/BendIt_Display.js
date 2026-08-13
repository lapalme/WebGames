import {svg,makePoints,translate,rotate,cText,translateSVG_rel,translateSVG,getPos,svg_drag,isSafari} from "../SVGtools.js"
import {Display,message,d} from "../Display.js"
import {showMoves} from "./BendIt_Board.js"
import { jumps2moves } from "../Jump.js";
import { BendIt_Jump } from "./BendIt_Jump.js";
import { pieces_segments } from "./Problems.js";
import { pieceConfigs } from "./BendIt_Piece.js";

export {BendIt_Display,foldArea}

let allJumps;
// bounds of the "folding area"
const foldArea = {minI:0,minJ:7,maxI:5,maxJ:12}


// positions in the reserve, to put it back if needed
const starting_ij = pieces_segments.map(ps=>ps.slice(4))

class BendIt_Display extends Display {
        constructor(){
        super();
        $("#undo").off("mousedown").attr("opacity",0.2)
    }

    makeDefs($defs){
        super.makeDefs($defs);
        $defs.append(
            svg("circle",{id:"black",cx:0.5,cy:0.5,r:0.47,fill:"black",
                          stroke:"black","stroke-width":0.02}),
            svg("circle",{id:"white",cx:0.5,cy:0.5,r:0.47,fill:"white",
                          stroke:"black","stroke-width":0.02}),
        )
    }
    
    makeBackground($background,grid){ 
        $background.empty();
        // add board
        $background.append(
            svg("rect",{x:-0.5,y:-0.5,width:7,height:7,rx:0.5,fill:"yellowgreen"})
        );
        // add folding area
        $background.append(
            svg("rect",{x:foldArea.minJ-0.25,y:-1,
                        width:6.75,height:8,fill:"black",opacity:0.05})
        )
    }
    
    setBoard(board){
        this.makeBackground($("#background"),board.grid);
        $("#pieces").empty();
        allJumps = null;
        this.board = board;
        this.$svg_element.data({board:board,display:this});
        const goal = svg("g",{id:"goal"})
        $("#pieces").before(goal)
        // add goal pieces
        board.goal.forEach((i,j,c)=>
            goal.append(svg("use",{href:c=="B"?"#black":"#white",
                            transform:translate(j,i)})
            )            
        )
        for (const piece of board.pieces){
            piece.draw()
                .data({piece:piece})
                .on("pointerdown",pointerdown);
            $("#pieces").append(piece.drawing)
        }
        
        // add button to the background (their need access to the board)
        function makeButton(message,char,fsize,i,j,action,board){
            return svg("g",{transform:translate(j,i)},
                    svg("title",{},message),
                    cText(char,0.5,0.5,"magenta",fsize)
                ).on("pointerdown",e=>{
                    const piece = $(".current").data("piece")
                    if (piece != null && piece.inFoldArea()){
                        piece.segments = action(piece);
                        piece.moveTo(piece.i,piece.j)
                    }
                })
        }
         // add buttons
        const $background = $("#background")
        $background.append(makeButton("rotation 90°",
                                      "⤾",1.5,5.9,7.5,p=>p.rotate90(),board)),
        $background.append(makeButton("flip horizontal",
                                      "↕",1,6,9.5,p=>p.flip("H"),board)),
        $background.append(makeButton("flip vertical",
                                      "↔",1,5.9,11.5,p=>p.flip("V"),board))
    }
    
    undo(){
        // $("#bravo").remove();
        // if (allJumps == null) return;
        // const jump = allJumps;
        // allJumps = allJumps.precedent;
        // this.board.undo(jump);  
        console.log("undo est désactivé...")    
    }

}

// for the left pivot
let xPrev=null, yPrev=null, piece=null ;

function pointerdown(e){
    function updateCurrent(piece){ 
        $(".current").removeClass("current")
        piece.drawing.addClass("current")
    }
    
    function putInReserve(piece){
        // HACK: reset the piece in the reserve by using the first saved config of the piece
        // console.log("putInReserve",piece.color)
        piece.segments = pieceConfigs[piece.id][0][1]
        const [startI,startJ]=starting_ij[piece.id]
        piece.moveTo(startI,startJ)
        $(".pivot",piece.drawing).off("pointerdown").off("pointerup");
    }   

    function leftPivotDown(e,board){
        piece = $(e.currentTarget).parent().data("piece");
        [xDown,yDown]=getPos(e)
        xPrev=xDown;yPrev=yDown;
        // console.log("leftPivotDown",xPrev,yPrev,e.currentTarget,piece.color);
        $svg_element
            .on("pointermove",pointermove)
            .on("pointerup",function(e){pointerup(e,board)})
        e.stopPropagation()
    }
    
    function pointermove(e){
        if (xPrev == null)return;
        const [x,y]=getPos(e);
        // console.log("pointermove",x-xPrev,y-yPrev,piece.color)
        if (x==xPrev && y==yPrev) return;
        translateSVG_rel(piece.drawing,x-xPrev,y-yPrev);
        // $current.attr("transform",translate(piece.j+x-xOrig,piece.i+y-yOrig));
        // console.log($(piece.drawing).attr("transform"))
        xPrev=x;
        yPrev=y;
    }

    function pointerup(e,board){
        const [xEnd,yEnd] = getPos(e);
        // console.log("pointerup",xEnd,yEnd)
        if (xEnd==xDown && yEnd==yDown){
            // rotate left segment
            // console.log("rotate left")
            let segments = piece.segments;
            segments = segments.fold(90,0,0);
            // check overlap between second middle ball and last ball of left
            if (segments.middle.balls[1].hasSamePosAs(segments.left.balls.at(-1)))
                segments = segments.fold(90,0,0);
            piece.segments = segments;
            piece.moveTo(piece.i,piece.j)                
        } else {
            // console.log("end drag");
            // startDrag to a possible position 
            const newI = Math.trunc(yEnd), newJ=Math.trunc(xEnd);
            const possible=piece.possiblePlaces(board.grid,board.goal)
            // console.log(newI,newJ,"possible:",possible.map(e=>e.toString()).join(";"))
            const idx = possible.findIndex(([i,j])=>i==newI && j==newJ)
            if (idx>=0){
                translateSVG(piece.drawing,newJ,newI);
                $(".pivot",piece.drawing).off("pointerdown").off("pointerup");
                piece.i=newI;piece.j=newJ;
                const newJump = new BendIt_Jump([piece.i,piece.j],[newI,newJ],piece)
                board.play(newJump);
                allJumps = newJump.extend(allJumps);
                if (!isSafari()) // highlight piece in the target area
                    piece.drawing.attr("filter","url(#shadow)")
                if (board.isComplete()){
                    display.showBravo(allJumps,showMoves,6,6)
                }
            } else {
                // put it back in the fold area
                translateSVG(piece.drawing,piece.j,piece.i);
            }
        }
        $svg_element.off("pointermove");
        $svg_element.off("pointerup")   
    }
     
    function rightPivot(e){
        const piece=$(e.currentTarget).parent().data("piece");
        // console.log("rightPivot",e.currentTarget)
        let segments = piece.segments;
        segments = segments.fold(0,90,0)
        // check overlap between next to last middle ball and first ball of right
        if (segments.middle.balls.at(-2).hasSamePosAs(segments.right.balls[0]))
            segments = segments.fold(0,90,0)
        piece.segments = segments;
        piece.moveTo(piece.i,piece.j)
        $svg_element.off("pointermove");
        $svg_element.off("pointerup");
        e.stopPropagation();
    }

    let [xDown,yDown] = getPos(e);
    let $current, piece, xPrev=xDown, yPrev=yDown;
    $("#bravo").remove()
    const $svg_element = $("#svg_element");
    let {board,display} = $svg_element.data();
    piece = $(e.currentTarget).data("piece") || $(e.currentTarget).parent().data("piece")
    
    if (piece.inReserve()){
        $current = $(".current")
        if ($current.length>0){
            // if current piece is in the folding area, put it back in the reserve  
            const currentPiece = $current.data("piece")
            if (currentPiece.inFoldArea()) {
                putInReserve(currentPiece)
            }
        }
        // add the clicked piece to the folding area and add listeners
        updateCurrent(piece)
        piece.moveTo(foldArea.minI+2,foldArea.minJ+(piece.id<4 ? 1 : 2))           
        $(".left",piece.drawing)
            .on("pointerdown",function(e){leftPivotDown(e,board)})
        $(".right",piece.drawing)
            .on("pointerdown",rightPivot);
    } else if (piece.inFoldArea()){
            // the click was not on a pivot
            putInReserve(piece)
    } else if (piece.inTarget()){
        piece.drawing.attr("filter",null) // remove filter
        // remove from the grid
        for (const ball of piece.allBalls()){
            board.grid.set(piece.i+ball.i,piece.j+ball.j,null)
        }
        // update the list of previous moves to delete the move corresponding to the placement of this piece
        if (allJumps != null){
            if (allJumps.piece == piece){ // it was on the last move
                allJumps = allJumps.precedent;
            } else { // go back to the previous
                let previous = allJumps;
                let current = allJumps.precedent;
                while (current!=null){
                    if (current.piece == piece){
                        previous.precedent=current.precedent;
                        break;
                    }
                    current = current.precedent;
                }
            }
        }
        updateCurrent(piece)
        putInReserve(piece)
        
    } else
        debugger;
    // console.log(board.grid.show())
}


