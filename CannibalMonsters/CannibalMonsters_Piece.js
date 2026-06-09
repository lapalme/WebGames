import {svg,translate,M as MV,L,Q,T} from "../SVGtools.js"
import {Piece} from "../Piece.js"
import {CannibalMonsters_Jump} from "./CannibalMonsters_Jump.js"
import {M,N} from "./CannibalMonsters_Board.js"
export {CannibalMonsters_Piece}

/// global definitions of the form of the base of each monster
//   for the moment the "wavy" form is replaced by a bar

//  h: height of the base
//  W: width of the base
//  n: number of rect of triangles
//  d: shift from the margin
const h = 0.15, h_2=h/2, W = 0.9, n=4, w=W/n, d=(1-W)/2; 

// Important: Motifs are list of SVG path commands
//     They start at the upper-left and follow a clockwise movement
//     so the top goes from left to right 
//     bottom from right to left  
 
//  bottom and top bar motifs (now unused because we managed to get wavy motifs working)
// const bar_top    = MV(d,h)+L(d,0)+L(W+d,0)+L(W+d,h)
// const bar_bottom = //MV(0,0)+L(0,h)+L(W,h)+L(W,0)
//                    MV(W+d,h_2)+L(W+d,h+h_2)+L(d,h+h_2)+L(d,h_2)

// top and bottom wavy motifs
const w_2 = w/2;
let wavy_top = MV(d,0)+Q(d+w_2/2,-h_2,d+w_2,0)
for(let k=2;k<=n*2;k++)
    wavy_top+=T(d+k*w_2,0)
wavy_top += L(W+d,h)

const Wd = W+d;
const hh2 = h+h/3;
let wavy_bottom = MV(Wd,h_2)+L(Wd,hh2)+Q(Wd-w_2/2,2*h,Wd-w_2,hh2);
for (let k=2;k<n*2;k++)
    wavy_bottom+=T(Wd-k*w_2,hh2)
wavy_bottom += T(d,hh2)+L(d,h_2)

//  for rectangle motif (of total width w)
//  -+  +-
//   +--+
function rect(w,h){  // HACK:we use relative displacements...
    return `h${w/4} v${h} h${w/2} v${-h} h${w/4}, `
} 
let rect_top = MV(d,h)+L(d,0)
for (let k=0;k<n;k++){
    rect_top+=rect(w,h_2)
}
rect_top+=L(W+d,h);

let rect_bottom = MV(W+d,0)+L(W+d,h);
for (let k=0;k<n;k++)
    rect_bottom+=rect(-w,h/2)
rect_bottom+=L(d,0);

// triangle top motif /\ (of total width w)
function trit(w,h){ // HACK:we use relative displacements...
    return ` l${w/2},${-h} l${w/2},${h} `
}
let tri_top = MV(d,h_2);
for (let k=0;k<n;k++)
    tri_top+=trit(w,h/2)

// triangle bottom motif \/ but shift by w/2
function trib(w,h){
    return `l${-w/2},${h} l${-w/2},${-h}`
}
let tri_bottom = MV(W+d,h)+L(W+d,h+h/2)+L(W+d-w/2,h);
for (let k=0;k<n-1;k++)
    tri_bottom+=trib(w,h/2)
tri_bottom+=L(d,h+h/2)+L(d,h)

//  combined path
const bluePath = rect_top+tri_bottom      
const redPath  = wavy_top+rect_bottom;
const greenPath= tri_top+wavy_bottom;

/// positions of the eyes 
const eyePos = [[],
                [[0.5,0.3]], // 1 eye
                [[0.35,0.4],[0.6,0.3]], // 2 eyes
                [[0.3,0.4],[0.45,0.2],[0.6,0.4]], // 3 eyes
                [[0.4,0.3],[0.4,0.5],[0.6,0.25],[0.6,0.45]] // 4 eyes
                ]

class CannibalMonsters_Piece extends Piece {
    constructor (stack,i,j){
        super(stack[0],i,j);
        this.stack=stack;
    }
    
    toString(){
        return this.stack.slice(0,-1).map(id=>id.charAt(0)).join("")+this.stack.at(-1)
    }
    
    toState(){
        return [this.stack,this.i,this.j]
    }
    
    static fromState(state){
        return new CannibalMonsters_Piece(state[0],state[1],state[2])
    }
    
    canEat(bottom){
        const topC = this.stack[0].charAt(0), bottomC = bottom.stack.at(-1).charAt(0);
        switch (topC) {
            case "R": return bottomC == "B";
            case "B": return bottomC == "G";
            case "G": return bottomC == "R";
            default:
                console.log("canEat: strange top color",topC);
                debugger;
        }
    }
        
    possibleJumps(grid){
        let jumps = []
        // check if this piece can eat another
        // before on the same line
        for (let k=this.j-1;k>=0;k--){
            const cell = grid.get(this.i,k);
            if (cell!=null){
                if (this.canEat(cell))
                    jumps.push(new CannibalMonsters_Jump([this.i,this.j],[cell.i,cell.j],this))
                break;
            }
        }
        // after on the same line
        for (let k=this.j+1;k<N;k++){
            const cell = grid.get(this.i,k);
            if (cell!=null){
                if (this.canEat(cell))
                    jumps.push(new CannibalMonsters_Jump([this.i,this.j],[cell.i,cell.j],this))
                break;
            }
        }
        // before on the same column
        for (let k=this.i-1;k>=0;k--){
            const cell = grid.get(k,this.j);
            if (cell!=null){
                if (this.canEat(cell))
                    jumps.push(new CannibalMonsters_Jump([this.i,this.j],[cell.i,cell.j],this))
                break;
            }
        }
        // after on the same column
        for (let k=this.i+1;k<M;k++){
            const cell = grid.get(k,this.j);
            if (cell!=null){
                if (this.canEat(cell))
                    jumps.push(new CannibalMonsters_Jump([this.i,this.j],[cell.i,cell.j],this))
                break;
            }
        }
        return jumps;
    }
    
    
    // this is usually called at the creation of a piece
    // but it can also be called as the end of "solve"
    //  HACK: we could have tried to only draw base except for the last monster
    //        but it is much simpler to draw all monsters systematically
    draw(){
        function color(c){return {"R":"red","B":"blue","G":"green"}[c]};
        function path(c){return {"R":redPath,"B":bluePath,"G":greenPath}[c]}
        // build a monster 
        function monster([col,nbEyes],i,j){
            return svg("g",{id:col+nbEyes,fill:color(col),
                                 transform:translate(j,i)},
                svg("use",{href:"#monster",}),
                    ...eyePos[nbEyes].map(([x,y])=>
                    svg("use",{href:"#eye", transform:translate(x,y)})
                ),
                svg("path",{d:path(col),fill:color(col),stroke:"white",     
                             "stroke-width":0.01,transform:translate(0,0.65)}),
            )
        }
        // original 
        this.drawing = monster(this.stack[0].split(""),this.i,this.j);
        // stack other monsters
        for (let k=1;k<this.stack.length;k++){
            this.drawing.append(
                monster(this.stack[k].split(""),-k*0.15,0)
            )
        }
        return this.drawing;
    }
}
