import {svg,M,L,C,translate,rotate,cText} from "../SVGtools.js"
import {Display} from "../Display.js"
import {showMoves} from "./CannibalMonsters_Board.js"

export {CannibalMonsters_Display}

let allJumps;

class CannibalMonsters_Display extends Display {
        constructor(){
        super();
    }

    makeDefs($defs){
        // start the North arrow in the center of the unit square
        super.makeDefs($defs);
        $defs.append(
            svg("g",{id:"monster"},
                 svg("path",{d:M(0.1,0.80)+C(0.2,-0.2, 0.8,-0.2, 0.9,0.80)+"Z"})
            ),
            svg("g",{id:"eye"},
                 svg("circle",{cx:0,cy:0,r:0.10,fill:"white"}),
                 svg("circle",{cx:0,cy:0.03,r:0.06,fill:"black"})
            ),
       )
    }
    
    makeBackground($background,grid){ 
        const d=0.2;
        $background.append(
            svg("rect",{x:-d,y:-d,width:grid.M+2*d,height:grid.N+2*d,rx:d,
                         fill:"white",stroke:"black",'stroke-width':0.02})
        )
        grid.forEach((i,j,v)=>{
            $background.append(
                svg("circle",{cx:j+0.5,cy:i+0.5,r:0.4,fill:"none",
                              stroke:"lightgray","stroke-width":0.1})
            )
        })
    }
    
    setBoard(board){
        this.makeBackground($("#background"),board.grid)
        $("#pieces").empty();
        $(".arrow,#impasse,#bravo").remove()
        allJumps = null;
        this.board = board;
        this.$svg_element.data({board:board,display:this});
        for (const piece of board.pieces){
            piece.draw()
                .data({piece:piece});
            $("#pieces").append(piece.drawing)
        }
        this.board.possibleJumps();
    }
    
    showPossible(jumps){
        $(".arrow,#impasse").remove()
        if (jumps.length==0){
            if (this.board.pieces.length>1)
                $("#svg_element").append(
                    cText("Impasse",2,-0.75,"black",1).attr("id","impasse")
                )
            return
        }
        for(const jump of jumps){
            const piece = this.board.grid.get(jump.from.i,jump.from.j)
            if (piece==null) debugger;
            $("#svg_element").append(
                svg("use",{href:"#arrow-def",class:"arrow",stroke:"magenta",
                            transform:translate(piece.j,piece.i)+rotate(jump.rotation(),0.5,0.5)
                            }).data({jump:jump}).on("click",click)
            )
        }
    }
    
    undo(){
        if (allJumps == null) return;
        $("#bravo,.arrow,#impasse").remove();
        const jump = allJumps;
        allJumps = allJumps.precedent;
        this.board.undo(jump);        
    }
}

function click(e){
    $("#bravo").remove()
    const $current = $(e.currentTarget);
    const $svg_element = $("#svg_element");
    let {board,display} = $svg_element.data();
    const jump=$current.data("jump")
    board.play(jump);
    allJumps = jump.extend(allJumps);
    if (board.isComplete()){
        $(".arrow").remove()
        display.showBravo(allJumps,showMoves,0,board.grid.N)
    } else {
        board.possibleJumps()
    }
}
