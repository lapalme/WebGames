import {svg,translate,rotate,cText,translateSVG_rel,getTranslateInfos,translateSVG,rotateSVG,getPos} from "../SVGtools.js"
import {Display,message} from "../Display.js"
import {showMoves} from "./LaserMaze_Board.js"
import { LaserMaze_Jump } from "./LaserMaze_Jump.js";

export {LaserMaze_Display,tileFrame}

let allJumps;

function tileFrame(newAttrs,d=0.05){
    return svg("rect",Object.assign({x:d,y:d,width:1-2*d,height:1-2*d},newAttrs))
}

const ori2rot = {"?":0,"/":0,"\\":90,"|":0,"-":90,"N":"0","E":90,"S":180,"W":270}

class LaserMaze_Display extends Display {
        constructor(){
        super();
    }

    makeDefs($defs){
        super.makeDefs($defs);
        $defs.append(
            svg("g",{id:"tile-back"},
                tileFrame({fill:"none",stroke:"black","stroke-width":0.05,transform:translate(0.02,0.02)}),
                tileFrame({fill:"none","stroke-width":0.05})     
            ),
        )
    }
    
    makeBackground($background,grid){ 
        const d = 0.2;
        $background.append(
            svg("rect",{x:-d,y:-d,width:5+2.2*d,height:5+2.2*d,rx:d,fill:"#F8F8F8",stroke:"red","stroke-width":0.05}),
        )
        grid.forEach((i,j,v)=>{
            $background.append(
                svg("use",{href:"#tile-back",stroke:"lightgray",transform:translate(j,i)})
            )
        })
        svg("g",{id:"ray",class:"ray","fill":"none",
                  "stroke":"orange","stroke-width":0.05,"stroke-linecap":"round"})
             .insertAfter($("#pieces"))
        $background.append(
            cText("",2.5,-0.35,"black",0.2).attr("id","infos")
        )
    }
    
    setBoard(board){
        this.makeBackground($("#background"),board.grid)
        const $pieces = $("#pieces");
        $(".ray").empty();
        $("#infos").text("");
        $pieces.empty();
        allJumps = null;
        this.board = board;
        this.$svg_element.data({board:board,display:this});
        // add pieces 
        for (const piece of board.pieces.concat(board.reserve)){
            piece.draw()
                .attr({transform:translate(piece.j,piece.i)+rotate(ori2rot[piece.ori],0.5,0.5)})
                .data({piece:piece});
            if (piece.canBeMoved || piece.canBeRotated)
                piece.drawing.on("pointerdown",pointerdown);
            $pieces.append(piece.drawing)
        }
        // add number of targets
        $pieces.append(
            cText(board.targets+"",5.25,-1,"black",0.8)
        )
        board.showRay();
    }
    
    undo(){
        $("#bravo").remove();
        if (allJumps == null) return;
        const jump = allJumps;
        allJumps = allJumps.precedent;
        this.board.undo(jump);
        this.board.showRay();        
    }

}

function pointerdown(e){
    $("#bravo").remove();
    let [xPrev,yPrev] = getPos(e);
    const [xStart,yStart] = [xPrev,yPrev];
    // console.log("pointerdown",xStart,yStart)
    let $current = $(e.currentTarget);
    const piece = $current.data("piece");
    const $svg_element = $("#svg_element");
    
    let {board,display} = $svg_element.data();
     // move element at the end so that it appears above the others when it moves   
    $("#pieces").append($current);
    if (piece.canBeMoved){
        $svg_element.on("pointermove",pointermove);
        $svg_element.on("pointerup",pointerup);
    }
    $current.on("pointerup",pointerup);

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
     
    
    function pointerup(e){
        // console.log("pointerup",xPrev,yPrev);
        const diffPrevStart = Math.abs(xPrev-xStart)+Math.abs(yPrev-yStart)
        if (diffPrevStart<0.005){
            piece.ori=piece.nextOrientation();
            rotateSVG(piece.drawing,ori2rot[piece.ori],0.5,0.5);
            // rotation only do not add a new Jump, update the last one
            if (allJumps==null || (allJumps.to.i != piece.i || allJumps.to.j != piece.j)){
                const jump = new LaserMaze_Jump([piece.i,piece.j],[piece.i,piece.j],piece.id,piece.ori);
                allJumps = jump.extend(allJumps);
            }
            allJumps.newOri=piece.ori;
        } else {
            // snap snap on the grid position
            const infos = getTranslateInfos($current);
            let newI = Math.round(infos.y), newJ= Math.round(infos.x);
            if (infos.y < -0.25 && piece.i<0){ // not within the board
                // was already in the reserve
                piece.i = -1.5;
                piece.j = piece.posInReserve;
                $(".ray").empty();
                translateSVG(piece.drawing,piece.j,piece.i)
            } else {
                if (newI<0 || board.grid.get(newI,newJ)==null){
                    // play a move to an empty space
                    const jump = new LaserMaze_Jump([piece.i,piece.j],[newI,newJ],piece.id,piece.ori);
                    allJumps = jump.extend(allJumps);
                    board.play(jump); 
                } else {
                    // ensure that the drawing returns to the previous place
                    $(".ray").empty();
                    translateSVG(piece.drawing,piece.j,piece.i)
                }
            }
        }
        $svg_element.off("pointermove");
        $svg_element.off("pointerup");
        $current.off("pointerup");           
        board.showRay();    
        if (board.isComplete()){
            display.showBravo(allJumps,showMoves,-1,board.grid.N)
        }        
    }
}
