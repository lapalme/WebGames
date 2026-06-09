import {svg,translate,rotate} from "../SVGtools.js"
import {Piece} from "../Piece.js"
import {Jump,dir2rot,nextDir,allDirs} from "../Jump.js"

export {CityMaze_Piece, infosPiece, Path, SimpleTurn, DoubleTurn,deltas}
const DEBUG = false
// used for determining the exit of a turn
const deltas = {}
for (const dir in dir2rot){
    const [_,i,j]= dir2rot[dir];
    deltas[dir]={i:-i,j:-j}
}
// piece direction to rotation : Caution this differs from jump direction...
const pdir2rot = {"↑":0,"→":90,"↓":180,"←":270}

// configuration : piece,color,i,j,direction
// pièce
//  + : cross
//  * : start
//  S : Elbow
//  F : right-arrow
//  U : u-turn-rigth
//  W : u-turn-left
// color : B(blue) | R (red) if red piece must be inverted
// direction: arrow

//   information about blue pieces
const infosPiece = {
    "*B":{def_id:"#start", 
          positions:[[0,0], [-1,0], [-2,0], [-3,0]],
          ddir:0,
          canBeTurned:false},
    "+B":{def_id:"#cross",  
          positions:[[-1,0],[0,0],[1,0],[0,-1],[0,1]],
          ddir:0,
          canBeTurned:false},
    "FB":{def_id:"#arrow-left", 
          positions: [[0,0], [0,-1], [0,-2], [0,-3]],
          ddir:3,
          canBeTurned:true},
    "SB":{def_id:"#elbow-right", 
          positions: [[0,0], [0,1], [0,2], [0,3], [-1,3], [-2,3], [-3,3]],
          ddir:0,
          canBeTurned:true},
    "UB":{def_id:"#u-turn-right", 
          positions: [[0,0], [0,1], [0,2], [0,3], [1,3], [2,3], [3,3]],
          ddir:2,
          canBeTurned:true},
    "WB":{def_id:"#u-turn-left", 
          positions: [[0,0], [0,-1], [0,-2], [0,-3], [1,-3], [2,-3], [3,-3]],
          ddir:2,
          canBeTurned:true}
}

// add information about red pieces
for (const key in infosPiece){
    let {def_id,positions,ddir,canBeTurned} = infosPiece[key];
    if (def_id.includes("left"))def_id = def_id.replace("left","right")
    else if (def_id.includes("right"))def_id=def_id.replace("right","left");
    positions = positions.map(([i,j])=>[i,-j]); // invert positions for red
    if (key=="FB")ddir=1;
    infosPiece[key.charAt(0)+"R"]={"def_id":def_id,
                                    "positions":positions,
                                    "ddir":ddir,
                                    "canBeTurned":canBeTurned}
}
// add occupied and position at the end of all pieces both blue and red
for (const key in infosPiece){
    const info = infosPiece[key];
    info.occupied = {"↑":info.positions,
                     "→":info.positions.map(([i,j])=>[j,-i]),
                     "↓":info.positions.map(([i,j])=>[-i,-j]),
                     "←":info.positions.map(([i,j])=>[-j,i])};
    info.lastIJ={};
    ["↑","→","↓","←"].forEach(dir => info.lastIJ[dir] =
                    [Math.trunc(info.occupied[dir].at(-1)[0]/3),
                     Math.trunc(info.occupied[dir].at(-1)[1]/3)])          
}


class CityMaze_Piece extends Piece {
    constructor (id,i,j,kind,color,dir){
        super(id,i,j)
        this.kind=kind; 
        this.color=color
        this.dir = dir;
        this.di = null; // delta from the direction
        this.dj = null;
        this.iReserve=i; // position in the reserve area
        this.jReserve=j;
        this.changeMyInfos(infosPiece[this.kind+this.color]);
        this.drawing = null;
    }
    
    changeMyInfos(infos){
        this.def_id = infos.def_id;
        this.positions = infos.positions;
        this.ddir = infos.ddir;
        this.canBeTurned = infos.canBeTurned;
        this.occupied = infos.occupied;
        this.lastIJ = infos.lastIJ;     
    }

    toString(){
        return this.kind+this.color+this.i+this.j+this.dir
    }
    
    toState(){
        return this.toString()
    }
         
    isBlue(){
        return this.color=="B"
    }

    invertColor(positions){
        return positions.map(([i,j])=>[i,-j])
    }
    
    nextIJDir(i,j,dir){
        // const last = this.occupied[this.dir].at(-1)
        return [i+this.lastIJ[dir][0],j+this.lastIJ[dir][1],nextDir(dir,this.ddir)]
    }
    
    legalPositions(grid,newI,newJ,pos){
        for (const [i,j] of pos){
            const i0 = newI*3+1+i;
            const j0 = newJ*3+1+j;
            if (i0<0 || i0>=grid.M || j0<0 || j0>=grid.N){
                // console.log("sort du jeu",this.id,newI,newJ,i0,j0);
                return false  // out of the board
            }
            if (grid.get(i0,j0)!="."){
                // console.log("chevauchement",this.id,newI,newJ,i0,j0,plateau.libres[i0][j0])
                return false // overlaps another piece
            }
        }
        return true;
    }
    
    turn(board,i=this.i,j=this.j){
        if (!this.canBeTurned) return null;
        let dirNo= allDirs.indexOf(this.dir);
        for (let k=1;k<4;k++){
            board.setGrid(this,".");
            dirNo = (dirNo+1)%4;
            const newDir = allDirs[dirNo];
            // console.log("essai de tourner",this.id,newDir);
            if (j >= board.grid.N ||this.legalPositions(board.grid,i,j,this.occupied[newDir])){
                return newDir;
            }
            board.setGrid(this,this.kind);
        }
        return null
    }    
    
    draw(){
        this.drawing = svg("use",{href:this.def_id,id:"P"+this.id,
                                   transform: this.transform()},
                svg("title",{},this.kind+this.color))
                .addClass(this.color=="B"?"bleu":"rouge").data({piece:this})
    }
       
    transform(){
        return translate(this.j,this.i)+" "+rotate(pdir2rot[this.dir],0.5,0.5)
    }
    
    update(){
        if (this.drawing==null) return 
        return this.drawing.attr("transform",this.transform())
    }
    
    possibleJumps(grid){
        // TODO
    }
}


function $dessin(id,href,i,j){
    const g = svg("g",{id:id,transform: translate(j,i)},
        svg("use",{href:href},svg("title",{},`${i},${j}`)))
    if (DEBUG){
        // afficher les x,y
        // g.append(svg("text",{"alignment-baseline":"hanging","font-size":"4px"},
        //                 `${W3*j}@${W3*i}`))
        // afficher les i,j
        g.append(svg("text",{x:W3/2,y:W3/2,"text-anchor":"middle","alignment-baseline":"middle",
                       "font-size":"4px"},`${i},${j}`))
    }
    return g
}

class Path extends Piece {
    constructor(id,i,j){
        super(id,i,j)
    }
    toString(){
        return this.id
    }
    
    nextIJDir(i,j,dir){
        const delta=deltas[dir];
        return [i+delta.i, j+delta.j, dir]
    }
    
    draw(){
        this.drawing = $dessin(this.id,"#path",this.i,this.j).data({piece:this})        
    }
}

class SimpleTurn extends Path {
    constructor(id,i,j){
        super(id,i,j);
    }
    
    nextIJDir(i,j,dir){
        if ("↑←".indexOf(dir)<0) 
            throw new Error("Bad entrance in a simple turn+"+dir)
        if (dir == "↑")return [i,j+1,"→"]
        return [i+1,j,"↓"] 
    }
    
    draw(){
        this.drawing = $dessin(this.id,"#virage-simple",this.i,this.j).data({piece:this})       
    }
}

class DoubleTurn extends Path {
    constructor(id, i,j){
        super(id,i,j);
    }
    
    nextIJDir(i,j,dir){
        switch (dir){
            case "↑": return [i,j+1,"→"];
            case "←": return [i+1,j,"↓"];
            case "↓": return [i,j-1,"←"];
            case "→": return [i-1,j,"↑"];
            default:
                throw new Error("Bad entrance in a double turn+"+dir)
        }
    }
    
    draw(){
        this.drawing = $dessin(this.id,"#virage-double",this.i,this.j).data({piece:this})        
    }
}
