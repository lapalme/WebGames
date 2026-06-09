import { translate,animateTransform } from "../SVGtools.js"
import {Grid} from "../Grid.js"
import {Board} from "../Board.js"
import {dir2rot,dirInv,allDirs} from "../Jump.js"
import { Tilt_Jump } from "./Tilt_Jump.js"
import {Tilt_Piece} from "./Tilt_Piece.js"

export {Tilt_Board,showMoves,M,N}

function showMoves(jumpsList){
    const all = jumpsList.map(j=>j[0].arrow()+(j[0].inHole==null?"":j[0].inHole.kind))
    // group jumps by four to ease comparison with the published game gards
    const group4 = Object.groupBy(all, (v, i) => Math.floor(i / 4))
    return Object.values(group4).map(g=>g.join("")).join(" ")
}

const M=5,N=5;

const dir2didj = {}
for (let dir of allDirs){
    dir2didj[dir]=dir2rot[dir].slice(1)
}

class Tilt_Board extends Board {
    constructor (no,state,display){
        super(no,state,display);
        this.grid = new Grid(M,N);
        this.pieces = []
        let id=0;
        const lines = state.split("\n")
        for (let i=0;i<M;i++)
            for (let j=0;j<N;j++){
                const kind = lines[i].charAt(j);
                if (kind!="."){
                    id++;
                    const piece = new Tilt_Piece(id,i,j,kind)
                    this.pieces.push(piece)
                    this.grid.set(i,j,piece);
                }
            }
        // get the subset of movable pieces
        this.movable = this.pieces.filter(p=>p.kind=="G" || p.kind=="B")
        if (display != null) // this call must come after pieces have been added
            display.setBoard(this);
    }
    
    toString(){
        return this.toState()
    }
    
    toState(){
        let lines=[];
        for (let i=0;i<M;i++){
            let line=""
            for (let j=0;j<N;j++){
                const piece=this.grid.get(i,j);
                line += piece==null ? "." : piece.kind;
            }
            lines.push(line)
        }
        return lines.join("\n")
    }
    
    possibleJumps(){
        let jumps = [];
        for (const dir in dir2didj){
            if (this.canPlay(dir)){
                jumps.push(new Tilt_Jump(dir))
            }
        }
        return jumps;
    }
    
    isComplete(){
        return this.movable.filter(p=>p.kind=="G").length == 0;
    }
    
    canPlay(dir){
        const [di,dj] = dir2didj[dir];
        const temp = this.copyGrid();
        let inHole=false;
        let couldMove = false;
        if (di!=0){// tilt vertically
            const descI = this.movable.sort((p1,p2)=>di*(p2.i-p1.i)); // sort decreasing i
            for (const p of descI){
                let k=p.i+di;
                while(k>=0 && k<M && temp.get(k,p.j)==null)k+=di;
                if (k>=0 && k<M && temp.get(k,p.j).kind=="O"){
                    if (p.kind=="B"){
                        inHole=true;
                        break;                            
                    } else {
                        temp.set(p.i,p.j,null);
                        couldMove = true;
                    }
                } else if (k-di!=p.i) {// we could move{
                    temp.set(p.i,p.j,null);
                    temp.set(k-1*di,p.j,p);
                    couldMove = true;
                }
            }
        } else { // tilt horizontally
            const descJ = this.movable.sort((p1,p2)=>dj*(p2.j-p1.j)); // sort decreasing j
            for (const p of descJ){
                let k=p.j+dj;
                while(k>=0 && k<N && temp.get(p.i,k)==null)k+=dj;               
                if (k>=0 && k<N && temp.get(p.i,k).kind=="O"){
                    if (p.kind=="B"){
                        inHole=true;
                        break;                            
                    } else {
                        temp.set(p.i,p.j,null);
                        couldMove = true;
                    }
                } else if (k-dj!=p.j){// we could move
                    temp.set(p.i,p.j,null);
                    temp.set(p.i,k-1*dj,p);
                    couldMove = true;
                }
            }           
        }
        return couldMove && !inHole;           
        
    }
        
    moveTo(p,newI,newJ,remove){
        // simple move no animation
        // if (remove) 
        //     p.drawing.remove()
        // else
        //     translateSVG(p.drawing,newJ,newI);
        // animate each 
        const dur=Math.max(Math.abs(newI-p.i),Math.abs(newJ-p.j));
        p.drawing.attr("transform",null);
        p.drawing.append(
            animateTransform("translate",p.j+","+p.i,newJ+","+newI,dur/5)
                 .on("endEvent",function(e){
                     $(this).remove();
                     p.drawing.attr("transform",translate(newJ,newI));
                     if (remove)p.drawing.remove();
                 })
        )
    }
    
    play(jump){  // the play is garanteed to be valid so no checking is done
        const di=jump.to.i,dj=jump.to.j;
        if (di!=0){  // tilt vertically
            const descI = this.movable.sort((p1,p2)=>di*(p2.i-p1.i)); // sort i
            let i=0;
            while(i<descI.length){ // we should not use an iterator as we change descI in the loop
                const p = descI[i];
                let k=p.i+di;
                while(k>=0 && k<M && this.grid.get(k,p.j)==null)k+=di;
                if(k>=0 && k<M && this.grid.get(k,p.j).kind=="O"){
                    jump.putInHole(p);
                    this.grid.set(p.i,p.j,null);
                    this.movable.splice(i,1)
                    if (this.display!=null){
                        this.moveTo(p,k-1*di,p.j,true);
                        // p.drawing.remove();
                        jump.savePos(p);
                    }
                    if(this.movable.length==0)break;
                } else {
                    if (k-di!=p.i){// there was some move
                        this.grid.set(p.i,p.j,null);
                        const newI=k-1*di;
                        this.grid.set(newI,p.j,p);
                        if (this.display!=null){
                            // translateSVG(p.drawing,p.j,newI);
                            this.moveTo(p,newI,p.j,false)
                            jump.savePos(p); // save current p.i
                        }
                        p.i=newI;
                    }
                    i++;
                }
            }
        } else {  // tilt horizontally
            const descJ = this.movable.sort((p1,p2)=>dj*(p2.j-p1.j)); // sort j
            let j=0;
            while (j<descJ.length){
                const p=descJ[j];
                let k=p.j+dj;
                while(k>=0 && k<N && this.grid.get(p.i,k)==null)k+=dj;
                if(k>=0 && k<N &&this.grid.get(p.i,k).kind=="O"){
                    jump.putInHole(p);
                    this.grid.set(p.i,p.j,null);
                    this.movable.splice(j,1)[0]
                    if (this.display != null){
                        // p.drawing.remove();
                        this.moveTo(p,p.i,k-1*dj,true)
                        jump.savePos(p);
                    }
                    if(this.movable.length==0)break;
                } else {
                    const k1=k-dj;
                    if (k1!=p.j){ 
                        this.grid.set(p.i,p.j,null);
                        const newJ = k-1*dj;
                        this.grid.set(p.i,newJ,p);
                        if (this.display!=null){
                            // translateSVG(p.drawing,newJ,p.i);
                            this.moveTo(p,p.i,newJ,false);
                            jump.savePos(p); // save current p.j
                        }
                        p.j=newJ;
                    }
                    j++;
                }
            } 
        }
        if (this.display!=null){
            $(".animate").each(function(idx){this.beginElement()})           
        }
    }
    
    undo(jump){
        jump.resetPos(this.grid);
        if (jump.inHole != null){
            this.movable.push(jump.inHole);
            $("#pieces").append(jump.inHole.drawing)
        }
    }
    
    copyGrid(){
        const copy = new Grid(M,N);
        for (let i=0;i<M;i++)
            for (let j=0;j<N;j++){
                const piece = this.grid.get(i,j)
                if (piece != null)
                    copy.set(i,j,piece)
            }
        return copy;
    }
    
}