import {Board} from "../Board.js"
import {Grid} from "../Grid.js"
import {dir2rot} from "../Jump.js"
import {Boat} from "./Boat.js"
import {Person} from "./Person.js"

export {Titanic_Board,showMoves,M,N}

function showMoves(jumpsList){ 
    let moves = [];
    for (const jumps of jumpsList){        
        let res = jumps[0].toString();
        for (let i=1;i<jumps.length;i++)
            res += jumps[i].dir+[jumps[i].boardings.map(b=>b.personId)].join("")
        moves.push(res)
    }
    return moves.join(", ")
}

const M=6,N=6;

class Titanic_Board extends Board {
    constructor (no,state,display){
        super(no,state,display);
        Titanic_Board.fromState(this,state);
        if (display != null) // this call must come after pieces have been added
            display.setBoard(this);
    }
    
    toString(){
        return this.grid.show(3)
    }

    toState(){
         return JSON.stringify({people:this.people.map(p=>p.toState()),
                                boats:this.boats.map(b=>b.toState())})
    }
        
    static fromState(self,json){
        function initBoat(b,grid,people){
            // update grid
            grid.set(b.i,b.j,b);
            const [_,di,dj]=dir2rot[b.dir];
            grid.set(b.i+di,b.j+dj,b);
            if(b.length==2)grid.set(b.i+di+di,b.j+dj+dj,b)
            // update people
            b.people = b.people.map(pid=>pid==null?null:people[people.findIndex(p=>p.id==pid)])
            
        }
        self.grid = new Grid(M,N);
        const state = JSON.parse(json);
        self.people = state.people.map(pstate=>Person.fromState(pstate));
        self.boats = state.boats.map(bstate=>Boat.fromState(bstate));
        // update the grid
        self.people.forEach(p=>{if (p.i>=0) self.grid.set(p.i,p.j,p)});
        self.boats.forEach(b=>initBoat(b,self.grid,self.people))
    }
    
    possibleJumps(){
        return this.boats.map(b=>b.possibleJumps(this.grid)).flat()
    }
    
    isComplete(){
        return this.people.every(p=>p.i<0);
    }
    
    play(jump){
        const boat = this.grid.get(jump.from.i,jump.from.j);
        if (boat==null) debugger;
        boat.play(jump.dir,this.grid,jump.boardings);
        return boat;
    }
    
    id2person(id){
        const idx = this.people.findIndex(p=>p.id==id);
        if (idx<0){
            console.log("id2person:id %s not found",id);
            debugger;
        }
        return this.people[idx]
    }

    
    undo(jump){
        throw new Error("Board.undo: should be redefined in a subclass")         
    }
    
}