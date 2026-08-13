import { Grid } from "../Grid.js";
export {Segments}

class Ball{
    constructor (c,i,j){
        this.c=c; // "B" | "W"
        this.i=i;
        this.j=j;
    }
    
    equals(that){
        return this.i==that.i && this.j==that.j && this.c==that.c
    }
    
    hasSamePosAs(that){
        return this.i==that.i && this.j==that.j
    }
    
    toString(){
        return `${this.c}(${this.i},${this.j})`
    }
    
    toState(){
        return [this.c,this.i,this.j]
    }
    
    rotate(deg,i0=0,j0=0){
        switch (deg) {
            case 0: return this;
            case 1: case  90: case -270: return new Ball(this.c,i0+(this.j-j0),j0-(this.i-i0));
            case 2: case 180: return new Ball(this.c,2*i0-this.i,2*j0-this.j);
            case 3: case 270: case -90: return new Ball(this.c,i0-(this.j-j0),j0+(this.i-i0)) 
            default:
            console.log("bad rotate",this);
            debugger;
        }
    }
    
    flip(axis){
        if (axis=="H") return new Ball(this.c,-this.i,this.j)
        return new Ball(this.c,this.i,-this.j)
    }
}

class Segment {
    // each segment is of the form [angle in degrees, list of ball positions]
    // a ball is [color (B or W), di,dj] relative to the global i,j
    constructor(angle,balls){
        this.angle = angle;
        this.balls = balls;
    }
    
    toString(){
        return `S(${this.angle},[${this.balls.map(b=>b.toString()).join(",")}])`
    }
    
    toState(){
        const state = this.balls.map(b=>b.toState())
        state.unshift(this.angle)
        return state
    }
    
    static fromState(vals){
        const angle = vals.shift()
        return new Segment(angle,vals.map(([c,i,j])=>new Ball(c,i,j)))
    }
    
    at(idx){
        return this.balls.at(idx)
    }
    
    rotate(angle,i0=0,j0=0,updateAngle=true){
        let newAngle=this.angle;
        if (updateAngle)newAngle = (newAngle+angle)%360
        return new Segment(newAngle,this.balls.map(b=>b.rotate(angle,i0,j0)))
    }
    
    flip(axis){
        return new Segment(this.angle,this.balls.map(b=>b.flip(axis)))
    }
    
    equals(that){
        for (let k=0;k<this.balls.length;k++)
            if (!this.balls[k].equals(that.balls[k])) return false;
        return true;
    }
}

class Segments{
    constructor(segments){
        this.middle=segments[0]
        this.left=segments[1];
        this.right=segments[2]
    }
    
    equals(that){
        return this.middle.equals(that.middle) &&
               this.left.equals(that.left) &&
               this.right.equals(that.right)
    }
    
    toString(){
        return "["+this.allSegments().map(seg=>seg.toString()).join(",")+"]"
    }
    
    toState(){
        return [this.middle.toState(),this.left.toState(),this.right.toState()]
    }
    
    allSegments(){
        return [this.middle,this.left,this.right]
    }
    
    allBalls(){
        return this.allSegments().flatMap(seg=>seg.balls)
    }
    
    static fromState(vals){
        return new Segments(vals.map(v=>Segment.fromState(v)))
    }
        
    fold(leftAngle,rightAngle,rotAngle){
        let newLeft=this.left.rotate(leftAngle)
        const pivotBall=this.middle.at(-1)
        let newRight=this.right.rotate(rightAngle,pivotBall.i,pivotBall.j)
        return new Segments([this.middle.rotate(rotAngle),
                             newLeft.rotate(rotAngle,0,0,false),
                             newRight.rotate(rotAngle,0,0,false)]) 
    }
    
    flip(axis){
        return new Segments(this.allSegments().map(seg=>seg.flip(axis)))
    }
    
    display(){
        const di=4,dj=4;
        const grid = new Grid(9,9)
        for (const ball of this.allBalls())
            grid.set(di+ball.i,dj+ball.j,ball.c)
        return grid.show()
    }
    
    bounds(){
        const balls=this.allBalls();
        let minI=balls[0].i, maxI=minI, minJ=balls[0].j, maxJ=minJ;
        for (let k=1;k<balls.length;k++){
            const i=balls[k].i, j=balls[k].j;
            if (i<minI)minI=i;
            if (i>maxI)maxI=i;
            if (j<minJ)minJ=j;
            if (j>maxJ)maxJ=j;
        }
        return [minI,minJ,maxI,maxJ]
    }
}

