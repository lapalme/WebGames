import { translateSVG } from "../SVGtools.js"
import {Board} from "../Board.js"
import {Grid} from "../Grid.js"
import {Jump} from "../Jump.js"
import {TipOver_Piece} from "./TipOver_Piece.js"
import {TipOver_Jump} from "./TipOver_Jump.js"

export {TipOver_Board,showMoves,dirs}

function showMoves(jumpsList){
    // as each jump is adjacent to the previous one, "jumps2moves" in solver.js
    // always creates a single list so we extract it
    jumpsList = jumpsList[0];
    // show moves with the same notation as on the game cards
    // skipping moves that do not involve tipping
    let moves = [];
    let arrows="";
    for (let k=0;k<jumpsList.length;k++){
        const jump = jumpsList[k];
        if (jump.tipping){
            if (arrows.length>0){
                moves.push(arrows);
                arrows="";
            } 
            moves.push(jump.ij2number());
        } else {
            arrows+={"L":"←","R":"→","U":"↑","D":"↓"}[jump.l]
        }
    }
    if (arrows.length>0)
        moves.push(arrows)
    return moves.join(", ");
}

const dirs = {"L":[0,-1],"R":[0,1],"U":[-1,0],"D":[1,0]}

class TipOver_Board extends Board {
    constructor (no,state,display){
        super(no,state,display);
        this.grid = new Grid(6,6)
        this.pieces = []
        const stateP = JSON.parse(state)
        this.tipper = stateP["tipper"];
        this.goal = null;
        let id=1
        for (const c of ["r","g","b","y"]){
            for (const [id,i,j,tipped] of stateP[c]){
                const piece = new TipOver_Piece(id,i,j,c,tipped)
                this.pieces.push(piece);
                piece.putInGrid(this.grid)
                if (c=="r")this.goal=piece;
            }
        }
        if (display != null) // this call must come after pieces have been added
            display.setBoard(this);
    }
    
    // show the grid with the tipped piece followed by a !
    toString(){
        const charGrid = this.grid.copy()
        charGrid.forEach((i,j,v)=>
            charGrid.set(i,j,v!=null ? (v.c +(v.tipped!=null ? "!":"")) : null)
        )
        const i = this.tipper[0],j=this.tipper[1];
        charGrid.set(i,j,charGrid.get(i,j).toUpperCase())
        return charGrid.show(3)
    }

    toState(){
        let crates={r:[], g:[], b:[], y:[]};
        this.pieces.forEach(p=>{crates[p.c].push(p.toState())})
        return JSON.stringify({r:crates["r"],g:crates["g"],
                               b:crates["b"],y:crates["y"],tipper:this.tipper})
    }
    
    possibleJumps(){
        const i=this.tipper[0],j=this.tipper[1];
        let jumps = []
        // check for tipping a crate 
        const current = this.grid.get(i,j)
        if (current == null) debugger;
        if (current.tipped==null){
            for (const l in dirs){
                if (current.allowedTip(this.grid,l)){
                    const [di,dj]=dirs[l];
                    jumps.push(new TipOver_Jump([i,j],[i+di,j+dj],l,current.c,true))
                }
            }
        }
        // move to an adjacent crate, tipped or not
         for (const l in dirs){
            const [di,dj]=dirs[l];
            const i1=i+di, j1=j+dj;
            // check if the jump is on an adjacent non-null cell
            if (this.grid.check(i1,j1) && this.grid.get(i1,j1)!=null){
                jumps.push(new TipOver_Jump([i,j],[i1,j1],l,current.c,false))
            }
        }
        return jumps;
    }
    
    isComplete(){
        return this.goal.i==this.tipper[0] && this.goal.j==this.tipper[1]
    }
    
    play(jump){
        const i=jump.from.i,j=jump.from.j;
        const crate=this.grid.get(i,j);
        this.tipper = [jump.to.i,jump.to.j];
        if (jump.tipping){
           crate.tipped=jump.l;
           this.grid.set(i,j,null);
           const [di,dj]=dirs[jump.l];
           for (let k=1;k<=crate.height;k++){
               this.grid.set(i+k*di,j+k*dj,crate)
           }
           if (this.display){
               crate.drawing.remove();
               $("#pieces").append(crate.draw())
           } 
        }
        if (this.display){
            $("#pieces").append(translateSVG($("#tipper"),this.tipper[1],this.tipper[0]))
        }
    }
    
    undo(jump){
        const fromI=jump.from.i, fromJ=jump.from.j;
        const toI=jump.to.i, toJ=jump.to.j;
        this.tipper = [fromI,fromJ];
        const crate = this.grid.get(toI,toJ);
        if (jump.tipping){
            crate.tipped=null;
            const [di,dj]=dirs[jump.l];
            this.grid.set(fromI,fromJ,crate);
            for (let k=1;k<=crate.height;k++){
                this.grid.set(fromI+k*di,fromJ+k*dj,null)
            }
            crate.drawing.remove();
            $("#pieces").append(crate.draw())
        }
        $("#pieces").append(translateSVG($("#tipper"),this.tipper[1],this.tipper[0]))
    }
    
}