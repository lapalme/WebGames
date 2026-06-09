import {svg,translate,rotate,cText,translateSVG,
        rotateSVG,getRotateInfos,rotateSVG_rel,animateTransform} from "../SVGtools.js"
import {Piece} from "../Piece.js"
import {Jump} from "../Jump.js"
import { sides } from "./Problems.js"
import { ori2arrow } from "./GrizzlyGears_Board.js"

export {Disk,Boat}

const animateDiskTurning=true;

const colors = {
    "A": "pink",  // girl
    "B": "orange", // beaver
    "C": "lightskyblue",  // lumberjack
    "D": "tan",   // goat
    "E": "brown", // bear
    "F": "silver"  // hare
}

const invOri     = {0:2, 1:3, 2:0, 3: 1}
const ori2didj   = {0:[-1,0],1:[0,1],2:[1,0],3:[0,-1]}
// precompute adjacent disks
let neighbours= []
for (let i=0;i<3;i++){
    let n_j=[]
    for (let j=0;j<3;j++){
        let l=[]
        for (let [di,dj,ori] of [[-1,0,0],[0,1,1],[1,0,2],[0,-1,3]]){
            let i1=i+di,j1=j+dj;
            if (i1>=0 && i1<3 && j1>=0 && j1<3)
                l.push([i1,j1,ori])
        }
        n_j.push(l)
    }
    neighbours.push(n_j)
}


//   side numbers 
//        0
//      3 . 1
//        2
class Disk extends Piece {
    constructor (id,i,j,kind,ori){
        super(id,i,j)
        this.kind = kind
        this.ori = ori; // [0..3] 
        // sides = for a given ori show what is at position 0..3
        // it is either this piece, a boat or null if it is a "hole"
        this.sides = sides[this.kind][ori].map(bool=>bool?this:null)
        if(this.sides.length!=4)debugger;
   }
    
    toString(){
        return this.kind+this.i+this.j+ori2arrow[this.ori]+this.ori
    }
    
    toState(){
        return [this.i,this.j,this.kind,this.ori]
    }
    
    setSides(){
        this.sides = sides[this.kind][this.ori].map(bool=>bool?this:null)        
    }
    
    addBoat(boat,ori){
        if (this.sides[ori] != null ) debugger;
        this.sides[ori] = boat;
        boat.i = this.i;
        boat.j = this.j;
        boat.ori = ori;
    }
    
    removeBoat(ori){
        const boat = this.sides[ori];
        if (!(boat instanceof Boat)) debugger;
        this.sides[ori] = null;
        if (this.sides.length!=4)debugger;
        return boat;
    }
    
    
    // check if piece can turn by "delta" : +1 or -1
    canTurn(grid,delta){
        function isEmpty(i,j,n){
            if (i<0 || j<0 || i>=3 || j>= 3) return true;
            const neighbour = grid.get(i,j);
            return neighbour.sides[n] != neighbour;
        }
        let i=this.i, j=this.j; // simplify notation
        // check that no boat except with a bear ("e") at 1,2 might try to move
        // in front of the mother bear
        if (i==1 && j==2){
            const disk12 = grid.get(1,2);
            const disk12_0 = disk12.sides[0]
            if (disk12_0 instanceof Boat && disk12_0.id != "e" && delta==1){
                return false;
            }
            const disk12_2 = disk12.sides[2];
            if (disk12_2 instanceof Boat && disk12_2.id != "e" && delta==-1){
                return false;
            }
        }
        if (this.kind == "G"){
            switch (this.ori){
                case 0 : case 2: return isEmpty(i-1,j,2) && isEmpty(i+1,j,0)
                case 1 : case 3: return isEmpty(i,j-1,1) && isEmpty(i,j+1,3)
            }
        } else {
            switch (this.ori) {
                case 0:return isEmpty(i-1,j,2) && isEmpty(i,j-1,1);
                case 1:return isEmpty(i-1,j,2) && isEmpty(i,j+1,3);
                case 2:return isEmpty(i+1,j,0) && isEmpty(i,j+1,3);
                case 3:return isEmpty(i+1,j,0) && isEmpty(i,j-1,1);
                default:
                    debugger;
                    break;
            }
        }
    }
    
    turn(grid,delta){
        function nextOri(ori,delta){
            if (delta==1){
                return ori==3 ? 0 : ori+1;
            } else { // delta == -1
                return ori==0 ? 3 : ori-1
            }            
        }
                
        // check if there are boats on this disk
        let boats=[]
        for (let k=0;k<4;k++){
            if (this.sides[k] instanceof Boat){
                const boat=this.removeBoat(k); // remove the boat from this disk
                boats.push([k,boat])
                // check if this boat is shared with another disk
                const [di,dj] = ori2didj[k];
                const i1=this.i+di,j1=this.j+dj;
                if (grid.check(i1,j1)){  // remove the "same" boat from the neighbour
                    const neighbour=grid.get(i1,j1);
                    const boat1=neighbour.removeBoat(invOri[k]);
                    if (boat!=boat1) debugger;
                }
            }
        }
        if (animateDiskTurning){
            //// with animation but the text in the boat does not change
            //   I never managed to find a formula to make the letter always stay up
            //   because it depends on the relative position of the disk 
            const oldOri = this.ori;
            const disk = this
            this.ori = nextOri(this.ori,delta)
            this.setSides() 
            if (this.drawing !=null){
                $(".animate").remove()
                this.drawing.append(
                    animateTransform("rotate","0 0.5 0.5",delta*90+" 0.5 0.5")
                        .on("endEvent",(e)=>{
                            rotateSVG(disk.drawing,disk.ori*90,0.5,0.5)
                        })
                )
                $(".animate",this.drawing)[0].beginElement()
            }
            // shift boats and add to neighbour disk
            for (let [k,boat] of boats){
                const newOri = nextOri(k,delta);
                this.addBoat(boat,newOri);
                if (boat.drawing!=null){
                    // ensure the boat reference point is on the current disk
                    boat.drawing.attr("transform",translate(this.j,this.i)+rotate(k*90,0.5,0.5))
                    boat.drawing.append(
                        // the last parameter "remove" is important to return to the original 
                        // so that the text rotation can be done correctly, although I am not too sure why...
                        animateTransform("rotate","0 0.5 0.5",delta*90+" 0.5 0.5",1,"remove") 
                        .on("endEvent",(e)=>{
                            boat.drawing.attr("transform",translate(boat.j,boat.i)+rotate(boat.ori*90,0.5,0.5))// replace the boat 
                            rotateSVG($("text",boat.drawing),-boat.ori*90,0.5,0); // turn the text
                        })
                    )
                    $(".animate",boat.drawing)[0].beginElement()
                } 
                // check if this boat is shared with another disk
                const [di,dj] = ori2didj[newOri];
                const i1=this.i+di,j1=this.j+dj;
                if (grid.check(i1,j1)){  // add the "same" boat to the neighbour
                    const neighbour=grid.get(i1,j1);
                    neighbour.addBoat(boat,invOri[newOri])
                }            
            }
        } else {
            /// without animation of the rotating disks
            this.ori = nextOri(this.ori,delta)
            this.setSides() 
            if (this.drawing !=null){
                rotateSVG(this.drawing,this.ori*90,0.5,0.5); // turn the disk
            }
            // shift boats and add to neighbour disk
            for (let [k,boat] of boats){
                k = nextOri(k,delta);
                this.addBoat(boat,k);
                if (boat.drawing!=null){
                    boat.drawing.attr("transform",translate(boat.j,boat.i)+rotate(boat.ori*90,0.5,0.5))// replace the boat 
                    rotateSVG($("text",boat.drawing),-boat.ori*90,0.5,0); // turn the text
                }
                // check if this boat is shared with another disk
                const [di,dj] = ori2didj[k];
                const i1=this.i+di,j1=this.j+dj;
                if (grid.check(i1,j1)){  // add the "same" boat to the neighbour
                    const neighbour=grid.get(i1,j1);
                    neighbour.addBoat(boat,invOri[k])
                }            
            }
        }   
    }
    
    draw(){
        this.drawing = 
            svg("g",{id:this.id,transform:translate(this.j,this.i)+rotate(this.ori*90,0.5,0.5)}, 
                svg("use",{href:"#"+this.kind})
            )              
        return this.drawing;
    }    
}

class Boat extends Piece {
    constructor (id,i,j,ori){
        super(id,i,j)
        this.ori = ori;
    }
    
    toState(){
        return [this.i,this.j,this.id,this.ori]
    }
   
    draw(){
        this.drawing =
            svg("g",{id:this.id,transform:translate(this.j,this.i)+rotate(this.ori*90,0.5,0.5)},
                svg("use",{href:"#boat",fill:colors[this.id.toUpperCase()]}),
                cText(this.id,0.5,0,"black",0.3).attr("transform",rotate(-this.ori*90,0.5,0))
            )
        return this.drawing
    }   
}
