import { translateSVG } from "../SVGtools.js"
import {Board} from "../Board.js"
import {Grid} from "../Grid.js"
import {Jump} from "../Jump.js"
import {TempleTrap_Piece} from "./TempleTrap_Piece.js"
import { TempleTrap_Jump } from "./TempleTrap_Jump.js"

export {TempleTrap_Board,showMoves}

function showMoves(jumpsList){ 
    let res = [];
    for (const jumps of jumpsList){
        res.push(jumps[0].toString()+jumps.slice(1).map(j=>j.path).join(""))
    }
    return res.join(" ");
}

const dir2didj = {"↑":[-1,0],"→":[0,1],"↓":[1,0],"←":[0,-1]}

class TempleTrap_Board extends Board {
    constructor (no,state,display){
        super(no,state,display);
        const stateP = JSON.parse(state)
        this.pieces = [];
        this.adventurer = stateP.adventurer;
        this.hasEscaped = false
        this.grid = new Grid(3,3);
        for (const p of stateP.pieces){
            const piece = new TempleTrap_Piece(p[0],p[1],p[2],p[3])
            if (this.adventurer[0]==p[1] && this.adventurer[1]==p[2])
                piece.hasAdventurer=true;
            this.grid.set(p[1],p[2],piece);
            this.pieces.push(piece)
        }
        if (display != null) // this call must come after pieces have been added
            display.setBoard(this);
    }
    
    toString(){
        return this.grid.show(7)
    }

    toState(){
         return JSON.stringify({pieces:this.pieces.map(p=>p.toState()),adventurer:this.adventurer})
    }
    
    // returns the next possible positions for the adventurer
    // stop as soon as an acceptable position at level 1 is encountered
    // it also keeps track of the path through pieces at level 2
    adventurerJumps(){
        let jumps = [];
        let [i,j] = this.adventurer;
        // find possible exits for the adventurer
        let current = this.grid.get(i,j);
        let startDirs;
        if ("d*+".includes(current.id)){
            startDirs = (current.ori=="↓" || current.ori=="↑")?["↓","↑"]:["←","→"];
        } else {
            if (current.ori=="↑") startDirs = ["↓","→"]
            else if (current.ori == "→") startDirs = ["←","↓"]
            else if (current.ori == "↓") startDirs = ["↑","←"]
            else if (current.ori == "←") startDirs = ["→","↑"]
            else debugger;
        }   
        for (let dir of startDirs){
            let path = [];
            [i,j] = this.adventurer;
            const adventurer = this.grid.get(i,j);
            let [di,dj] = dir2didj[dir];
            let idi=i+di, jdj=j+dj;
            if (idi==0 && jdj==-1){ // exit the trap already
                return [new TempleTrap_Jump("!",this.adventurer,[idi,jdj],dir)]
            }
            if (this.grid.check(idi,jdj) && this.grid.get(idi,jdj)!=null){
                let level = adventurer.ori==dir ? adventurer.exitLevel : adventurer.entryLevel ; 
                i=idi;
                j=jdj;
                while (true){
                    if (i==0 && j==-1){ // exit the trap
                        return [new TempleTrap_Jump("!",this.adventurer,[i,j],path+dir)]
                    }
                    if (!this.grid.check(i,j)) break;  // out of the board
                    current = this.grid.get(i,j);
                    if (current == null) break; // hit the water
                    const res = current.traverse(dir,level);
                    if (res == null) break;
                    if ("d*xo<".includes(current.id)){
                        jumps.push(new TempleTrap_Jump("!",this.adventurer,[i,j],path+dir));
                        break;
                    } else
                        path+=dir;
                    [dir,level] = res;
                    [di,dj] = dir2didj[dir];
                    i+=di;
                    j+=dj;
                }   
            }
        }
        return jumps;
    }
    
    pieceSlide(){
        let jumps = [];
        const [holeI,holeJ] = this.grid.findIndex(v=>v==null)
        for (const [di,dj] of Object.values(dir2didj)){
            const i=holeI+di,j=holeJ+dj;
            if (this.grid.check(i,j) && !this.grid.get(i,j).hasAdventurer){
                const piece = this.grid.get(i,j)
                jumps.push(new TempleTrap_Jump(piece.id,[i,j],[holeI,holeJ]))
            }
        }
        return jumps;
    }
    
    possibleJumps(){
        return this.pieceSlide().concat(this.adventurerJumps())
    }
    
    isComplete(){
        return this.hasEscaped
    }
    
    play(jump){
        if (jump.id=="!" && jump.to.i==0 && jump.to.j==-1){
            this.hasEscaped=true;
        } else if (jump.id=="!"){ // move adventurer
            const piece = this.grid.get(jump.from.i,jump.from.j)
            piece.hasAdventurer=false;
            this.adventurer = [jump.to.i,jump.to.j];
            this.grid.get(this.adventurer).hasAdventurer=true;
            if (this.display!=null)
                translateSVG($("#adventurer"),jump.to.j,jump.to.i);
        } else { // move piece
            const fromI = jump.from.i, fromJ = jump.from.j;
            const piece = this.grid.get(fromI,fromJ);
            const toI = jump.to.i, toJ=jump.to.j;
            piece.i=toI;
            piece.j=toJ;
            this.grid.set(fromI,fromJ,null);
            this.grid.set(toI,toJ,piece);
            if (piece.drawing!=null)
                translateSVG(piece.drawing,jump.to.j,jump.to.i);
        }
    }
    
    undo(jump){
        if (jump.id=="!" && jump.to.i==0 && jump.to.j==-1){
            this.hasEscaped=false;
        } else 
            this.play(new TempleTrap_Jump(jump.id,jump.to,jump.from))
    }
    
}