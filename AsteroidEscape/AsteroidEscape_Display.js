import {svg,makePoints,translate,rotate,M,L,scale,cText,translateSVG_rel,translateSVG,getPos} from "../SVGtools.js"
import {Display,message,d} from "../Display.js"
import { AsteroidEscape_Jump } from "./AsteroidEscape_Jump.js";
import {showMoves} from "./AsteroidEscape_Board.js"
import { jumps2moves } from "../Jump.js";

// import {M,N} from "./AsteroidEscape_Board.js";
export {AsteroidEscape_Display}

let allJumps;

class AsteroidEscape_Display extends Display {
        constructor(){
        super();
        
    }

    makeDefs($defs){
        super.makeDefs($defs);
        $defs.append(
            svg("rect",{id:"tile",x:0,y:0,width:1,height:1,rx:0.05,
                        fill:"transparent",stroke:"gray","stroke-width":0.01}),
            svg("g",{id:"asteroid-large"},
                svg("circle",{r:0.4,stroke:"black","stroke-width":0.02})
            ),
            svg("g",{id:"asteroid"},
                svg("circle",{r:0.2,stroke:"black","stroke-width":0.02})
            ),
            svg("g",{id:"star",fill:"white"},
                ...[0,90,180,270].map(rot=>
                    svg("path",{d:M(0,0)+L(0,-0.2)+L(0.03,-0.05)+L(0.1,-0.1)+
                                L(0.05,-0.03)+L(0.2,0)+" Z",transform:rotate(rot,0,0)+scale(0.75)})
                                   
                )
            ),
            svg("radialGradient",{id:"gradient-1",cx:"10%", cy:"10%", r:"100%", fx:"30%", fy:"30%"},
                svg("stop",{offset:"10%","stop-color":"lightgray"}),
                svg("stop",{offset:"95%","stop-color":"gray"})
            ),
            svg("radialGradient",{id:"gradient-2",cx:"10%", cy:"10%", r:"100%", fx:"40%", fy:"40%"},
                svg("stop",{offset:"10%","stop-color":"gray"}),
                svg("stop",{offset:"95%","stop-color":"darkgray"})
            ),
            svg("radialGradient",{id:"gradient-3",cx:"10%", cy:"10%", r:"100%", fx:"50%", fy:"50%"},
                svg("stop",{offset:"10%","stop-color":"darkgray"}),
                svg("stop",{offset:"95%","stop-color":"#3F3F3F"})
            )


        )
    }
    
    makeBackground($background,grid){ 
        $background.append(
            svg("rect",{x:-0.25,y:-0.25,width:3.5,height:3.5,rx:0.1,fill:"darkblue"}),
            svg("path",{d:M(1,3.25)+L(1,3)+L(0,3)+L(0,0)+L(3,0)+L(3,3)+L(2,3)+L(2,3.25),
                        fill:"none",stroke:"gray","stroke-width":0.02,"stroke-linejoin":"round"})
        )
    }
    
    setBoard(board){
        this.makeBackground($("#background"),board.grid);
        $("#pieces,#tiles").empty();
        allJumps = null;
        this.board = board;
        this.$svg_element.data({board:board,display:this});
        for (const piece of board.pieces){
            if (piece.id != "_"){
                $("#tiles").append(
                    svg("g",{id:"tile-"+piece.id,
                               transform:translate(piece.j,piece.i)},
                        svg("use",{href:"#tile"}),
                        cText(piece.id,0.92,0.92,"lightgray",0.15)
                    ).data({piece:piece})
                     .on("click",click)
                )
                piece.draw()
                    .attr("transform",translate(piece.j,piece.i)+rotate(piece.ori,0.5,0.5))
                    .data({piece:piece})
                    .on("click",click)
                $("#pieces").append(piece.drawing)
            }
        }
        // ensure plane is above
        $("#pieces").append(board.plane.drawing);
    }
    
    move(piece){
        const tile = $("#tile-"+piece.id);
        translateSVG(tile,piece.j,piece.i)
        $("#tiles").append(tile);
        translateSVG(piece.drawing,piece.j,piece.i)
        $("pieces").append(piece.drawing)
    }
    
    blink(piece){
        piece.drawing.prepend(
            svg("rect",{x:0,y:0,width:1,height:1,fill:"transparent",class:"blink"},
                svg("animate",{attributeName:"fill",
                               values:"lightblue;transparent",
                               begin:"0s",dur:"0.5s",calcMode:"discrete",
                               repeatCount:"indefinite"})
                )
        )
    }
        
    undo(){
        $("#bravo").remove();
        if (allJumps == null) return;
        const jump = allJumps;
        allJumps = allJumps.precedent;
        const i = jump.from.i, j=jump.from.j;
        this.board.undo(jump);
        const $drawing = this.board.grid.get(i,j).drawing
        translateSVG($drawing,j,i);        
    }

}

function click(e){
    $("#bravo,.blink").remove()
    const $current = $(e.currentTarget);
     const $svg_element = $("#svg_element");
    let {board,display} = $svg_element.data();
    const hole = board.hole;
    const piece = $current.data("piece");
    const di = hole.i-piece.i, dj=hole.j-piece.j; 
    // check if piece is adjacent to the hole   
    if ((di==0 && Math.abs(dj)==1) || (dj==0 && Math.abs(di)==1)){ 
        const jumps = board.possibleJumps()
        const idx = jumps.findIndex(jump=>
                jump.pid == piece.id && jump.from.i==piece.i && jump.from.j==piece.j 
                && jump.to.i==hole.i && jump.to.j==hole.j)
        if (idx>=0){
            const jump = jumps[idx]
            allJumps = jump.extend(allJumps);
            board.play(jump);
            // console.log(board.toString())
            display.move(piece);
            if (board.isComplete()){
                display.showBravo(allJumps,showMoves,3,3)
            }
            return;
        } 
    }
    display.blink(piece);
}
