import {svg,translate,rotate,translateSVG,getPos,M,L,svg_drag} from "../SVGtools.js"
import {Display} from "../Display.js"
import {showMoves} from "./RiverCrossing_Board.js"
import { Plank } from "./RiverCrossing_Piece.js";
export {RiverCrossing_Display}

let allJumps;

class RiverCrossing_Display extends Display {
        constructor(){
        super();
    }

    makeDefs($defs){
        const d = 0.1;
        // plank North oriented
        const plank = (w,h)=>M(-w/2,-d)+L(w/2,-d)+L(w/2,-h+d)+L(-w/2,-h+d)+"Z";
        super.makeDefs($defs);
        $defs.append(
            svg("g",{id:"stump"},
                svg("circle",{cx:0,cy:0,r:0.22,fill:"brown"}),
                svg("rect",{x:-d,y:-d,width:2*d,height:2*d,fill:"goldenrod",stroke:"maroon","stroke-width":0.01})
            ),
            //  M 0,-0.1 A 0.1,0.1 0 0 1 0,0.1 L 1,0 A 0.1,0.1 0 0 1 1,0.1 L 0,0.1
            svg("g",{id:"plank-1"},
                svg("path",{d:plank(0.2,1),stroke:"maroon","stroke-width":0.01})
            ),
            svg("g",{id:"plank-2"},
                svg("path",{d:plank(0.2,2),stroke:"maroon","stroke-width":0.01})
            ),
            svg("g",{id:"plank-3"},
                svg("path",{d:plank(0.2,3),stroke:"maroon","stroke-width":0.01})
            ),
            svg("g",{id:"hiker"},
                svg("circle",{cx:0,cy:0,r:d-0.01,fill:"red",stroke:"black","stroke-width":0.01})
            )
        )
    }
    
    makeBackground($background,grid){ 
        if($("#background").children().length==0)
            $background.append(
                svg("rect",{x:-0.25,y:-0.5,width:4.5,height:6.5,fill:"lightskyblue"}),
                svg("rect",{x:-0.25,y:-0.5,width:4.5,height:1,fill:"sandybrown"}),
                svg("rect",{x:-0.25,y:5.5,width:4.5,height:1,fill:"sandybrown"})
            )
    }
    
    setBoard(board){
        this.makeBackground($("#background"),board.grid);
        $("#pieces").empty();
        allJumps = null;
        this.board = board;
        this.$svg_element.data({board:board,display:this});
        board.pieces = board.stumps.concat(board.planks);
        for (const piece of board.pieces){
            piece.draw()    
            if (piece instanceof Plank)
                piece.drawing.data({piece:piece})
                            //  .on("pointerdown",pointerdown);
            $("#pieces").append(piece.drawing)
        }
        this.showPossibleJumps()
    }
    
    showPossibleJumps(){
        $(".tentative").remove()
        const jumps = this.board.possibleJumps();
        this.board.activePlanks.forEach(pl=>{
            pl.drawing.data("active",pl)
              .on("pointerdown",pointerdown)
        })
        jumps.forEach(jump => {
            const hikerPname = this.board.hikerPlank.name()
            if (jump.fromPname==hikerPname)
                jump.draw()
                    .data("jump",jump)
                    .on("pointerdown",pointerdown)
        })
        
    }
    
    undo(){
        $("#bravo").remove();
        if (allJumps == null) return;
        const jump = allJumps;
        allJumps = allJumps.precedent;
        this.board.undo(jump);
        const hp = this.board.hikerPlank;
        hp.drawing.attr("transform",translate(hp.j,hp.i)+rotate(hp.rotation,0,0))      
        this.showPossibleJumps();       
    }

}

function pointerdown(e){
    $("#bravo").remove();
    const $svg_element = $("#svg_element");
    let {board,display} = $svg_element.data();
    const current = $(e.currentTarget);
    let plank;
    if (current.data("active")){
        plank = current.data("active");
        board.hikerPlank = plank;
    } else {
        const jump = current.data("jump");
        const idx = board.planks.findIndex(pl=>pl.name()==jump.fromPname);
        if (idx<0) debugger;
        plank = board.planks[idx];
        board.play(jump);
        plank.drawing.attr("transform",translate(plank.j,plank.i)+rotate(plank.rotation,0,0));        
        allJumps = jump.extend(allJumps)
    }
    plank.drawing.append($(".hiker").attr("transform",translate(0,-plank.length/2))); // move hiker to this plank
    // console.log(board.toString());
    board.activePlanks.forEach(pl=>{
            pl.drawing.data("active",null)
              .off("pointerdown",pointerdown)
        })
 
    if (board.isComplete()){
        display.showBravo(allJumps,showMoves,5,4)
    } else {
        display.showPossibleJumps()
    }
}

// unsuccessful try to use drag and drop to displace planks
// finally this proved to be a bad idea and not intuitive for moving
// planks as its involved dropping the mouse (and not the planks) between stumps
// This is why we resorted to the previous method of chosing between possible jumps
// But: it forced us to develop another way of using svg_drag, so we keep it there 
//       just to remember how it is used
function pointerdown_old(e){
    $("#bravo").remove()
    const current = $(e.currentTarget);
    const plank = current.data("piece");
    const plankName = plank.name();
    const $svg_element = $("#svg_element");
    let {board,display} = $svg_element.data();
    const possibleJumps = board.possibleJumps()
    // console.log(plankName,"possibleJumps",possibleJumps.join(", "))
    // check that the clicked piece is within the ones that can move
    const idx = possibleJumps.findIndex(jump=>jump.fromPname==plankName);
    if (idx<0)return;
    svg_drag(current,plank,$svg_element,getPos(e),
             null,
        (x,y)=>{
            const idx = possibleJumps.findIndex(jmp=>jmp.contains(x,y));
            if (idx>=0){
                board.play(possibleJumps[idx]);
                plank.drawing.attr("transform",translate(plank.j,plank.i)+rotate(plank.rotation,0,0));
                plank.drawing.append($(".hiker").attr("transform",translate(0,-plank.length/2))); // move hiker to this plank
                allJumps = possibleJumps[idx].extend(allJumps)
                // console.log(board.toString());
                if (board.isComplete()){
                    display.showBravo(allJumps,showMoves,5,4)
                }
            } else {
                // put it back where it was
                translateSVG(plank.drawing,plank.j,plank.i)
            }
        })
}
