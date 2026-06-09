import {svg, translateSVG, rotateSVG, translate,rotate,makePoints } from "../SVGtools.js"
import {Board} from "../Board.js"
import {Grid} from "../Grid.js"
import {Jump,allDirs,dir2rot,dirInv} from "../Jump.js"
import {LaserMaze_Piece,allOris} from "./LaserMaze_Piece.js"
import { LaserMaze_Jump } from "./LaserMaze_Jump.js"

export {LaserMaze_Board,showMoves,M,N}

function showMoves(jumpsList){
    let pieces=[];
    // keep only the last move of each piece
    for (const jumps of jumpsList){
        const jump = jumps.at(-1);
        const to = jump.to;
        const infos = jump.id.charAt(0)+to.i+to.j+jump.newOri;
        const idx = pieces.findIndex(p=>p.id==jump.id);
        if (idx<0) pieces.push(infos)
        else pieces[ids] = infos;
    } 
    return pieces.join(", ")
    // return jumpsList.map(e=>e.toString()).join();
}

const M=5,N=5;

const outDiDj = {}
for (const dir in dir2rot){
    outDiDj[dir]=dir2rot[dirInv[dir]].slice(1,3)
}
const ori2dir = {"S":"↓", "W":"←", "N":"↑", "?":"↑", "E":"→"}
const ori2rot = {"N":0,"E":90,"S":180,"W":270}

// Important: Piece have an "orientation" but the path out of the laser has a direction

class LaserMaze_Board extends Board {
    constructor (no,state,display){
        super(no,state,display);
        LaserMaze_Piece.no=1; // reinit pieces numbering
        this.grid = new Grid(M,N);
        this.laser = null;
        const {reserve,targets,pieces}=JSON.parse(state);
        this.reserve = reserve.map(s=>LaserMaze_Piece.fromState(s)); 
        this.reserve.forEach((p,j)=>{// useful for the GUI 
            p.canBeMoved=true;
            p.posInReserve=j;
        });
        this.nbPieces = this.reserve.length; 
        const idx = this.reserve.findIndex(p=>p.kind=="R")
        if (idx>=0) this.laser=this.reserve[idx];       
        this.targets = targets;
        this.pieces = pieces.map(s=>LaserMaze_Piece.fromState(s))
        this.obTargets = []
        for (const piece of this.pieces){
            this.grid.set(piece.i,piece.j,piece);
            if (piece.obligatoryTarget)this.obTargets.push(piece)
            if (piece.kind !="#")this.nbPieces++;
        }
        if (this.laser==null){
            const idx = this.pieces.findIndex(p=>p.kind=="R")
            if (idx>=0)this.laser = this.pieces[idx] 
        }
        if (this.laser==null){
            console.log("*** no laser in the game");
            debugger;
        }
        if (display != null) // this call must come after pieces have been added
            display.setBoard(this);
    }

    toState(){
        return JSON.stringify({reserve:this.reserve.map(p=>p.toState()),
                               targets:this.targets,
                               pieces:this.pieces.map(p=>p.toState())})      
    }
    
    toString(){
        return this.grid.show(8)
    }
    
    // Launch a ray from [i,j] in a given direction "arrow"
    // Update the path of empty spaces and pieces traversed
    // HACK: a recursive exploration of all paths
    fire(i,j,dir,grid,path){
        // straight ray (skipping block)
        const [di,dj] = outDiDj[dir];
        i=i+di,j=j+dj;
        while (grid.check(i,j)){
            const piece = grid.get(i,j);
            if (piece == null || piece.kind == "#"){
                path.push([i,j])
                i+=di; j+=dj;
            } else {
                const piece = grid.get(i,j);
                if (piece.kind=="P" && piece.targetTouched(dir)){
                    path.push([piece.id,i,j,dir,piece.obligatoryTarget ? "*" : "$"]);
                } else {
                    // check for loop in path and stop there
                    // a loop happens when trying to add a piece at the same place with the same direction
                    if (path.findIndex(([pid,i,j,pdir])=>piece.id == pid && pdir==dir)>=0){
                        return
                    }
                    path.push([piece.id,i,j,dir])
                    if (piece.inputs().includes(dir)){
                        let outputs = piece.outputs(dir);
                        // recursive call...
                        this.fire(i,j,outputs[0],grid,path) 
                        if (outputs.length>1){
                            this.fire(i,j,outputs[1],grid,path)
                        }
                    }
                }
                return;
            } 
        }
    }    
    
    
    possibleJumps(){
        // filter laser moves to ignore trivially useless jumps that send a ray directly on the border
        function filterLaserJump(i,j,ori){
            switch (ori) {
                case "N": return i>0;
                case "E": return j<N-1;
                case "S": return i<M-1;
                case "W": return j>0
                default:
                    console.log("filterLaserJump:bad orientation",jump.newOri)
            }
        }
        let temp = this.grid.copy();
        let jumps = [],newI,newJ;
        const lIdx = this.reserve.findIndex(p=>p.kind=="R")
        // if the laser is in the reserve, place it in all free spaces with all rotations
        if (lIdx>=0){
            const l = this.reserve[lIdx] // remove laser from the reserve
            this.grid.forEach((newI,newJ,v)=>{
                if (v==null)
                    for (const ori of allOris)
                        if (filterLaserJump(newI,newJ,ori))
                            jumps.push(new  LaserMaze_Jump([l.i,l.j],[newI,newJ],l.id,ori))
            })
            return jumps;
        }        
        // we are sure that the laser is on the board
        const l = this.laser;
        if (l.ori=="?"){ // this happens only once for a rotatable laser 
            for (const ori of allOris){
                if (filterLaserJump(l.i,l.j,ori))
                    jumps.push(new  LaserMaze_Jump([l.i,l.j],[l.i,l.j],l.id,ori))
            }
            return jumps;
        }
        let myReserve = [] // consider only one piece of each type in the reserve
        for (const p of this.reserve){
            const idx = myReserve.findIndex(e=>e.kind==p.kind);
            if (idx<0)myReserve.push(p)
        }
        //  add pieces from the reserve on the free spaces of the ray from the laser
        let path = []
        this.fire(l.i,l.j,ori2dir[l.ori],temp,path) // find the path from the laser
        for (const elem of path){
            if (elem.length == 2){ // a free space
                [newI,newJ] = elem;
                if (this.grid.get(newI,newJ)!=null)continue; //skip block
                // add from the reserve 
                for (const p of myReserve){
                    for (const ori of p.getOrientations())
                        jumps.push(new LaserMaze_Jump([p.i,p.j],[newI,newJ],p.id,ori))
                }
            } else { // a piece that might be rotated
                [newI,newJ] = elem.slice(1,3);
                const piece = this.grid.get(newI,newJ);
                if (piece.canBeRotated){
                    for (const ori of piece.getOrientations())
                        if (ori != piece.ori)
                            jumps.push(new LaserMaze_Jump([piece.i,piece.j],[piece.i,piece.j],piece.id,ori))                        
                }
            }
        }
        return jumps
    }
    
    isComplete(){
        if (this.reserve.length>0) return false; // all pieces must be on the board
        let path = []
        const l = this.laser; // find the path
        this.fire(l.i,l.j,ori2dir[l.ori],this.grid,path);
        // quick check that at least the number of targets have been touched
        if (path.filter(e=>e.length==5).length < this.targets) return false
        // check that all pieces have been touched
        let piecesSet = new Set(this.pieces.filter(p=>p.kind!="R" && p.kind!="#").map(p=>p.id));
        let obTargetSet = new Set(this.obTargets.map(p=>p.id))
        for (const pElem of path){
            if (pElem.length>2){// skip empty places
               const [pid,i,j,dir,tgt] = pElem
               piecesSet.delete(pid)
               if (tgt=="*")
                   obTargetSet.delete(pid) 
            }
        }
        return piecesSet.size==0 && obTargetSet.size==0;
    }
    
    play(jump){
        if (jump.from.i<0){  // take from the reserve
            const idx = this.reserve.findIndex(p=>p.id==jump.id);
            if (idx<0) debugger;
            const newI = jump.to.i, newJ = jump.to.j;
            const piece = this.reserve.splice(idx,1)[0];
            if (piece.kind=="R"){
                this.laser=piece;
                if(piece.ori=="?")piece.ori="N";
            } 
            piece.ori=jump.newOri;                
            piece.i = newI;
            piece.j = newJ;
            this.grid.set(jump.to.i,jump.to.j,piece);
            this.pieces.push(piece);
            if (this.display){
                translateSVG(piece.drawing,piece.j,piece.i);
            }
        } else {
            const newI = jump.to.i, newJ = jump.to.j;
            const piece = this.grid.get(jump.from.i,jump.from.j);
            if (jump.from.i != newI || jump.from.j != newJ) { 
                // move within the board (only on the GUI)
                this.grid.set(jump.from.i,jump.from.j,null);
                piece.i = newI;
                piece.j = newJ;
                if (newI>=0)
                    this.grid.set(newI,newJ,piece);
                else { // remove from pieces and place in reserve
                    this.pieces.splice(this.pieces.findIndex(p=>p==piece),1);
                    this.reserve.push(piece);
                    piece.i = -1.5;
                }
                if (this.display){
                    translateSVG(piece.drawing,piece.j,piece.i)
                }
            } else { // rotate an existing piece
                piece.ori = jump.newOri;
                if (this.display){
                    rotateSVG(piece.drawing,ori2rot[piece.ori],0.5,0.5)
                }
            }
        }
    }
    
    showRay(){
        const lang = $("input[name='lang']:checked").val();
        let path,touched,targets,obligatoryTargets;
        
        // draw a North oriented unit arrow (so y=-1) with the appropriate translation and rotation
        // the difficulty being to determine the end around the target...
        function showArrow(x1,y1,x2,y2,piece,touched){
            const rot = new Jump([y1,x1],[y2,x2]).rotation();
            let obl;
            // find y, the length of the arrow, depending on the piece
            let y;
            if (piece==null){ 
                y=-1;
                obl = false;
            } else {
                obl = piece.obligatoryTarget;
                if (piece.kind == "R"){ y=-0.5;
                } else if (piece.kind != "P"){ y=-1;
                } else { // we are sure that this a P                
                    if (touched){
                        y=-0.7;
                        if (piece.canBeRotated && obl){y= -1}
                    } else {
                        y = -1;
                    }
                }
            }
            $ray.append(
                svg("g",{transform:rotate(rot,x1,y1)+translate(x1,y1)},
                     svg("line",{x1:0,y1:0,x2:0,y2:y}),
                     touched // add a target or an arrow head
                       ? svg("circle",{cx:0,cy:y,r:0.13,fill:obl ? "none" : "orange"})
                       : svg("polyline",{points:makePoints([-0.05,y+0.05, 0,y, 0.05,y+0.05])}) 
                )
            )
        }
        
        // quite similat in the process to the LazerMaze_Board.fire
        // but it appends to the $ray       
        function fire(i,j,x1,y1,dir,grid){
            // straight ray (skipping block)
            let x2,y2;
            const [di,dj] = outDiDj[dir];
            i=i+di,j=j+dj;
            while (grid.check(i,j)){
                const piece = grid.get(i,j);
                if (piece == null || piece.kind == "#"){
                    x2=j+0.5; y2=i+0.5;                    
                    showArrow (x1,y1,x2,y2,piece,false)
                    i+=di; j+=dj;
                    x1=x2; y1=y2;
                } else {
                    x2=j+0.5; y2=i+0.5;
                    // check for loop in path and stop there
                    // a loop happens when trying to add a piece at the same place with the same direction
                    if (path.has(piece.id+dir)) return
                    if (piece.kind=="P" && piece.targetTouched(dir)){
                        if (piece.obligatoryTarget)obligatoryTargets++;
                        showArrow (x1,y1,x2,y2,piece,true);
                        path.add(piece.id+dir)
                        targets++;                  
                    } else {
                        showArrow (x1,y1,x2,y2,piece,false)
                        path.add(piece.id+dir)
                        if (piece.inputs().includes(dir)){
                            let outputs = piece.outputs(dir);
                            fire(i,j,x2,y2,outputs[0],grid)
                            if (outputs.length>1){
                                fire(i,j,x2,y2,outputs[1],grid)
                            }
                        }
                    }
                    return
                }
            }
        }
        const $ray = $("#ray");
        $ray.empty();
        obligatoryTargets=0;
        const l = this.laser;
        if (l.i>=0) {
            let x1=l.j+0.5,y1=l.i+0.5, dir= ori2dir[l.ori];
            path=new Set([l.id+dir]); 
            targets=0;
            // do a recursive traversal of the path (needed because of the green tiles)
            fire(l.i,l.j,x1,y1,ori2dir[l.ori],this.grid);
            // remove dir from path to get only pieces touched (remove dir)
            touched = new Set();
            path.forEach(e=>{touched.add(e.slice(0,-1))})
            $("#infos").text(
                lang=="en" ? 
                (`Touched: ${touched.size} / ${this.nbPieces}. Targets: ${targets} / ${this.targets}. `+
                (this.obTargets.length>0 ? `Mandatory: ${obligatoryTargets} / ${this.obTargets.length}`:""))
                : (`Touchées: ${touched.size} / ${this.nbPieces}. Cibles: ${targets} / ${this.targets}. `+
                (this.obTargets.length>0 ?`Obligatoires: ${obligatoryTargets} / ${this.obTargets.length}`:""))
            )
        }
    }
    
    undo(jump){
        const [i1,j1] = [jump.from.i,jump.from.j];
        const [i2,j2] = [jump.to.i,jump.to.j];
        let newOri = jump.ori;
        // compute reverse rotation for a piece on the board
        if (i2>=0 && i1==i2 && j1==j2){ 
            const piece = this.pieces[this.pieces.findIndex(p=>p.id==jump.id)]
            if ("BGY".includes(piece.kind))newOri = piece.nextOrientation()
            else {
                let idx=allOris.findIndex(o=>o==jump.newOri);
                newOri = allOris[(idx+3)%4]
            }
        } 
        this.play(new LaserMaze_Jump(jump.to,jump.from,jump.id,newOri))   
    }
    
}