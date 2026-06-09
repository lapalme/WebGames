import {svg,makePoints,translate,rotate,M as MM,L,A,Q,cText,translateSVG_rel,translateSVG,getPos} from "../SVGtools.js"
import {Display,message,d} from "../Display.js"
import {showMoves, holePositions,overHole,M,N} from "./SquirrelsGoNuts_Board.js"
import { dir2rot,dirInv } from "../Jump.js";

export {SquirrelsGoNuts_Display}

let allJumps;


// create a flower with 6 petals of radius r
function flower(r){
    // relations for a rectangular triangle with angles of 30° and 60°
    const y=r/2,x = Math.sqrt(r*r-y*y); 
    // create the outline of a petal with a quadratic
    // adapted from  https://svg-tutorial.com/svg/quadratic-bezier
    const petal = (rot)=>svg("path",{d:MM(0,0)+L(x,y)+Q(r*2,0,x,-y)+"Z",
                                      transform:rotate(rot,0,0),
                                      stroke:"white","stroke-width":0.02})
    let f = svg("g",{id:"flower"})
    for (let rot=0;rot<360;rot+=60){
        f.append(petal(rot))
    }
    f.append(svg("circle",{cx:0,cy:0,r:r/3,stroke:"white","stroke-width":0.02}))
    return f;
}

class SquirrelsGoNuts_Display extends Display {
        constructor(){
        super();
    }

    makeDefs($defs){
        const d=0.03;
        super.makeDefs($defs);
        $defs.append(
             svg("g",{id:"nut"},
                //  svg("circle",{cx:0.5,cy:0.5,r:0.25,fill:"maroon"})
                svg("image",{href:"../images/nut.svg",width:0.5,x:0.25,y:0.25})
            ),
            flower(0.175),
            svg("g",{id:"squirrel",stroke:"black","stroke-width":0.02},
                 svg("ellipse",{cx:0.5,cy:1,  rx:0.3, ry:0.5}), // body
                 svg("ellipse",{cx:0.5,cy:1.4,rx:0.15,ry:0.3}), // tail
                 svg("ellipse",{cx:0.3,cy:0.8,rx:0.05,ry:0.3}),   // left arm
                 svg("ellipse",{cx:0.7,cy:0.8,rx:0.05,ry:0.3}),   //right arm   
                 svg("ellipse",{cx:0.5,cy:0.7,rx:0.18, ry:0.25}), // head
                 svg("circle",{cx:0.43,cy:0.6,r:0.03,fill:"black"}), // left eye
                 svg("circle",{cx:0.57,cy:0.6,r:0.03,fill:"black"}), // right eye
            )
        )
    }
    
    makeBackground($background,grid){
        $background.empty()
        let lines=[];
        for (let i=1;i<grid.M;i++) // horizontal lines
            lines.push(svg("line",{x1:0,y1:i,x2:4,y2:i,stroke:"black","stroke-width":0.05}))
        for (let j=1;j<grid.N;j++) // vertical lines
            lines.push(svg("line",{x1:j,y1:0,x2:j,y2:4,stroke:"black","stroke-width":0.05}))    
        $background.append(
            svg("rect",{x:-0.3,y:-0.3,width:4.6,height:4.6,rx:0.4,fill:"#DAA520",
                         stroke:"black","stroke-width":0.1}),
            svg("rect",{width:4,height:4,fill:"none",stroke:"black","stroke-width":0.05}),
            ...lines
        )
        // add holes
        for (const [i,j] of holePositions){
            $background.append(
                svg("circle",{cx:0.5,cy:0.5,r:0.27,fill:"white",transform:translate(j,i)})
            )
        }
        // add holes indicator  for [[0,2],   [1,0],      [2,1],     [3,3]]
        const holeIndicators = [[2.5,-0.13],[-0.13,1.5],[1.5,4.13],[4.13,3.5]]
        for (let k=0;k<holeIndicators.length;k++){
            const [x,y] = holeIndicators[k];
            $background.append(
                svg("circle",{id:"hi"+k,cx:x,cy:y,r:0.075,fill:"white",class:"hi"})
            )
        }

    }
    
    setBoard(board){
        this.makeBackground($("#background"),board.grid);
        $("#pieces").empty();
        $(".nut").remove();
        $(".hi").show().attr("fill","white")
        
        allJumps = null;
        this.board = board;
        this.$svg_element.data({board:board,display:this});
        for (const piece of board.pieces){
            piece.draw()
            piece.drawing.data({piece:piece})
            $("#pieces").append(piece.drawing)
            if (piece.id=="F"){ // hide the hole indicator
                const idx=overHole(piece.i,piece.j);
                $("#hi"+idx).hide()
            }
        }
        this.showPossibles()
    }
    
    showPossibles(){
        $(".arrow").remove();
        const possibles = this.board.possibleJumps();
        for (const jump of possibles){
            const piece = this.board.movable[this.board.movable.findIndex(p=>p.id==jump.id)];
            const pieceRot = dir2rot[dirInv[piece.dir]][0]
            const rot = jump.rotation()-pieceRot;
            piece.drawing.append(
                svg("use",{href:"#arrow-def",transform:rotate(rot,0.5,0.5),stroke:"blue",class:"arrow"})
                        .data({jump:jump,piece:piece}).on("click",click)
            )
        }        
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

function click(e){
    $("#bravo").remove()
    const $current = $(e.currentTarget);
    const $svg_element = $("#svg_element");
    let {board,display} = $svg_element.data();
    const {jump,piece} = $current.data();
    board.play(jump);
    $("#pieces").append(piece.drawing);
    allJumps = jump.extend(allJumps)
    if (board.isComplete()){
        display.showBravo(allJumps,showMoves,M,N)
    }  else {
        display.showPossibles()
    }       

}
