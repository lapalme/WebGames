import {svg,makePoints,translate,translateSVG,rotateSVG,getPos} from "../SVGtools.js"
import {Board} from "../Board.js"
import {Grid} from "../Grid.js"
import {CM_Jump} from "./CM_Jump.js"
import {C} from "../C.js"
import { nextDir } from "../Jump.js"
import {CityMaze_Piece, infosPiece, Path,SimpleTurn,DoubleTurn,deltas} from "./CityMaze_Piece.js"

export {M,N,CityMaze_Board,showMoves,positionsReserve}

const M=6, N=6;
const N3 = N*3;
const dir2let = {"↑":"N","→":"E","↓":"S","←":"O"}

const positionsReserve = 
    {"B": [["F",0,N+1],["F",0,N+3],
           ["U",1,N],  ["S",2,N+2],
           ["W",3,N+1],["W",3,N+3]],
     "R":[["F",0,N],  ["F",0,N+2],
          ["U",1,N+1],["S",2,N+3],
          ["W",3,N],  ["W",3,N+2]]}


// get information about a piece in a state
// pièce
//  + : cross
//  ↑ : start
//  S : elbow
//  F : flèche-right
//  U : u-turn-right
//  W : u-turn-left
// color : B(blue) | R (red) if red invert piece
// direction: ↑|→|↑|←

const configRE= /(?<kind>[+*SFUW])(?<color>[RB])(?<i>\d)(?<j>\d)(?<dir>↑|→|↓|←)?/

function showMoves(jumpsList){ 
    return jumpsList.flat().join(", ");
}


class CityMaze_Board extends Board {
    constructor (no,stateS,display){
        super(no,stateS,display);
        // the grid is quite complex because of pieces have shapes overlapping
        // many cells...
        this.grid = new Grid(N3,N3)
        for(let i=0;i<N3;i++){
			for(let j=0;j<N3;j++){
				if(i<3&&j<3 || (i>=6&&i<9 && j>=9&&j<12)) 
					this.grid.set(i,j,'X');  // Turn
				else
					this.grid.set(i,j,(i%3==1||j%3==1)?'.':'X');  // path
			}
        }
        this.paths = [];
        // set the allowed paths 
        let path;
        for (let i=0;i<M;i++){
            const rowP=[];
            for (let j=0;j<N;j++){
                if (i==0 && j==0){path=new SimpleTurn(`ST${i}${j}`,i,j)}
                else if (i==2 && j==3){path=new DoubleTurn(`DT${i}${j}`,i,j)}
                else path=new Path(`P${i}${j}`,i,j);
                rowP.push({path:path,piece:null})
            }
            this.paths.push(rowP);
        }    
        
        
        this.pieces = [];
        // create pieces
        CityMaze_Board.fromState(this,stateS);
        // add pieces to paths
        for (const piece of this.pieces){
            if (piece.j<N){
                this.paths[piece.i][piece.j].piece=piece;
                this.setGrid(piece,piece.kind);
             }               
        }
        if (display != null) {// this call must come after pieces have been added
            display.setBoard(this);
            this.showPath()
        }
    }
    
    showPiecePositions(){
        const pieceGrid = new Grid(M,N);
        for (let i=0;i<M;i++)
            for (let j=0;j<N;j++){
                const p = this.paths[i][j].piece
                if (p!=null)pieceGrid.set(i,j,p.kind+p.color+p.dir)
            }
        return pieceGrid.show(4)   
    }

    toString(){
        return this.showPiecePositions()
    }

    toState(){
        return this.pieces.filter(p=>p.j<N).map(p=>p.toState()).sort().join(" ")
    }
    
    static fromState(self,stateS){
        let alreadyThere=[];
        self.nbCrosses={"B":0,"R":0};
        self.start ={"B":null,"R":null};
        let no=1;
        // check the type of problem
        if (stateS.includes("*B") && stateS.includes("*R"))
            self.express=null
        else if (stateS.includes("*B"))
            self.express="B"
        else if (stateS.includes("*R"))
            self.express="R"
        else 
            throw new Error("Configuration wihtout any B ou R state",stateS)
        // parse the state string
        const pieceS = stateS.split(" ")
        for (const s of pieceS){
            const m = configRE.exec(s);
            if (m==null){
                throw new Error(`bad configuration:${s} in ${stateS}`)
            }
            const g=m.groups;
            const i=parseInt(g.i);
            const j=parseInt(g.j);
            let piece = new CityMaze_Piece(no++,i,j,g.kind,g.color,g.dir);
            if (g.kind=="+")self.nbCrosses[g.color]++;
            else if (g.kind=="*")self.start[g.color]=piece;
            else if ("FSUW".includes(g.kind)){
                alreadyThere.push(piece)
            }
            self.pieces.push(piece);
        }
        
        // build reserve
        if (self.express!=null){  // a single color
            for (const [kind,i,j] of positionsReserve[self.express]){
                const idx = alreadyThere.findIndex(p=>p.kind==kind && !p.checked)
                if (idx<0)
                    self.pieces.push(new CityMaze_Piece(no++,i,j,kind,self.express,"↑"))
                else {
                    alreadyThere[idx].checked=true;
                    alreadyThere[idx].iReserve=i;
                    alreadyThere[idx].jReserve=j;
                }
            }
        } else {   // two colors...
            for (let k=0;k<6;k++){
                const [kind,i,j] = positionsReserve["B"][k];
                const idx = alreadyThere.findIndex(p=>p.kind==kind && !p.checked);
                if (idx<0)
                    self.pieces.push(new CityMaze_Piece(no++,i,j,kind,"B","↑"));
                else {
                    alreadyThere[idx].checked=true
                    alreadyThere[idx].iReserve=i;
                    alreadyThere[idx].jReserve=j;
                }
            }
        } 
    }
    
    getPath(piece){
        return this.paths[piece.i][piece.j]
    }

    rotation(piece){
        if (piece.j>=N){ // in the reserve
            piece.dir = nextDir(piece.dir);
            piece.update()
        } else if (piece.canBeTurned){
            const newDir=piece.turn(this);              
            if (newDir != null){
                piece.dir = newDir;
                this.setGrid(piece,piece.kind);
                piece.update();
            }
        }
    }
    
    // update free spaces for a given piece
    setGrid(piece,val){
        if (piece.j>=N) return;
        for (const [i,j] of piece.occupied[piece.dir]){
            const newI = piece.i*3+1+i;
            const newJ = piece.j*3+1+j;
            if (val != "." && this.grid.get(newI,newJ)==val){
                console.log("inconsistency: %s:%d@%d:%s",val,newI,newJ,piece)
                throw new Error("this should never happen")
            }
            if (newI<0 || newJ <0 || newI>=N3 || newJ>=N3){
                console.log("setGrid: strange",piece.id,newI,newJ,val)
            }
            this.grid.set(newI,newJ,val);
        }
    }

    // update paths and grid after moving a piece to a new place and new direction
    update(piece,newI,newJ,newDir){
        if (piece.j<N){
            this.paths[piece.i][piece.j].piece=null;
            this.setGrid(piece,".")
        }
        piece.i=newI;
        piece.j=newJ;
        if (newJ<N){
            this.paths[newI][newJ].piece=piece;
            if (newDir) piece.dir=newDir; 
            this.setGrid(piece,piece.kind);
        } else {
            if (newDir) piece.dir=newDir;        
        }
        if (this.display)   
            $("title",piece.drawing).text(piece.kind+piece.color+piece.i+piece.j+piece.dir)
    }

    play(jump){
        const newI=jump.to.i, newJ=jump.to.j;
        let idx = this.pieces.findIndex(p=>p.i==jump.from.i && p.j==jump.from.j);
        if (idx<0)debugger;
        let piece = this.pieces[idx]
        if (piece.color != jump.color){
            piece = new CityMaze_Piece(piece.id,piece.i,piece.j,piece.kind,jump.color,jump.dir);;
            this.pieces[idx]=piece;
        }
        let newDir = jump.dir;
        // this.setGrid(piece,".");                
        if (newJ>=N){
            this.update(piece,piece.iReserve,piece.jReserve,"↑");
        } else {
            // can we follow the current path
            const [path,_x] = this.freePaths(this.getPath(this.start[piece.color]));
            const idx = path.findLastIndex(([i,j,newDir])=>i==newI &&j==newJ)
            if (idx>=0){
                newDir = path[idx][2];
                if (piece.legalPositions(this.grid,newI,newJ,piece.occupied[newDir])){
                    this.update(piece,newI,newJ,newDir);
                    piece.update();
                    return;
                }
            } 
            // check is move is legal
            if (piece.legalPositions(this.grid,newI,newJ,piece.occupied[newDir])){
                // we can move without turning
                this.update(piece,newI,newJ)
            } else if ((newDir = piece.turn(this,newI,newJ))!=null){
                // try to rotate at the same place 
                this.update(piece,newI,newJ,newDir);
                jump.dir = newDir;
            } else {
                // come back to the original place
                this.update(piece,piece.i,piece.j)
                jump.to.i=piece.i;
                jump.to.j=piece.j;
                jump.dir="↑";
            }
        }
        piece.update();
    }
    
    findPath(draw, color){
        const start = this.start[color];
        let $ray, translateS,$svg_element;
        if (draw && this.display){
            $svg_element = $("#svg_element");
            $ray = $("#ray-"+(color=="B"?"bleu":"rouge"));
            $ray.empty();
        }
        let piecesOfPath = [];
        let newI = start.i;
        let newJ = start.j;
        let newDir = start.dir;
        let current = this.paths[newI][newJ];
        let crossesSeen = 0;
        // set of pieces already seen to avoid infinite loop, except for a cross that can be crossed again
        let piecesSeen = new Set()
        while (true){
            if (draw)
                translateS = translate(current.path.j,current.path.i);
            if (current.piece != null && (current.piece.color==color) && 
                (current.piece.kind=="+" || current.piece.dir==newDir)){
                const piece = current.piece;
                piecesOfPath.push(piece)
                if (draw && piece.kind!="*") // demi-chemin à l'entrée de la pièce
                    $ray.append(svg("use",{href:"#half-ray-"+dir2let[newDir],
                                               transform:translateS}));
                if (piece.kind=="+"){
                    if (draw) 
                        $svg_element.append(svg("use",{href:"#target",transform:translateS,class:"target"}))
                    if(!piecesSeen.has(piece.id)){
                        piecesSeen.add(piece.id);
                        crossesSeen++;
                    }
                    if (this.express && crossesSeen==this.nbCrosses[color]){
                        break;
                    }
                } else if (piecesSeen.has(piece.id)){
                    break;
                } else {
                    piecesSeen.add(piece.id)
                }
                // exit path of the piece
               [newI,newJ,newDir] = piece.nextIJDir(piece.i,piece.j,newDir)
                // draw the half-path of the exit
                if (draw)
                    $ray.append(rotateSVG(svg("use",{href:"#half-ray-"+dir2let[newDir],
                                                     transform:translate(newJ,newI)}),180,0.5,0.5));                
                // go to the next path
                const delta=deltas[newDir];
                newI = newI+delta.i;
                newJ = newJ+delta.j;
            } else {// path
                const path = current.path
                if (path instanceof SimpleTurn){
                    if (draw)
                        $ray.append(rotateSVG(svg("use",{href:"#curved-ray",transform:translateS}),180,0.5,0.5));
                    [newI,newJ,newDir] = path.nextIJDir(newI,newJ,newDir);
                } else if (path instanceof DoubleTurn){
                    if (newDir=="↑"||newDir=="←"){ // virage du bas (arrive par N ou O)
                        if (draw)
                            $ray.append(rotateSVG(svg("use",{href:"#curved-ray",transform:translateS}),180,0.5,0.5));
                     } else { // virage du haut (arrive par S ou E)
                        if (draw)
                            $ray.append(svg("use",{href:"#curved-ray",transform:translateS}));
                    }
                    [newI,newJ,newDir] = path.nextIJDir(newI,newJ,newDir);
                } else {
                    const dir_path = (newDir=="↑"||newDir=="↓")?"NS":"OE";
                    if (draw)
                        $ray.append(svg("use",{href:"#ray-"+dir_path,transform:translateS}));
                    [newI, newJ, newDir] = path.nextIJDir(newI,newJ,newDir); 
                }
            }
            if (newI<0 || newI >=N || newJ <0 || newJ>=N) break;
            current=this.paths[newI][newJ];
        }
        return [piecesOfPath,crossesSeen];
    }

    showPath(){
        let piecesOfRay = {rouge:null,bleu:null};
        let nbCrosses = {rouge:0,bleu:0};
        let termine;
        if (this.express==null){
            [piecesOfRay["R"],nbCrosses["R"]]=this.findPath(true,"R");
            [piecesOfRay["B"],nbCrosses["B"]]=this.findPath(true,"B"); 
            termine = nbCrosses["R"]==this.nbCrosses["R"] && nbCrosses["B"]==this.nbCrosses["B"]; 
         } else {
            [piecesOfRay[this.express],nbCrosses[this.express]]=this.findPath(true,this.express);
            termine = nbCrosses[this.express]==this.nbCrosses[this.express];
        }
    }


    // returns the coordinate lists of free paths on the path from the piece up to
    // exit or end (adaptation of findPath)
    //   current can be a path or a piece, but it starts with a piece (a start!)
    freePaths(current){  
        let piece = current.piece;
        let newI = piece.i;
        let newJ = piece.j;
        let newDir = piece != null ? piece.dir : "↑";
        let color = piece.color;
        let piecesSeen = new Set();
        let crossesSeen = 0;
        let paths = []
        while (true){
            if (current.piece !=null && current.piece.color==color &&
                (current.piece.kind=="+" || current.piece.dir==newDir)){
                piece = current.piece; // it is a piece    
                if (piece.kind=="+"){
                    if(!piecesSeen.has(piece.id)){
                        piecesSeen.add(piece.id);
                        crossesSeen++;
                    }
                    if (crossesSeen==this.nbCrosses[color])break;
                } else 
                if (piecesSeen.has(piece.id)) break;
                else 
                    piecesSeen.add(current.piece.id);
                // exit of the piece
               [newI,newJ,newDir] = piece.nextIJDir(piece.i,piece.j,newDir)               
                // goto next path
                const delta=deltas[newDir];
                newI = newI+delta.i;
                newJ = newJ+delta.j;
            } else {// a path
                if (this.grid.get(newI*3+1,newJ*3+1)==".")  // insure this cell is free
                    paths.push([newI,newJ,newDir])// and not overlapped by a part of another piec
                const res = current.path.nextIJDir(newI,newJ,newDir);
                [newI,newJ,newDir] = res;
            }
            if (newI<0 || newI >=N || newJ <0 || newJ>=N) break;
            current=this.paths[newI][newJ];
        }
        return [paths,crossesSeen];   
    }

    possibleJumps(){
        let jumps=[];
        const colors = this.express==null ? ["B","R"] : [this.express]
        const piecesToTry  = this.pieces.filter(p=>p.j>=N);
        for (const color of colors){
            const [paths,_] = this.freePaths(this.getPath(this.start[color]));
            for (const piece of piecesToTry){
                let occupied = piece.occupied,  _ = 0;
                if (this.express==null && piece.color != color){
                    occupied = infosPiece[piece.kind+color].occupied;
                } 
                for (const [i,j,dir] of paths){
                    if (piece.legalPositions(this.grid,i,j,occupied[dir])){
                        const jump = new CM_Jump(new C(piece.i,piece.j),new C(i,j),piece.kind,color,dir);
                        const idx = jumps.findIndex(j=>j.isSameAs(jump))
                        if (idx<0)jumps.push(jump)
                    }
                }
            }
        }   
        return jumps;
    }
    
    isComplete(){
        if (this.express){
            return this.nbCrosses[this.express] == this.findPath(false,this.express)[1];
        } else {
            return this.nbCrosses["R"]==this.findPath(false,"R")[1] && 
                   this.nbCrosses["B"]==this.findPath(false,"B")[1]
        }
    }
        
    undo(jump){
        throw new Error("CityMaxe_Board.undo should not be used...")
    }
    
}