import {svg,makePoints,translate,rotate,M,L,Q,scaleAt,cText,translateSVG} from "../SVGtools.js"
import {Display,message,d} from "../Display.js"
import {M as nbLines,N as nbCols,showMoves} from "./SnowProblem_Board.js"
import { jumps2moves,jumpList } from "../Jump.js";

export {SnowProblem_Display}

const W=1.0,W_2=W/2,W_3=W/3,W_4=W/4,W_5=W/5;
const SW=0.02;

function head(color){
    const fill = color=="y" ? "yellow" : color=="r" ? "red" : "blue";
    return  svg("g",{id:color},
                svg("ellipse",{cx:W_2,cy:0.7*W,rx:W*0.3,ry:W_5,fill:fill,       // scarf
                                    stroke:"black","stroke-width":SW}),
                svg("circle",{cx:W_2,cy:W_2,r:W_4,fill:"snow",                  // head
                                stroke:"black","stroke-width":SW}),   
                svg("ellipse",{cx:W_2,cy:W*0.4,rx:W*0.3,ry:W_5/2,fill:"black"}), // hat
                svg("rect",{x:W_3,y:W_5,height:W_5,width:W_3,fill:"black"}),
                svg("circle",{cx:W*0.40,cy:W*0.55,r:0.05,fill:"black"}),         // eyes
                svg("circle",{cx:W*0.60,cy:W*0.55,r:0.05,fill:"black"}),         // mouth
                svg("path",{d:M(W*0.35,W*0.6)+Q(W_2,W*0.8,W*0.65,W*0.6),fill:"transparent",
                                stroke:"black","stroke-width":SW}),
                svg("polygon",{points: makePoints([W*0.47,W*0.60, W_2,W*0.75, W*0.53,W*0.60]),
                                fill:"orangered"})                                 // nose
            )
}

let allJumps;

class SnowProblem_Display extends Display {
        constructor(){
            super();
    }

    makeDefs($defs){
        super.makeDefs($defs);
        $defs.append(
            svg("g",{id:"hole"},
                svg("rect",{width:W,height:W,fill:"white"}), 
                svg("ellipse",{cx:W_2,cy:W_2,rx:W_3,ry:W_5,fill:"lightgray"}),
            ),
            svg("path",{id:"badMove",
                        d:M(W_3,W_3)+L(2*W_3,2*W_3)+M(2*W_3,W_3)+L(W_3,2*W_3),
                        fill:"none",
                        stroke:"red","stroke-width":0.1,"stroke-linecap":"round"}
            ),
            svg("g",{id:"deadEnd-def"},
                svg("text",{x:2.5*W,y:2,"text-anchor":"middle","alignment-baseline":"middle","font-size":"1",fill:"green"},
                    "Impasse!")
            ),
            svg("g",{id:"l"},
                svg("circle",{cx:W_2,cy:W_2,r:W*0.4,fill:"snow",
                          stroke:"black","stroke-width":SW}),
                svg("ellipse",{cx:W_2,cy:W_5,rx:W*0.2,ry:W*0.1,fill:"snow",
                                stroke:"black","stroke-width":SW})
            ),
            svg("g",{id:"m"},
                svg("circle",{cx:W_2,cy:W_2,r:W*0.30,fill:"snow",
                          stroke:"black","stroke-width":SW}),
                svg("ellipse",{cx:W_2,cy:W*0.3,rx:W*0.15,ry:W*0.1,fill:"snow",
                                stroke:"black","stroke-width":SW}),
                 svg("ellipse",{cx:W_2,cy:W*0.29,rx:W*0.13,ry:W*0.07,fill:"snow",
                                stroke:"black","stroke-width":SW}),               
            ),
            head("y"),head("r"),head("b"),
            svg("path",{id:"branch",
                        d:M(W_5,W_5)+L(W_2,0)+L(4*W_5,W_5),
                        fill:"none",
                        stroke:"green","stroke-width":0.2,"stroke-linecap":"round"}
            ),
            svg("g",{id:"t"},
                svg("rect",{x:W_2-0.05,y:W*0.7,width:0.1,height:W_5,fill:"brown"}),
                svg("use",{href:"#branch",transform:translate(0,1*W_5)+scaleAt(0.75,0.75,W_2,0)}),
                svg("use",{href:"#branch",transform:translate(0,2*W_5)+scaleAt(0.9,0.9,W_2,0)}),
                svg("use",{href:"#branch",transform:translate(0,3*W_5)}),
            ),
            svg("path",{id:"arrow",
                d:M(W_2,0)+L(W_3,W*0.15)+M(W_2,0)+L(W_2,W_3)+M(W_2,0)+L(2*W_3,W*0.15),
                fill:"transparent",
                stroke:"green","stroke-width":0.1,"stroke-linecap":"round"
            })
        )
    }
    
    makeBackground($background,grid){ 
        grid.forEach((i,j,v)=>{
            $background.append(svg("use",{href:"#hole",id:"f"+i+j,transform:translate(j,i)},
            svg("title",{},i+"@"+j)))            
        })
        $background.append(svg("use",{href:"#reset-def",id:"reset",transform:translate(6,4)}))  
    }
    
    setBoard(board){
        this.makeBackground($("#background"),board.grid)
        $("#pieces").empty();
        $("#bravo,#impasse,#x,.arrow").remove();
        allJumps=null;
        this.board = board;
        this.$svg_element.data({board:board,display:this});
        for (const piece of board.pieces){
            const drawing = piece.draw();
            if (piece.kind!="t"){
                drawing.on("mousedown",mousedown);
            }
            $("#pieces").append(drawing) 
        }
    }
    
    undo(){
        $("#bravo,#impasse,#x,.arrow").remove();
        if (allJumps == null) return;
        const jump = allJumps;
        allJumps = allJumps.precedent;
        // console.log("allJumps",jumpList(allJumps,[]).toString())
        const newPiece = this.board.undo(jump);
        // check if the undo did unstack and created a new piece
        if (newPiece!=null) 
            newPiece.drawing.on("mousedown",mousedown)
    }

}

function mousedown(e){
    $("#x,.arrow").remove();
    const $current = $(e.currentTarget);
    const piece = $current.data("piece");
    const $svg_element = $("#svg_element");
    const {board,display} = $svg_element.data();
        
    $current.on("mouseup",mouseup);
 
    function mouseup(e){
        const possibleJumps = piece.possibleJumps(board.grid);
        switch (possibleJumps.length) {
            case 0:
                $("#pieces").append(
                    svg("use",{href:"#badMove",id:"x",transform:translate(piece.j,piece.i)})
                )
                break;
            case 1:
                const jump=possibleJumps[0];
                board.play(jump);
                allJumps = jump.extend(allJumps);
                break;
            default:
                for (const jump of possibleJumps){
                    $svg_element.append(
                        svg("use",{href:"#arrow",
                                    transform:translate(piece.j,piece.i)+rotate(jump.rotation(),0.5,0.5),
                                    class:"arrow"}).data({piece:piece,jump:jump})
                        .on("mousedown",suivrefleche))
                    }
                break;
        }
        if (board.isComplete()){
            display.showBravo(allJumps,showMoves,nbLines,nbCols)
        } else if (board.isBlocked()){
                $svg_element.append(
                    svg("use",{href:"#deadEnd-def",id:"impasse"})
                )
        }
        $current.off("mouseup");
    }
    
    function suivrefleche(e){
        const $current = $(e.currentTarget);
        const jump=$current.data("jump");
        board.play(jump);
        allJumps = jump.extend(allJumps);
        $(".arrow").remove();
    }
}

