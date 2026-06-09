import {svg,makePoints,M,L,A,Q,translate,rotate,scale,scaleAt,cText} from "./SVGtools.js"
import {jumps2moves} from "./Jump.js"

export {message,d,Display}

function message(mess){
    const $message = $("#message");
    $message.val($message.val()+mess+"\n")
    // adapté de https://coderanch.com/t/121577/languages/focus-line-textarea
    const messageTA=$message[0]; // ensure that the last line is visible
    messageTA.scrollTop=messageTA.scrollHeight;
}

function d(val,w,str){
    return String(val).padStart(w)+str
}


class Display {
   
    constructor (){
        this.$svg_element = $("#svg_element");
        this.makeDefs($("#defs"))
        this.board  = null // current board
    }
    
    makeDefs($defs){
        // start the North arrow in the center of the unit square
        const arrow_d = M(0.5,0.4)+L(0.5,0.1)+M(0.40,0.20)+L(0.5,0.1)+L(0.60,0.20)
        $defs.append(
           svg("g",{id:"reset-def"},
                svg("path",{d:M(0.65,0.4)+A(0.2,0.2,0,1,0,0.78,0.55),
                             fill:"transparent",
                             stroke:"blue","stroke-width":0.1,"stroke-linecap":"round"}),
                svg("path",{d:M(0.55,0.3)+L(0.67,0.4)+L(0.55,0.5),
                             fill:"none",
                             stroke:"blue","stroke-width":0.078,"stroke-linecap":"round"})
           ),
           svg("g",{id:"undo-def"},
                svg("rect",{width:1,height:1,fill:"transparent"}),
                svg("path",{d:M(0.65,0.6)+A(0.2,0.2,0,1,0,0.25,0.6),
                             fill:"transparent",
                             stroke:"blue","stroke-width":0.1,"stroke-linecap":"round"}),
                svg("path",{d:M(0.16,0.45)+L(0.22,0.62)+L(0.4,0.6),
                             fill:"transparent",
                             stroke:"blue","stroke-width":0.078,"stroke-linecap":"round"})
            ),
             // https://docs.aspose.com/svg/net/drawing-basics/svg-filters/
            //  <filter id="shadow" x="-20" y="-20" height="150" width="150">
            //     <feOffset result="offset" in="SourceAlpha" dx="10" dy="10" />
            //     <feGaussianBlur result="blur" in="offset" stdDeviation="10" />
            //     <feBlend in="SourceGraphic" in2="blur" mode="normal" />
            // </filter>
            svg("filter",{id:"shadow", x:-0.03, y:-0.03, height:8, width:8},
                 svg("feOffset",{result:"offset",in:"SourceAlpha",dx:0.1,dy:0.1}),
                 svg("feGaussianBlur",{result:"blur",in:"offset",stdDeviation:0.05}),
                 svg("feBlend",{in:"SourceGraphic",in2:"blur",mode:"normal"})
            ),
             svg("g",{id:"arrow-def"}, 
                 // draw a thin black arrow over a thick white arrow to make it standout
                svg("path",{d: arrow_d,
                    fill:"transparent",
                    stroke:"white","stroke-width":0.12,"stroke-linecap":"round"
                }),
                svg("path",{d: arrow_d,
                    fill:"transparent",
                    "stroke-width":0.09,"stroke-linecap":"round"
                })
            ),
       )
    }
    
    makeBackground($backgroud){
        throw new Error("Display.makeBackground: should be redefined in a subclass")
    }
    
    setBoard(board){
        throw new Error("Display.setBoard: should be redefined in a subclass")
    }
    
    undo(jump){
        throw new Error("Display.undo: should be redefined in a subclass")
    }
    
    showBravo(allJumps,showMoves,M,N){
        if(allJumps==null)return;
        const [moves_w,jumps_w] = $("input[name='lang']:checked").val()=="fr" ? 
                            [" coups,"," sauts: "] : [" moves,"," jumps: "]; 
        $("#svg_element").append(
                svg("g",{id:"bravo"},
                    svg("rect",{width:4,height:2,x:(N-4)/2,y:(M-2)/2,rx:0.2,ry:0.22,fill:"white",stroke:"black","stroke-width":0.1,"fill-opacity":0.75}),
                    cText("Bravo !",N/2,M/2,"black",1)
                )
        )
        const [jumps,moves] = jumps2moves(allJumps);
        const movesShown = showMoves(moves)
        const nbMoves = movesShown.split(",").length
        const problemNo = $("input[name=state-no]:checked").val();
        message(d(problemNo,2,":")+d(nbMoves,3,moves_w)+d(nbMoves,3,jumps_w)+movesShown+"\n===");
        // message(d(problemNo,2,":")+d(moves.length,3,moves_w)+d(jumps.length,3,jumps_w)+showMoves(moves)+"\n===");   
    }    
}