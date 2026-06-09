import {svg,makePoints,translate,rotate,cText,translateSVG_rel,translateSVG,getPos,svg_drag} from "../SVGtools.js"
import {Display,message,d} from "../Display.js"
import {M,N,ij2letter} from "./FlipIt_Board.js";
import {showMoves} from "./FlipIt_Board.js"
export {FlipIt_Display}

let allJumps;

class FlipIt_Display extends Display {
    constructor(){
        super();
    }
    
    makeDefs($defs){
        function ellipse(rx,ry,cx,cy,fill="#40826D"){
            return svg("ellipse",{cx:cx,cy:cy,rx:rx,ry:ry,fill:fill,
                                stroke:"black","stroke-width":0.05})
        }
        function turtle(tummy){
            return [
                ellipse(0.075,0.0375,0.25,0.25), // pattes
                ellipse(0.075,0.0375,0.75,0.25),
                ellipse(0.075,0.0375,0.25,0.75),
                ellipse(0.075,0.0375,0.75,0.75),
                ellipse(0.06,0.08,0.5,0.1), // tête
                // queue
                svg("polygon",{points:makePoints([0.45,0.85,0.55,0.85,0.5,0.95]),
                                fill:"#40826D",stroke:"black","stroke-width":0.05}),
                ellipse(0.25,0.35,0.5,0.5),// corps
                ellipse(0.15,0.25,0.5,0.5,tummy), // carapace                
            ]
        }

        super.makeDefs($defs);
        $defs.append(
            svg("g",{id:"fond-def"},
                svg("rect",{width:1,height:1, fill:"#AAFF00","stroke":"#00FF00","stroke-width":0.02}),
                svg("circle",{cx:0.5,cy:0.5,r:0.4,fill:"#90EE90", stroke:"#00FF00","stroke-width":0.05})
            ),
            svg("g",{id:"turtle-flipped",transform:rotate(30,0.5,0.5)},
                ... turtle("#40826D")
            ),
            svg("g",{id:"turtle",transform:rotate(-30,0.5,0.5)},
                 ... turtle("orange")             
            )
        )
    }
    
    makeBackground($background,grid){ 
        grid.forEach((i,j,v)=>{
            $background.append(
                svg("use",{href:"#fond-def",class:"fond",id:"f"+i+j,transform:translate(j,i)}),
                cText(ij2letter[i][j],j+0.5,i+0.5,"#DCDCDC")
            )
        })
    }
    
    setBoard(board){
        this.makeBackground($("#background"),board.grid)
        $("#pieces").empty();
        allJumps = null;
        this.board = board;
        this.$svg_element.data({board:board,display:this});
        for (const turtle of board.pieces){
            turtle.draw()
            turtle.drawing.data({piece:turtle})
            turtle.drawing.on("pointerdown",pointerdown);
            $("#pieces").append(turtle.drawing)
        }
    }
    
    undo(){
        $("#bravo").remove();
        if (allJumps == null) return;
        const jump = allJumps;
        const i = jump.from.i, j=jump.from.j;
        allJumps = allJumps.precedent;
        this.board.undo(jump);
        const $drawing = this.board.grid.get(i,j).drawing
        translateSVG($drawing,j,i);
        $("title",$drawing).text(ij2letter[i][j])
    }    

}

function pointerdown(e){
   $("#bravo").remove();
    const current = $(e.currentTarget);
    const turtle = current.data("piece");
    const $svg_element= $("#svg_element");
    let {board,display} = $svg_element.data();
    const possibleJumps = turtle.possibleJumps(board.grid);
    svg_drag(current,turtle,$svg_element,getPos(e),
             possibleJumps.map(jmp=>[jmp.to.i,jmp.to.j]),
        (idx,newI,newJ)=>{
            $("title",current).text(ij2letter[newI][newJ]);
            board.play(possibleJumps[idx]); 
            allJumps = possibleJumps[idx].extend(allJumps);
            if (board.isComplete()){
                display.showBravo(allJumps,showMoves,4,4)
            }
        })
}
