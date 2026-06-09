import {svg,isSafari,translate,rotate,cText} from "../SVGtools.js"
import { C } from "../C.js";
import {Piece} from "../Piece.js"
import {Person} from "./Person.js"
import {Boarding} from "./Boarding.js"
import {Jump, allDirs,dir2rot} from "../Jump.js"
import { Titanic_Jump } from "./Titanic_Jump.js";

export {Boat}
// A boat position is given by the i,j of its "arrow" which also indicates its direction

// relative positions occupied by a boat (given a direction)  
// short boat
const posShort = {
    "↑": [[0,0],[1,0]],
    "→": [[0,0],[0,-1]],
    "↓": [[0,0],[-1,0]],
    "←": [[0,0],[0,1]]
}
// long boat
const posLong = {
    "↑": [[0,0],[1,0],[2,0]],
    "→": [[0,0],[0,-1],[0,-2]],
    "↓": [[0,0],[-1,0],[-2,0]],
    "←": [[0,0],[0,1],[0,2]]
}

// relative positions of a boat that must be free for that boat to move in a direction
// {direction of the boat:
//    {direction of the jump:[positions that must be free]

//  short boat 
const freeShort = {
    "↑": {"↑":[[-1,0]],        "→":[[0,1],[1,1]], "↓":[[2,0]],       "←":[[0,-1],[1,-1]]},
    "→": {"↑":[[-1,-1],[-1,0]],"→":[[0,1]],       "↓":[[1,-1],[1,0]],"←":[[0,-2]]},
    "↓": {"↑":[[-2,0]],        "→":[[0,1],[-1,1]],"↓":[[1,0]],       "←":[[0,-1],[-1,-1]]},
    "←": {"↑":[[-1,0],[-1,1]], "→":[[0,2]],       "↓":[[1,0],[1,1]], "←":[[0,-1]]}
};
//  long boat
const freeLong = {
    "↑": {"↑":[[-1,0]],                "→":[[0,1],[1,1],[2,1]],  "↓":[[3,0]],              "←":[[0,-1],[1,-1],[2,-1]]},
    "→": {"↑":[[-1,-2],[-1,-1],[-1,0]],"→":[[0,1]],              "↓":[[1,-2],[1,-1],[1,0]],"←":[[0,-3]]},
    "↓": {"↑":[[-3,0]],                "→":[[0,1],[-1,1],[-2,1]],"↓":[[1,0]],              "←":[[0,-1],[-1,-1],[-2,-1]]},
    "←": {"↑":[[-1,0],[-1,1],[-1,2]],  "→":[[0,3]],              "↓":[[1,0],[1,1],[1,2]],  "←":[[0,-1]]}
};
 
// relative positions of possible boarding of a boat
//  short boat
const boardShort = {
    "↑": [[1,-1],[2,0],[1,1]],
    "→": [[-1,-1],[0,-2],[1,-1]],
    "↓": [[-1,-1],[-2,0],[-1,1]],
    "←": [[-1,1],[0,2],[1,1]]
}
//  long boat (first place)
const boardLong0 = {
    "↑": [[1,-1],[1,1]],
    "→": [[-1,-1],[1,-1]],
    "↓": [[-1,-1],[-1,1]],
    "←": [[-1,1],[1,1]]
}
//  long boat (second place)
const boardLong1 = {
    "↑": [[2,-1],[3,0],[2,1]],
    "→": [[-1,-2],[0,-3],[1,-2]],
    "↓": [[-2,-1],[-3,0],[-2,1]],
    "←": [[-1,2],[0,3],[1,2]]
}


class Boat extends Piece {
    constructor (id,i,j,dir,length){
        super(id,i,j)
        this.dir=dir;
        this.length=length;
        this.people=Array.from({length:length},()=>null);
        this.isAnchored=false;
        this.myPos =  (length==1 ? posShort : posLong)[dir];
        this.drawing = null; // will be initialised in Display.setBoard
    }

    toString(){
        return this.dir+this.id
        // const res = `B${this.length}#${this.id}${this.dir}:${this.i}@${this.j}`
        // if (this.people.every(p=>p==null)) return res;
        // const ps = this.people.map(p=>p==null?"-":p.id)
        // return res + `[${ps.join(";")}]`
    }
        
    toState(){
        return JSON.stringify({id:this.id,i:this.i,j:this.j,dir:this.dir,length:this.length,
                               people:this.people.map(p=>p==null?null:p.id)})
    }
    
    static fromState(json){
        json = JSON.parse(json)
        const b = new Boat(json.id,json.i,json.j,json.dir,json.length);
        b.people=json.people.map(n=>n==null?null:n);
        b.isAnchored=json.people.every(p=>p!=null);
        return b;
    }
    
    possibleJumps(grid){
        const M=grid.M, N=grid.N;
        function check(i1,j1){
            return i1>=0 && i1<M && j1>=0 && j1<N && grid.get(i1,j1)==null
        }
        function board(p,i1,j1,boardPos){
            let people = [];
            for (const [di,dj] of boardPos){
                const i2=i1+di, j2=j1+dj;
                if (i2>=0 && i2<M && j2>=0 && j2<N && grid.get(i2,j2)!= null){
                    const person = grid.get(i2,j2);
                    if (person instanceof Person){
                        people.push(new Boarding(person,p))
                    }
                }
            }
            return people;
        }
        
        if (this.isAnchored) return [];
        let jumps = []
        let i=this.i, j=this.j, dir=this.dir, l=this.length; // to simplify notation
        const free = l==1 ? freeShort[this.dir] : freeLong[this.dir];
        const from= new C(i,j); // possible start of jump
        for (const d of allDirs){
            if (free[d].every(([di,dj])=>check(i+di,j+dj))){
                const [_,di,dj] = dir2rot[d];
                const i1=i-di,j1=j-dj;
                const to = new C(i1,j1);
                if (l==1){
                    const brd = this.people[0]==null ? board(0,i1,j1,boardShort[dir]) : []
                    if (brd.length==0) {
                        jumps.push(new Titanic_Jump(from,to,this.id,[]))
                    } else // board one people and give the choice to which one
                        brd.forEach(e=>jumps.push(new Titanic_Jump(from,to,this.id,[e])));
                } else {
                    const brd0 = this.people[0]==null ? board(0,i1,j1,boardLong0[dir]) : [];
                    const brd1 = this.people[1]==null ? board(1,i1,j1,boardLong1[dir]) : [];
                    if (brd0.length==0 && brd1.length==0)
                        jumps.push(new Titanic_Jump(from,to,this.id,[]))
                    else if (brd0.length==1 && brd1.length == 1) {// board two people in one Jump
                        jumps.push(new Titanic_Jump(from,to,this.id,[brd0[0],brd1[0]]));
                    } else { // board one people and give the choice to which one
                         [...brd0,...brd1].forEach(e=>jumps.push(new Titanic_Jump(from,to,this.id,[e])));     
                    }
                }
            }
        }
        return jumps;
    }
    
    // move this boat in "dir", on the grid taking into account some boardings
    play(dir,grid,boardings){
        // console.log("bateau:"+this+" dir:"+dir+":"+boardings);
        const l = this.length;
        let cases = (l==1 ? freeShort : freeLong)[this.dir][dir];
        if (cases.length==1){ // goes in the same direction as the boat
            let di = cases[0][0], dj = cases[0][1]; // move the boat
            grid.set(this.i+di,this.j+dj,this);
            // find the last cell of the boat to set it to null
            [di,dj] = this.myPos[dir==this.dir?l:0];
            grid.set(this.i+di,this.j+dj,null);
        } else { // go perpendicular from the boat direction
            const pos   = (this.length==1 ? posShort    : posLong)   [this.dir];
            cases.forEach(([di,dj],k)=> {
                grid.set(this.i+di,this.j+dj,this);
                grid.set(this.i+pos[k][0],this.j+pos[k][1],null);
            })
        }
        // update coordinates
        const [_,di,dj]=dir2rot[dir];
        this.i = this.i-di;
        this.j = this.j-dj;
        // should we board people
        for (const boarding of boardings){
            const pid = boarding.personId, 
                    ni = boarding.i, 
                    nj= boarding.j, 
                    pos=boarding.position;
            const pers = grid.get(ni,nj);
            if (!(pers instanceof Person) || pers.id != pid ||  pers.i!= ni || pers.j != nj){
                console.log("Problem with a boarding"+boarding.toJSON());
                debugger;
            }
            if (this.people[pos]!=null){
                console.log("Position "+pos+" is not free:"+this);
                debugger;
            }
            grid.set(ni,nj,null);
            this.people[pos]=pers;
            pers.boat = this;
            pers.i=-1;
            pers.j=-1
        }
        this.isAnchored = this.people.every(p=>p!=null)
        return   
    }

    draw(){
        const id=this.id, i=this.i, j=this.j, dir=this.dir,length=this.length;
        return svg("g", {id:"b"+id,transform:translate(j,i)+rotate(dir2rot[dir][0],0.5,0.5),
                          filter:isSafari?"none":"url(#shadow)"},
            svg("title",{},i+","+j),
            // in-line définition to allow change of troke-line through CSS
            // svg("use",{href:"#B"+longueur}),
            svg("path",{d:`M 0.5 0.9 L 0.9 0 v ${-(length-0.1)} h -0.8 v ${length-0.1} Z`,
                fill:"orange",
                class:"plain",
                "stroke-linejoin":"round"
                }),
            svg("circle",{cx:0.5,cy:-0.5,r:0.3,fill:"black"}),
            length==2 ? svg("circle",{cx:0.5,cy:-1.5,r:0.3,fill:"black"}) : null,
            cText(id,0.5,0.4,"black",0.3)
        )
    }
    
    move(newI=this.i,newJ=this.j){
        const [rot,_di,_dj] = dir2rot[this.dir];
        this.drawing.attr("transform",translate(newJ,newI)+rotate(rot,0.5,0.5));
        $("title",this.drawing).text(newI+","+newJ);        
    }
    
    // IMPORTANT: must be called after play
    displayJump(coup){
        //Caution: the added SVG elements are affected by the global transform
        const rot = dir2rot[this.dir][0];
        // make the boarding
        for (const boarding of coup.boardings){
            const pos=boarding.position;
            const pers=this.people[pos];
            this.drawing.append( 
                pers.drawing.attr("transform",translate(0,-pos-1)+rotate(-rot,0.5,0.5))
            )
        }
        if (this.isAnchored && $('use[href="#anchor"]',this.drawing).length==0){
            this.drawing.append(
                svg("use",{href:"#anchor"})
            )
        }
    }
    
    makeCurrent(){
        $(".current").removeClass("current")
        $("path",this.drawing).addClass("current");
    }


}
