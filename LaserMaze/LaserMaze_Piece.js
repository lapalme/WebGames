import {svg,translate,M,L,cText,makePoints} from "../SVGtools.js"
import {Piece} from "../Piece.js"
import {allDirs,dirInv,Jump, nextDir} from "../Jump.js"
import { tileFrame } from "./LaserMaze_Display.js"
export {LaserMaze_Piece,allOris}

const allOris = ["N","E","S","W"]
const ori2dir = {"S":"↓", "W":"←", "N":"↑", "E":"→"}

class LaserMaze_Piece extends Piece {
    
    static no=1;
    
    constructor (kind,i,j,ori,canBeRotated,obligatoryTarget){
        super(kind+LaserMaze_Piece.no++,i,j);
        this.kind = kind
        this.ori = ori;
        this.canBeRotated=canBeRotated;
        this.obligatoryTarget=obligatoryTarget;
        this.canBeMoved = false;
    }
    
    toString(){
        return this.kind+this.i+this.j+this.ori+(this.canBeRotated?"?":"")+(this.obligatoryTarget?"*":"")
    }
    
    toState(){
        return [this.kind,this.i,this.j,this.ori,this.canBeRotated,this.obligatoryTarget]
    }
    
    static fromState(state){
        let [kind,i,j,ori,canBeRotated,obligatoryTarget] = state;
        switch (kind) {
            case "R": return new R(i,j,ori,canBeRotated,obligatoryTarget);
            case "P": return new P(i,j,ori,canBeRotated,obligatoryTarget);
            case "G": return new G(i,j,ori,canBeRotated,obligatoryTarget);
            case "B": return new B(i,j,ori,canBeRotated,obligatoryTarget);
            case "Y": return new Y(i,j,ori,canBeRotated,obligatoryTarget);
            case "#": return new Block(i,j,ori,canBeRotated,obligatoryTarget);
            default:
                console.log("*** LaserMaze: illegal piece %s:",kind)
                debugger;
                break;
        }
    }
           
    nextOrientation(){ // default can be turned in all orientations
        if (!this.canBeRotated) return this.ori;
        let idx=allOris.findIndex(o=>o==this.ori)
        if (idx<0) idx=0; // HACK: default ? for some "R", set it to North
        return allOris[(idx+1)%4]
    }
    
    draw(color){
        const title = this.i>=0 ? this.toString() :
            (this.kind+(this.obligatoryTarget?"*":""))
        this.drawing = svg("g",{id:this.kind+this.i+this.j},
            tileFrame({fill:color,opacity:0.8,stroke:color,"stroke-width":0.05}),
            svg("use",{href:"#tile-back",stroke:color}),
            svg("title",{},title)
       )
        if (this.canBeMoved){
            this.drawing.append(
                tileFrame({fill:"none","stroke":"#FFA500","stroke-width":0.03},0.03),
                tileFrame({fill:"none","stroke":"#FFA500","stroke-width":0.03},0.10),                
            )
        } else if (this.canBeRotated){
            this.drawing.append(
                tileFrame({fill:"none","stroke":"#FFA500","stroke-width":0.04}))
        }
        return this.drawing;
    }
    
}

// Red Laser with no inputs and a single output from the current dir
class R extends LaserMaze_Piece {  
    constructor(i,j,ori,canBeRotated,obligatoryTarget){
        super("R",i,j,ori,canBeRotated,obligatoryTarget)
    }
    
    toString(){
        return super.toString()+(this.ori=="?" ? "":ori2dir[this.ori])
    }
        
    inputs() {return []}
    
    getOrientations(){
        return this.canBeRotated ? allOris : [this.ori]
    }
    
    draw(){
        super.draw("red").append(
            svg("path",{d:M(0.35,0.25)+L(0.5,0.1)+L(0.65,0.25)+M(0.5,0.1)+L(0.5,0.5),stroke:"white",opacity:0.8,
            "stroke-width":0.1,fill:"none","stroke-linecap":"round"}),
        )
        return this.drawing;
    }
}

// Green Beam Splitter :splits the beam in two paths. One path is reflected 90° and the 
//                      other passes straight
class G extends LaserMaze_Piece {
    constructor(i,j,ori,canBeRotated,obligatoryTarget){
        super("G",i,j,ori,canBeRotated,obligatoryTarget)
    }
   
    inputs(){  // list of acceptable inputs (default all)
        return allDirs;
    }
    
    outputs(inDir){
        let newDir;
        if (this.ori == "/")  
            newDir = {"↑":"→", "→":"↑", "↓":"←", "←":"↓"}[inDir]
        else 
            newDir = {"↑":"←", "→":"↓", "↓":"→", "←":"↑"}[inDir]
        return [inDir,newDir]
    }
    
    getOrientations(){
        return this.canBeRotated ? ["/", "\\"] : [this.ori]
    }

    nextOrientation(){
        return this.ori=="/" ? "\\" : "/"
    }
    
    draw(){
        super.draw("green").append(
            svg("line",{x1:0.15,y1:0.85, x2:0.85,y2:0.15,stroke:"lightgray",
            "stroke-width":0.1,"stroke-linecap":"round",opacity:0.8}),
        )
        return this.drawing;
    }
    
}

// Blue Double Mirror: both sides reflects the beam 90°
class B extends LaserMaze_Piece {
    constructor(i,j,ori,canBeRotated,obligatoryTarget){
        super("B",i,j,ori,canBeRotated,obligatoryTarget)
    }
        
    inputs(){  // list of acceptable inputs (default all)
        return allDirs;
    }
    
    outputs(inDir){
        if (this.ori == "/")  
            return [{"↑":"→", "→":"↑", "↓":"←", "←":"↓"}[inDir]]
        return [{"↑":"←", "→":"↓", "↓":"→", "←":"↑"}[inDir]]
    }
    
    getOrientations(){
        return this.canBeRotated ? ["/", "\\"] : [this.ori]
    }

    nextOrientation(){
        return this.ori=="/" ? "\\" : "/"
    }

    draw(){
        super.draw("blue").append(
            svg("line",{x1:0.15,y1:0.85, x2:0.85,y2:0.15,stroke:"lightgray",
            "stroke-width":0.1,"stroke-linecap":"round",opacity:0.8}),
        )
        return this.drawing;
    }
}

// Yellow : the beam must pass trough
class Y extends LaserMaze_Piece {
    constructor(i,j,ori,canBeRotated,obligatoryTarget){
        super("Y",i,j,ori,canBeRotated,obligatoryTarget)
    }
    
    inputs(){
        return this.ori=="|" ? ["→","←"]:["↑","↓"] 
    }
    
    outputs(inDir){
        return [inDir]
    }

    getOrientations(){
        return this.canBeRotated ? ["|", "-"] : [this.ori]
    }
    
    nextOrientation(){
        return this.ori=="|" ? "-" : "|"
    }
    
     draw(){
        super.draw("yellow").append(
            svg("line",{x1:0.5,y1:0.15, x2:0.5,y2:0.85,stroke:"lightgray",
            "stroke-width":0.13,"stroke-linecap":"round",opacity:1}),
        )
        return this.drawing;
    }
   
}

// Block : does not change the path
class Block extends LaserMaze_Piece {
    constructor(i,j,ori,canBeRotated,obligatoryTarget){
        super("#",i,j,ori,canBeRotated,obligatoryTarget)
    }
 
    toString(){
        return ["#",this.i,this.j].join("")
    }
    
    inputs(){  // list of acceptable inputs (default all)
        return allDirs;
    }
    
    outputs(){
        return [this.ori]
    }
    
    nextOrientation(){
        debugger
    }
    
    draw(){
        super.draw("#202020").append(
            svg("rect",{x:0.2,y:0.2,width:0.6,height:0.6,fill:"lightgray"})
        )
        return this.drawing;
    }
}

// Purple Target/Mirror : when used as a target, the beam must light the red side of the token
// orientation is that of the target
class P extends LaserMaze_Piece{
    constructor(i,j,ori,canBeRotated,obligatoryTarget){
        super("P",i,j,ori,canBeRotated,obligatoryTarget)
    }
    
    toString(){
        return super.toString()+(this.ori=="N" || this.ori== "S" ? "\\" : "/")
    }

    inputs(){
        return {"N":["↑","→"], 
                "E":["↓","→"], 
                "S":["↓","←"], 
                "W":["↑","←"]}[this.ori]
    }

    outputs(inDir){
        if (this.targetTouched(inDir)) return [];
        if (this.ori == "E" || this.ori== "W")  
            return [{"↑":"→", "→":"↑", "↓":"←", "←":"↓"}[inDir]]
        return [{"↑":"←", "→":"↓", "↓":"→", "←":"↑"}[inDir]]  
    }
    
    getOrientations(){
        return this.canBeRotated ? allOris : [this.ori]
    }
    
    targetTouched(inDir){
        return inDir=={"S":"↑", "W":"→", "N":"↓", "E":"←"}[this.ori]
    }

     draw(){
        super.draw("purple").append(
            // mirror
            svg("line",{x1:0.15,y1:0.15, x2:0.85,y2:0.85,stroke:"lightgray",
            "stroke-width":0.1,"stroke-linecap":"round", opacity:0.5}),
            // target
            svg("polygon",{points:makePoints([0.5,0.4, 0.80,0.10, 0.2,0.10]),fill:"black"}),
        )
        if (this.obligatoryTarget){
            this.drawing.append(
                svg("circle",{cx:0.5,cy:this.canBeRotated ? 0.5 : 0.2,
                               r:0.09,fill:"white",       
                               stroke:"red","stroke-width":0.05})
            )
        }
        return this.drawing;
    }

}
