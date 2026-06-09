import {svg,translate,rotate,cText} from "../SVGtools.js"
import {Piece} from "../Piece.js"
import {Jump,allDirs,nextDir,dirInv} from "../Jump.js"

export {TempleTrap_Piece}

// // with a North orientation  [entry:(orientation + level),exit:(orientation+level)]
// //   when 1 it has a hole for the adventurer
// d, *  : [S1,N2]  
// x,o,< : [S1,E1]
// =,s : [S2,E2]
// +   : [S2,N2]

// kind of piece :
const straight = {"↑": ["↑","↑"], "→":["→","→"], "↓":["↓","↓"], "←":["←","←"]};
const angle    = {"↑": ["↑","→"], "→":["→","↓"], "↓":["↓","←"], "←":["←","↑"]};  

function isVertical(dir){
    return dir=="↓" || dir=="↑"
}

const w=0.2 ; // same as in TempleTrap_Display.js

class TempleTrap_Piece extends Piece {
    constructor (id,i,j,ori){
        super(id,i,j)
        this.ori=ori;
        this.hasAdventurer=false;
        // compute entry and exit according to the orientation
        switch (this.id) {
            case "d": case "*": // N<->S
                this.entryLevel=1
                this.exitLevel=2;
                [this.entryDir,this.exitDir]=straight[ori]
                break;
            case "+": // N<->S
                this.entryLevel=2
                this.exitLevel=2;
                [this.entryDir,this.exitDir]=straight[ori]
                break;
            case "x":case "o": case "<": // S <-> E
                this.entryLevel=1
                this.exitLevel=1;
                [this.entryDir,this.exitDir]=angle[ori];
                break;
            case "=": case "s": // S <-> E
                this.entryLevel=2;
                this.exitLevel=2;
                [this.entryDir,this.exitDir]=angle[ori];
                break;
            default:
                console.log("strange piece",this.id)
                debugger;
                break;
        }
    }
    
    // check if this piece can be entered from dir at level
    // return null if it cannot go through 
    //        [dir, level] of the exit
    traverse(dir,level){
        if ("d*+".includes(this.id)){// N<->S
            if (isVertical(dir)!=isVertical(this.ori)) return null;
            if (this.entryDir==dir){
                if (this.entryLevel != level) return null;
                return [this.exitDir,this.exitLevel]
            } else {
                if (this.exitLevel != level) return null;
                return [dirInv[this.entryDir],this.entryLevel];
            }
        } else { // S <-> E
            if (dir==this.entryDir){
                if (this.entryLevel!=level) return null;
                return [this.exitDir,this.exitLevel]
            } else if (dirInv[dir]==this.exitDir){
                if (this.exitLevel!=level) return null;
                return [dirInv[this.entryDir],this.entryLevel]
            }
            return null;
        }
    }
    
    toString(){
        return (this.hasAdventurer?"!":"")+this.entryLevel+this.entryDir+this.id+this.exitLevel+this.exitDir
    }
    
    toState(){
        return [this.id,this.i,this.j,this.ori]
    }
        
    draw(){
        const sym ={"d":"◇","s":"□","<":"◁","*":"✱"}[this.id] || this.id
        const defIds = {"d":"#straight1-2","*":"#straight1-2",
                        "+":"#straight2",
                        "x":"#angle1","o":"#angle1","<":"#angle1",
                        "=":"#angle2","s":"#angle2"}
        this.drawing = svg("g",{transform:translate(this.j,this.i)+rotate(this.ori,0.5,0.5)},
                svg("use",{href:defIds[this.id]}),
                cText(sym,w/2,w/2,"black",0.2),
                svg("rect",{x:0,y:0,width:1,height:1,fill:"none",stroke:"black","stroke-width":0.01})
        )   
        return this.drawing;
    }
}
