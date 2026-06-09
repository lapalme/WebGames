import {svg,translate,animateTransform} from "../SVGtools.js"
import { C } from "../C.js";
import {Piece} from "../Piece.js"
import {Jump} from "../Jump.js"

export {SnowProblem_Piece}

class SnowProblem_Piece extends Piece {
    constructor (id,i,j,kind){
        super(id,i,j)
        this.kind = kind;
    }

    toString(){
        return this.kind
    }
    
    toState(){
        return this.i+""+this.j+this.kind
    }
    
    draw(){
        const i=this.i,j=this.j;
        const ps = this.kind.split("").map(
            (c,k)=>svg("use",{href:"#"+this.kind.charAt(k),transform:translate(0,-k*0.3)}))
        this.drawing = svg("g",{id:this.kind+this.id,transform:translate(j,i)},
                            svg("title",{},i+"@"+j),
                            ...ps).data({piece:this})
        return this.drawing;
    }
    
    stackOn(that){
        if (this.kind=="m" && that.kind=="l"){
            that.kind = that.kind+this.kind;
            this.i=that.i;
            this.j=that.j;
            if (this.drawing!=null){
                this.drawing.attr("transform",translate(0,-0.3)).off("mousedown");
                $("title",this.drawing).remove();
                that.drawing.append(this.drawing);
            }
        } else if ("rby".includes(this.kind) && that.kind=="lm"){
            that.kind = that.kind+this.kind;
            this.i = that.i;
            this.j = that.j;
            if (this.drawing!=null){
                this.drawing.attr("transform",translate(0,-0.6)).off("mousedown")
                that.drawing.append(this.drawing);
                $("title",this.drawing).remove();
            }
        } else {
            console.log("Bad stacking+"+this+" on "+that)
        }
    }
            
    possibleJumps(grid){
        const deltas = {"N":{i:-1,j:0},"E":{i:0,j:1},"S":{i:1,j:0},"O":{i:0,j:-1}};
        let res = [];
        const i=this.i,j=this.j;
        const M=grid.M, N=grid.N;
        switch (this.kind) {
            case "t": return [];
            case "y":case "b":case "r":
                for (const dir in deltas){
                    const {i:di,j:dj}=deltas[dir];
                    let i1 = i+di, j1= j+dj;
                    if (i1>=0 && i1<M && j1>=0 && j1<N){
                        const voisin = grid.get(i1,j1);
                        if (voisin!=null && voisin.kind=="lm")
                            // res.push([dir,i+di,j+dj])
                            res.push(new Jump(new C(this.i,this.j),new C(i+di,j+dj)))
                    }
                }
                return res;    
            case "m":case "l":
                for (const dir in deltas){
                    const {i:di,j:dj} = deltas[dir];
                    let i1 = i+di, j1= j+dj, k=0;
                    while (i1>=0 && i1<M && j1>=0 && j1<N){
                        const c = grid.get(i1,j1);
                        if (c!= null){
                            if (k==0 && this.kind=="m" && c.kind=="l"){
                                // res.push([dir,i1,j1])
                                res.push(new Jump(new C(this.i,this.j),new C(i1,j1)))
                            } else if (k>0) { // doit avancer au moins de un
                                // res.push([dir,i1-di,j1-dj])
                                res.push(new Jump(new C(this.i,this.j),new C(i1-di,j1-dj)))
                            }
                            break;
                        }
                        i1+=di;
                        j1+=dj;
                        k++;
                    }
                }
                return res;
            default:
                if (this.kind.startsWith("lm")) return []
                console.log("Strange SnowProblem_Piece",this.kind)
                break;
        }
    }
    
    rollTo(i1,j1){
        const i0=this.i,j0=this.j;
        const di=i1-i0,dj=j1-j0;
        const nb = Math.max(Math.abs(di),Math.abs(dj));
        let angle=nb*360;
        if (di==0 && dj<0) angle=-angle;
        this.drawing.append(
            animateTransform("translate","0,0",dj+","+di,nb/2)
                            .on("endEvent",
                                function(e){
                                    $(this).parent().attr("transform",translate(j1,i1));
                                }),
            animateTransform("rotate","0 0.5 0.5", angle+" 0.5 0.5",nb/2)
        )
        $(".animate",this.drawing).each(function(idx){this.beginElement()})
    }

}
