import {svg,translate} from "../SVGtools.js"
import {Piece} from "../Piece.js"
import {Jump} from "../Jump.js"
import { BendIt_Jump } from "./BendIt_Jump.js"
import { Grid } from "../Grid.js"
import { Segments } from "./Segments.js"
import { foldArea } from "./BendIt_Display.js"

export {BendIt_Piece,pieceConfigs}

let pieceConfigs = Array.from({length:6},_=>[]);

// generate all possible configurations given all angles
function genConfigs(id,segments){
    if (pieceConfigs[id].length>0)
        return pieceConfigs[id]
    
    const angles = [0,90,180,270];
    let configs=[]
    for (let rotAngle of angles){
        for (let leftAngle of angles){
            if (leftAngle!=180){
                for (let rightAngle of angles){
                    if (rightAngle!=180){
                        // if (id==1 && rotAngle==180 &&leftAngle==90 && rightAngle==90)
                        //     debugger;
                        // console.log(rotAngle,leftAngle,rightAngle)
                        let segs=segments.fold(leftAngle,rightAngle,rotAngle)
                        // console.log(segs.toString())
                        // console.log(segs.display())
                        if (!configs.some(([_,s])=>s.equals(segs))) 
                            configs.push(["-",segs])
                        let segsH = segs.flip("H")
                        if (!configs.some(([_,s])=>s.equals(segsH))) 
                            configs.push(["H",segsH])
                        let segsV = segs.flip("V")
                        if (!configs.some(([_,s])=>s.equals(segsV))) 
                            configs.push(["V",segsV])
                    }
                }
            }
        }
    }
    pieceConfigs[id]=configs
    // console.log("Configs for ",id, configs.length)
    // if (id==1)
    //     for (let [flipped,config] of configs){
    //         console.log(flipped,config.toString())
    //         console.log(config.display())
    //     }
    return configs
}

class BendIt_Piece extends Piece {
       
    constructor (id,i,j,color,flipped,segments){
        super(id,i,j);
        this.color = color;
        this.flipped = flipped;
        this.segments = segments;
        this.configs = genConfigs(id,segments)
    }
    
    toString(){
        return `P(${this.id}:${this.i},${this.j}:${this.allSegments().map(s=>s.angle)})`
    }
    
    toState(){
        return [this.id,this.i,this.j,this.color,this.flipped,
            this.segments.toState()]
    }
    
    allSegments(){
        return this.segments.allSegments()
    }
    
    allBalls(){
        return this.segments.allBalls()
    }
    
    static fromState(state){
        const [id,i,j,color,flipped,values] = state
        return new BendIt_Piece(id,i,j,color,flipped,Segments.fromState(values))
    }
    
    possibleJumps(grid,goal){
        let possible = []
        for (let i0=0;i0<6;i0++){
            for (let j0=0;j0<6;j0++){
                // for each free position in the grid
                if (grid.isNull(i0,j0)){
                    // check all possible configurations
                    for (const [flipped,segs] of this.configs){
                        if (this.check(goal,grid,i0,j0,segs)){
                            // add it to the possible moves (check that it is not already there)
                            possible.push(new BendIt_Jump([this.i,this.j],[i0,j0],new BendIt_Piece(this.id,i0,j0,this.color,flipped,segs)))
                        }                        
                    }
                }
            }
        }
        return possible
    }
    
    check(goal,grid,i0,j0,segments){
        for (const ball of segments.allBalls()){
            const i1 = ball.i+i0, j1=ball.j+j0; // compute 
            // check if within the grid
            if (!grid.check(i1,j1))return false;
            const v = grid.get(i1,j1);
            // check that the position is free
            if (v != null) return false;
            // check that the position is compatible with the goal
            if (ball.c != goal.get(i1,j1)) return false;
        }
        return true
    }
    
    // user interface actions on segments
    rotate90(){
        this.segments = this.segments.fold(0,0,90)
        return this.segments;
    }
    
    flip(flipType){
        this.flipped = flipType;
        this.segments = this.segments.flip(flipType)
        return this.segments
    }
    
    fold(leftAngle,rightAngle,rotAngle){
        this.segments = this.segments.fold(leftAngle,rightAngle,rotAngle)
    }
    
    draw(){
        function makeLine(start,end,color,di,dj){
            return svg("line",{x1:start.j+dj,y1:start.i+di,
                               x2:end.j+dj,y2:end.i+di,
                               stroke:color,"stroke-width":0.2,"stroke-linecap":"round"})    
        }
                
        function makePivot(kind,i,j){
            const fill = kind=="left"?"magenta":"white";
            return svg("g",{transform:translate(j,i)},
                svg("circle",{cx:0,cy:0,r:0.15,fill:fill,stroke:"black","stroke-width":0.03})
            ).addClass(["pivot",kind])
        }
        
        this.drawing = svg("g",{id:"p"+this.id,transform:translate(this.j,this.i)})
        for(const ball of this.allBalls()){ // draw balls
            this.drawing.append(svg("use",{href:ball.c=="B"?"#black":"#white",
                                           transform:translate(ball.j,ball.i)}))
        }
        // draw colored lines
        const mBalls = this.segments.middle.balls
        const lBalls = this.segments.left.balls
        const rBalls = this.segments.right.balls
        const lPivot=mBalls[0]
        const rPivot=mBalls.at(-1)
        
        const di=0.5, dj=0.5;
        this.drawing.append(
            makeLine(mBalls[0],lBalls[0],this.color,di,dj), // left line
            makeLine(lPivot,rPivot,this.color,di,dj), // middle line
            makeLine(mBalls.at(-1),rBalls.at(-1),this.color,di,dj) // right line
        )
        // draw pivot points on middle segment
        this.drawing.append(
            makePivot("left", lPivot.i+di,lPivot.j+dj),
            makePivot("right",rPivot.i+di,rPivot.j+dj),
        )
        return this.drawing;
    }
    
    // find all [i,j] for which it is possible to place the current piece
    possiblePlaces(grid,goal){
        let possible = []
        for (let i0=0;i0<6;i0++){
            for (let j0=0;j0<6;j0++){
                // for each free position in the grid
                if (grid.isNull(i0,j0)){
                    // check current configuation
                    const segs = this.segments;
                    if (this.check(goal,grid,i0,j0,segs)){
                        // add it to the possible moves (check that it is not already there)
                        possible.push([i0,j0])
                    }                        
                }
            }
        }
        return possible
    }
    
    updateDrawing(){
        let di=0.5, dj=0.5;
        function updateLine(elem,start,end){
            elem.attr({x1:start.j+dj,y1:start.i+di,
                       x2:end.j+dj,y2:end.i+di})
        }
        // HACK: this strongly depends on the order of creation of svg elements in this.draw()
        const svgElems = this.drawing.children();
        let idx=0;
        // move origin
        this.drawing.attr({transform:translate(this.j,this.i)})
        // update ball positions
        for(const ball of this.allBalls()){
            svgElems.eq(idx++).attr({transform:translate(ball.j,ball.i)})
        }
        // update line positions
        const middle = this.segments.middle
        const left = this.segments.left
        const right= this.segments.right
        updateLine(svgElems.eq(idx++),middle.balls[0],left.balls[0])
        updateLine(svgElems.eq(idx++),middle.balls[0],middle.balls.at(-1))
        updateLine(svgElems.eq(idx++),middle.balls.at(-1),right.balls.at(-1))           
        // update pivots
        const lpivot=this.segments.middle.balls[0]
        const rpivot=this.segments.middle.balls.at(-1)
        svgElems.eq(idx++).attr({transform:translate(lpivot.j+dj,lpivot.i+di)})
        svgElems.eq(idx++).attr({transform:translate(rpivot.j+dj,rpivot.i+di)})
        $("#pieces").append(this.drawing)
    } 
    
    moveTo(newI,newJ){
        const {minI:chngMinI,minJ:chngMinJ,maxI:chngMaxI,maxJ:chngMaxJ}=foldArea;
        if (newJ>=chngMinJ && newJ<=chngMaxJ){
            // ensure that the shape is all contained in the folding area
            let [minI,minJ,maxI,maxJ]=this.segments.bounds()
            const newMinI=newI+minI;
            const newMinJ=newJ+minJ;
            const newMaxI=newI+maxI;
            const newMaxJ=newJ+maxJ;
            if (newMinI<chngMinI) newI+=chngMinI-newMinI
            else if (newMaxI>chngMaxI) newI-=newMaxI-chngMaxI;            
            if (newMinJ<chngMinJ) newJ+=chngMinJ-newMinJ
            else if (newMaxJ>chngMaxJ) newJ-=newMaxJ-chngMaxJ;            
        }
        this.i = newI;
        this.j = newJ;
        this.updateDrawing()
    } 
    
    inTarget(){
        return this.j<foldArea.minJ;
    }
    
    inFoldArea(){
        return foldArea.minJ<=this.j && this.j<foldArea.maxJ;
    }
    
    inReserve(){
        return this.j>=foldArea.maxJ;
    }
}
    