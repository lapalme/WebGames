import {Board} from "../Board.js"
import {Grid} from "../Grid.js"
import {Jump} from "../Jump.js"
import {Disk, Boat} from "./GrizzlyGears_Piece.js"
import { GrizzlyGears_Jump } from "./GrizzlyGears_Jump.js"

export {GrizzlyGears_Board,showMoves,ori2arrow}

function showMoves(jumpsList){
    let moves = []
    for (const jumps of jumpsList){
        let move = jumps[0];
        for (let k=1;k<jumps.length;k++) move+=(jumps[k].delta>0?"⤾":"⤿")
        moves.push(move)
    }    
    return moves.join(", ");
}

const colors = {
    "C": "lightskyblue",  // lumberjack
    "A": "pink",          // girl
    "E": "brown",         // bear
    "D": "tan",           // goat
    "B": "orange",        // beaver
    "F": "silver"         // hare
}

const ori2arrow  = {0:"↖︎",   1:"↗︎",  2:"↘︎",  3:"↙︎"}
const ori2didj   = {0:[-1,0],1:[0,1],2:[1,0],3:[0,-1]}
const invOri     = {0:2, 1:3, 2:0, 3: 1}

// in the same order as in GrizzlyGears_Display.js
const targetsPos = {"a":[0,0,3],"b":[1,0,3],"c":[2,0,3],
                    "d":[0,2,1],"e":[1,2,1],"f":[2,2,1]}

class GrizzlyGears_Board extends Board {
    constructor (no,state,display){
        super(no,state,display);
        this.grid = new Grid(3,3)
        let statep = JSON.parse(state)
        this.disks = []
        this.boats = []
        for (const [i,j,id,ori] of statep.disks){
            const disk = new Disk(`${id}${i}${j}`,i,j,id,ori);
            this.disks.push(disk);
            this.grid.set(i,j,disk)
        }
        for (const [i,j,id,ori] of statep.boats){
            const boat = new Boat(id,i,j,ori);
            this.boats.push(boat)
            // add boats to one or more disks
            const disk = this.grid.get(i,j);
            disk.addBoat(boat,ori);
            const [di,dj]=ori2didj[ori]
            const i1=i+di, j1=j+dj;
            if (this.grid.check(i1,j1))
                this.grid.get(i1,j1).addBoat(boat,invOri[ori])
        }
        if (display != null) // this call must come after pieces have been added
            display.setBoard(this);
    }
    
    toString(){
        let newGrid = new Grid(3,3," ") 
        this.grid.forEach((i,j,disk)=>{
            let v = disk.kind=="H" ? ori2arrow[disk.ori] 
                             : ["-","|","-","|"][disk.ori]
            for (let k=0;k<4;k++){
                const side = disk.sides[k];
                if (side instanceof Boat)
                    v+=k+side.id
            }
            newGrid.set(i,j,v)
        })
        let boatsStr=this.boats.map(b=>b.id+b.i+b.j+":"+b.ori)
        return newGrid.show(6)+"\nBoats:"+boatsStr;
    }

    toState(){
        return JSON.stringify({disks:this.disks.map(d=>d.toState()),
                               boats:this.boats.map(b=>b.toState())})
    }
    
    possibleJumps(){
        let jumps=[];
        for (const disk of this.disks){
            if (disk.canTurn(this.grid,1))
                jumps.push(new GrizzlyGears_Jump([disk.i,disk.j],1))
             if (disk.canTurn(this.grid,-1))
               jumps.push(new GrizzlyGears_Jump([disk.i,disk.j],-1))
        }
        return jumps
    }
    
    isComplete(){
        return this.boats.every(b => {const [i,j,ori] = targetsPos[b.id];
                                      return b.i==i &&  b.j==j && b.ori==ori})
    }
    
    play(jump){
        // console.log(jump.toString())
        const disk = this.grid.get(jump.from.i, jump.from.j)
        disk.turn(this.grid,jump.delta)
        // console.log(this.toString())
    }
    
    undo(jump){
        jump.delta = -jump.delta
        this.play(jump)
    }
    
}