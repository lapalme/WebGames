import {svg,pts,translate,M,L,Q,A,getTranslateInfos,translateSVG_rel,rotateSVG,getPos} from "../SVGtools.js"
import {Display,message,d} from "../Display.js"
import {showMoves} from "./CityMaze_Board.js"
import { C } from "../C.js";
import { CM_Jump } from "./CM_Jump.js";
import {Path, SimpleTurn, DoubleTurn,infosPiece} from "./CityMaze_Piece.js"
import {M as nbLines, N,positionsReserve} from "./CityMaze_Board.js";
export {CityMaze_Display}
const DEBUG=false
const N3=3*N, W3=1.0,W=W3/3, W2=W*2, W4=4*W, W5=5*W, W6=6*W, W_2=W/2, W_3=W/3;

let allJumps,undoPiecesList;

// reverse point to get the miror image 
function miroir(points){
    return points.map(([i,j])=>[W3-i,j]);
}

const path_w=W/2,dec_path=(W3-path_w)/2;
 
function makeRay(id,h){// créer un chemin NS avec hauteur h
    return svg("rect",{id:id,x:dec_path,y:0,width:path_w,height:h})
}

function makeEntry(id){ // demi-chemin à partir du centre
    return svg("rect",{id:id,x:dec_path,y:W3/2,width:path_w,height:W3/2})
    
}

function makePathBack(id,contenu){
    return svg("g",{id:id},
        svg("rect",{width:W3,height:W3,fill:"#ebebeb",
                    stroke:DEBUG?"black":"none","stroke-width":DEBUG?0.2:"none",
                    }),
        ...contenu
        )
}

function $turnPath(){
    return svg("path",{
        d:[M(W,0),Q(W-0.05,W-0.05,0,W),L(0,W2),Q(W2-0.1,W2-0.1,W2,0),"Z"].join(" "),
        fill:"white"
        })
};

function defStart(){
    const points = pts([W,W], [W,-W], [W_2,-W], [W3/2,-W2-W_2], [W2+W_2,-W], [W2,-W], [W2,W]);
    const d = M(W,W2/3)+" "+A(W,W,0,1,0,W2,W2/3);
    const transform = translate(0.02,0.02);
    return svg("g",{id:"start"}, 
        svg("polygon",{points:points,transform:transform,fill:"gray"}),// small shadow
        svg("path",{d: d,transform:transform,fill:"gray"}),
        svg("circle",{r:W_2,cx:W3/2,cy:W3/2,transform:transform,fill:"gray"}),
        svg("polygon",{points:points}),
        svg("path",{d: d}),
        svg("circle",{r:W_2,cx:W3/2,cy:W3/2,fill:"white","fill-opacity":"0.8"})
    )
}

function defPiece(id,points){
    // points = makePoints(points)
    return svg("g",{id:id},
            svg("polygon",{points: points,transform:translate(0.02,0.02),fill:"gray"}),
            svg("polygon",{points: points})
            // ,svg("circle",{r:2,fill:"white"})  // ajouter l'origine
        )
}

class CityMaze_Display extends Display {
        constructor(){
        super();
    }

    makeDefs($defs){
        super.makeDefs($defs);
        // flèche à gauche avec base dirigée vers le nord
        const arrow_pairs = [[W,W2+W_2], [W,W2], [-W,W2], [-W,W2+W_2],  [-W2-W_2,W3/2], [-W,W_2], [-W,W], [W2,W], [W2,W2+W_2]]
        // elbow à gauche avec base dirigée vers le nord
        const elbow_pairs = [[W,W2+W_2], [W,W], [W4,W], [W4,-W], [W3+W_2,-W], [W3+W3/2,-W2-W_2],  
                                        [W5+W_2,-W], [W5,-W], [W5,W2], [W2,W2], [W2,W2+W_2]];
        // toutes les pièces sont orientées vers le nord

        $defs.append(
            makePathBack("path",[
                svg("polygon",{
                    points:pts([W,0], [W2,0], [W2,W], [W3,W], [W3,W2], [W2,W2], [W2,W3], [W,W3], [W,W2], [0,W2], [0,W], [W,W]),
                    fill:"white"
                    })
                ]
            ),
            // rays
            makeRay("ray-NS",W3),
            rotateSVG(makeRay("ray-OE",W3),90,W3/2,W3/2),
            makeEntry("half-ray-N"),
            rotateSVG(makeEntry("half-ray-E"),90,W3/2,W3/2),
            rotateSVG(makeEntry("half-ray-S"),180,W3/2,W3/2),
            rotateSVG(makeEntry("half-ray-O"),270,W3/2,W3/2),
            svg("g",{id:"curved-ray"},
                svg("path",{
                    d:[M(dec_path,0),Q(dec_path-0.05,dec_path-0.05,0,dec_path),
                    L(0,dec_path+path_w),Q(dec_path+path_w-0.1,dec_path+path_w-0.1,dec_path+path_w,0),
                    "z"].join(" ")
                })),
            // turns
            makePathBack("virage-simple",[
                rotateSVG($turnPath(),180,W3/2,W3/2)
            ]),
            makePathBack("virage-double",[
                $turnPath(),
                rotateSVG($turnPath(),180,W3/2,W3/2)
            ]),
            // target
            svg("circle",{id:"target",r:W_2,cx:W3/2,cy:W3/2,fill:"yellow"}),
            // pieces
            defStart(),
            defPiece("arrow-left",pts(...arrow_pairs)),
            defPiece("arrow-right",pts(...miroir(arrow_pairs))),
            defPiece("elbow-right",pts(...elbow_pairs)),
            defPiece("elbow-left",pts(...miroir(elbow_pairs))),
            defPiece("u-turn-right",pts([W,W2+W_2], [W,W], [W5,W], [W5,W4], [W5+W_2,W4], [W3+W3/2,W5+W_2], 
                                        [W3+W_2,W4], [W4,W4], [W4,W2], [W2,W2], [W2,W2+W_2])),
            defPiece("u-turn-left",pts([W,W2+W_2], [W,W2], [-W,W2], [-W,W4], [-W_2,W4], [-W3/2,W5+W_2], 
                                       [-W2-W_2,W4], [-W2,W4], [-W2,W], [W2,W], [W2,W2+W_2])),
            defPiece("cross",pts([W, W_3], [W2, W_3], [W2, W], [W3-W_3, W], [W3-W_3, W2], [W2,W2], 
                                 [W2, W3-W_3], [W, W3-W_3], [W, W2], [W_3, W2], [W_3, W], [W, W]))

        )
    }
    
    makeBackground($background,grid){ 
        let chemin;
        // build the "roads" on the back 
        // Caution: the underlying grid is 18*18 so we loop
        for (let i=0;i<N;i++){
            for (let j=0;j<N;j++){
                if (i==0 && j==0){chemin=new SimpleTurn(`Vs${i}-${j}`,i,j)}
                else if (i==2 && j==3){chemin=new DoubleTurn(`Vd${i}-${j}`,i,j)}
                else chemin=new Path(`C${i}-${j}`,i,j);
                chemin.draw();
                $background.append(chemin.drawing);
            }
        }
        // add elements for display the rays over the background but under the pieces
        svg("g",{id:"ray-bleu",class:"ray"}).insertAfter($background)
        svg("g",{id:"ray-rouge",class:"ray"}).insertAfter($background)
    }
    
    setBoard(board){
        this.makeBackground($("#background"),board.grid)
        $(".current").removeClass("current"); 
        $("#bravo,.target").remove();
        $(".ray").empty()
        $("#pieces").empty();
        allJumps = null;
        undoPiecesList = [];
        this.board = board;
        this.$svg_element.data({board:board,display:this});
        for (const piece of board.pieces){
            piece.draw()
            piece.drawing.data({piece:piece})
            if (piece.canBeTurned){
                piece.drawing.on("pointerdown",pointerdown);
            }
            $("#pieces").append(piece.drawing)
        }
    }
    
    undo(){
        $("#bravo,.target").remove();
        $(".ray").empty();
        if (undoPiecesList.length==0)return;
        const piece = undoPiecesList.pop()
        this.board.setGrid(piece,".");
        this.board.paths[piece.i][piece.j].piece=null;
        piece.i = piece.iReserve;
        piece.j = piece.jReserve;
        piece.dir = "↑";        
        piece.update()       
    }

}

function addToUndoList(piece){
    const idx = undoPiecesList.indexOf(piece);
    if (idx>=0) undoPiecesList.splice(idx,1)
    undoPiecesList.push(piece)
}


// Caution: in this listener "this" is the clicked drawing of the piece
// The board and display must be explicitely found and addressed         
function pointerdown(e){
    // console.log("pointerdown",e);
    let pointerdownTime = e.timeStamp;
    $(".current").removeClass("current"); 
    $(".bravo,.target").remove();
    
    // const isTouchEvent=e.type=="touchstart";
    let [xPrev,yPrev] = getPos(e)
    const [xStart,yStart] = [xPrev,yPrev];
    const $current = $(e.target);
    $current.addClass("current")
    const piece = $current.data("piece");
    // move element at the end so that it appears above the others when it moves
    const $svg_element = $current.closest("svg");
    const {board,display} = $svg_element.data();
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
        // if (x==xPrev && y==yPrev) return;  
        //  pointer move seems very sensible to very little changes...
        if (Math.abs(xPrev-x)<0.005 && Math.abs(yPrev-y)<0.005) return;
        pointerdownTime=null;
        translateSVG_rel($current,x-xPrev,y-yPrev);
        // $current.attr("transform",translate(piece.j+x-xOrig,piece.i+y-yOrig));
        xPrev=x;
        yPrev=y;
    }
    
     function pointerup(e){
        // console.log("pointerup")
        let longTouch=(pointerdownTime !=null) && (e.timeStamp-pointerdownTime>200);
        const diffPrevStart = Math.abs(xPrev-xStart)+Math.abs(yPrev-yStart)
        // console.log("%d, %d, %s, %d",e.timeStamp,pointerdownTime,longTouch,diffPrevStart);
        if (diffPrevStart<0.005){
            if (board.express==null && longTouch){ // invert color if in reserve and in "on_the_double" mode
                if (piece.j>=N){
                    $current.remove()
                    const idx = positionsReserve[piece.color].findIndex(
                        ([k,i,j])=>k==piece.kind && piece.i==i && piece.j==j);
                    if (idx>=0){  // replacer la piece 
                        piece.j=piece.jReserve=positionsReserve[piece.isBlue()?"R":"B"][idx][2]
                    } else
                        throw new Error(`pas trouvé d'équivalent dans la réserve:${piece.kind},${piece.i},${piece.j}`)
                    piece.color = piece.color=="B"?"R":"B";
                    const jump = new CM_Jump(new C(piece.i,piece.j),new C(piece.i,piece.j),piece.kind,piece.color,piece.dir);
                    allJumps = jump.extend(allJumps);
                    addToUndoList(piece);
                    piece.changeMyInfos(infosPiece[piece.kind+piece.color]);
                    piece.draw();
                    piece.drawing.addClass("current");
                    piece.drawing.on("pointerdown",pointerdown)
                    $("#pieces").append(piece.drawing);
                }
            } else {
                board.rotation(piece);
                const jump = new CM_Jump(new C(piece.i,piece.j),new C(piece.i,piece.j),piece.kind,piece.color,piece.dir);
                allJumps = jump.extend(allJumps);
                addToUndoList(piece)
            }
        } else {
            // snap snap on the grid position
            const infos = getTranslateInfos($current);
            let newI = Math.round(infos.y);
            let newJ = Math.round(infos.x);
            const jump = new CM_Jump(new C(piece.i,piece.j),new C(newI,newJ),piece.kind,piece.color,piece.dir);
            allJumps = jump.extend(allJumps);
            addToUndoList(piece);
            board.play(jump); 
        }
        $svg_element.off("pointermove");
        $svg_element.off("pointerup");
        board.showPath()
        if (board.isComplete()){
            display.showBravo(allJumps,showMoves,nbLines,N)
        }

    }
}
