import { svg, translate, rotate } from "./SVGtools.js"
export {dir2rot,dirInv,allDirs,nextDir,rotateXY,Jump,jumps2moves,jumpList,showMoves}

// some utility constants and functions
// rotation from the "down" orientation
const dir2rot = {"↑":[180,1,0],"→":[270,0,-1],"↓":[0,-1,0],"←":[90,0,1]}
const dir2rotDiag = {...dir2rot,
                     "↖︎":[135,1,1],"↘":[315,-1,-1],"↙︎":[225,1,-1],"↗︎":[45,-1,1]}
const dirInv = {"↑":"↓", "→":"←", "↓":"↑", "←":"→"}
const allDirs = Object.keys(dir2rot)
const allDirsDiag = Object.values(dir2rotDiag)

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
    constructor(from,to){  // from,to are arrays of two integers
        this.from = {i:from[0],j:from[1]}
        this.to   = {i:to[0],  j:to[1]}
        this.precedent = null; 
    }
    
    toString(){
        return `${this.from.i}@${this.from.j}=>${this.to.i}@${this.to.j}`
    }
    
    moveToString(){
        return `=>${this.to.i}@${this.to.j}`
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
    
    extend(previousJump){
        this.precedent = previousJump;
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
        let [di,dj] = this.direction();
        di = Math.sign(di)
        dj = Math.sign(dj)
        return allDirsDiag.find(([_,i,j])=>i==di && j==dj)[0]
        // if (di==0)
        //     return dj<0 ? 270 : 90;
        // return di<0 ? 0 : 180;       
    }
    
    // show default arrow 
    showArrow(stroke="black"){
        return svg("use",{href:"#arrow-def",class:"arrow",stroke:stroke,
            transform:translate(this.from.j,this.from.i)+
            rotate(this.rotation(),0.5,0.5)})
            .data({jump:this})
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

function showMoves(jumpsList){    
    let moves = []
    for (const jumps of jumpsList){
        moves.push(""+jumps[0]+jumps.slice(1).map(j=>j.moveToString()).join(""))
    }    
    return moves.join(", ");
}