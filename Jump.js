import {C} from "./C.js"
export {dir2rot,dirInv,allDirs,nextDir,rotateXY,Jump,jumps2moves,jumpList}

// some utility constants and functions
// rotation from the "down" orientation
const dir2rot = {"↑":[180,1,0],"→":[270,0,-1],"↓":[0,-1,0],"←":[90,0,1]}
const dirInv = {"↑":"↓", "→":"←", "↓":"↑", "←":"→"}
const allDirs = Object.keys(dir2rot)

function nextDir(dir,delta=1){
    if (delta==0) return dir;
    let dirNo=allDirs.indexOf(dir);
    return allDirs[(dirNo+delta)%4]
}

// unused yet, might be useful someday...
function rotateXY(dir,x,y){
    switch (dir) {
        case "↑" : return [x,y];
        case "→" : return [-y,x];
        case "↓" : return [-x,-y];
        case "←" : return [y,-x];
        default:
            console.log("bad dir",dir)
    }
}

class Jump {
    constructor(from,to){  // from,to are of type C or an array of two integers
        this.from = from instanceof C ? from : new C(from[0],from[1]),
        this.to   = to instanceof C ? to : new C(to[0],to[1]);
        this.precedent = null; 
    }
    
    toString(){
        return this.from+"=>"+this.to;
    }
    
    follows(pred){
        return (this.from.i == pred.to.i) && (this.from.j == pred.to.j);
    }
    
    isSameAs(that){
        return this.to.i == that.to.i && this.to.j == that.to.j && 
               this.from.i == that.from.i && this.from.j == that.from.j         
    }
    
    isImmobile(){
        return this.from.i == this.to.i && this.from.j == this.to.j;
    }
    
    extend(coups){
        this.precedent = coups;
        return this;
    }
    
    direction(){
        return [this.to.i-this.from.i,this.to.j-this.from.j]
    }
    
    arrow(){
        const [di,dj] = this.direction();
        if (di==0)
            return dj<0 ? "←" : "→";
        return di<0 ? "↑" : "↓"
    }
    
    //  rotation from the North that corresponds to this jump
    rotation(){
        const [di,dj] = this.direction();
        if (di==0)
            return dj<0 ? 270 : 90;
        return di<0 ? 0 : 180;       
    }
}

// combine jumps to moves
function jumps2moves(jumps){
    jumps = jumpList(jumps,[]).reverse();
    let last = jumps[0];
    let combined = [[last]];
    for (const jump of jumps.slice(1)){
        if (jump.follows(last))
            combined[combined.length-1].push(jump);
        else
            combined.push([jump])
        last=jump;
    }
    return [jumps,combined]
}

// find the inverse list of jumps by following jump links
function jumpList(lastJump,coups){
    if (lastJump==null) return coups;
    coups.push(lastJump);
    return jumpList(lastJump.precedent,coups); 
}