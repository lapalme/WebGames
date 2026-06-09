import {Board} from "../Board.js"
import {Grid} from "../Grid.js"
import {Plank,Stump} from "./RiverCrossing_Piece.js"
import { RiverCrossing_Jump } from "./RiverCrossing_Jump.js"
import { letter2ij, normalizePlankId } from "./Problems.js"

export {RiverCrossing_Board,showMoves}

function showMoves(jumpsList){    
    return jumpsList.join();// TODO: change if needed
}

class RiverCrossing_Board extends Board {
    constructor (no,state,display){
        super(no,state,display);
        this.grid = new Grid(7,5);
        let {stumps,planks} = JSON.parse(state)
        this.hikerPlank=null;
        this.stumps=[]
        for (let stump of stumps){
            const [i,j]=letter2ij[stump];
            const st = new Stump(stump,i,j)
            this.grid.set(i,j,st)
            this.stumps.push(st);
        }
        let id=1;
        this.planks = []
        this.activePlanks = null; // updated in this.possibleJumps()
        for (let plankL of planks){
            const [i1,j1] = letter2ij[plankL.charAt(0)];
            const stump1 = this.grid.get(i1,j1)
            const [i2,j2] = letter2ij[plankL.charAt(1)];
            const stump2 = this.grid.get(i2,j2)
            const plank = new Plank(id++,stump1,stump2); // plank
            if (plankL.length==3){
                this.hikerPlank=plank
                plank.hasHiker = true;
            }
            this.planks.push(plank);
        }
        // add pieces
        if (display != null) // this call must come after pieces have been added
            display.setBoard(this);
    }

    toState(){
        let stumps=[];
        this.grid.forEach((i,j,s)=>{
            if (s!=null)stumps.push(s.toState())
        })
        return JSON.stringify({stumps:stumps,planks:this.planks.map(p=>p.toState())})     
    }
    
    toString(){
        let newGrid = new Grid(this.grid.M,this.grid.N);
        this.grid.forEach((i,j,stump)=>{
            if(stump != null){
                let s = stump.id;
                stump.planks.forEach(plank=>{
                    s+=plank.name().replace(stump.id,"")
                })
                newGrid.set(i,j,s)
            }
        })
        return newGrid.show(5)
    }
    
    // find all possible planks ids at distance the length from a given stump
    possiblePlankIds(from,l){
        let i = from.i, j=from.j
        let res = [];
        for (let [di,dj] of [[-l,0],[l,0],[0,-l],[0,l]]){
            let idi=i+di,jdj=j+dj;
            if (this.grid.check(idi,jdj)){
                const stump = this.grid.get(idi,jdj);
                if (stump !=null){
                    if (l>=2){// check that there is no stump in between...
                        // compute unit step, we are sure that it is within the grid
                        const di_l = di/l, dj_l=dj/l;  
                        if (this.grid.get(i+di_l,j+dj_l)!=null)continue
                        if (l==3 && this.grid.get(i+2*di_l,j+2*dj_l))continue;
                    }
                    res.push(normalizePlankId(from.id,stump.id))
                }
            }
        }
        // console.log("possiblePlanks",from.id,l,":",res.join(", "))
        return res;
    }
    
    possibleJumps(){
        let jumps = []
        // find all "active" planks and their names touching the one with the hiker
        // by adding touching planks until no new one can be added
        this.activePlanks = new Set([this.hikerPlank]);  // Set of planks
        let activeNames  = new Set([this.hikerPlank.name()])
        // set of "active" stumps: i.e. touching any active plank
        let activeStumps = new Set([this.hikerPlank.from,this.hikerPlank.to]);
        let changed=true;
        while (changed){
            changed=false
            for (const pl of this.planks){
                if (!this.activePlanks.has(pl) && this.activePlanks.values().some(ap=>ap.touches(pl))){
                    this.activePlanks.add(pl);
                    activeNames.add(pl.name());
                    activeStumps.add(pl.from).add(pl.to);
                    changed=true;
                }
            }
        }
        // try to add any activePlank at the end of activeStumps
        for (const activePl of this.activePlanks){
            for (const activeStump of activeStumps){
                for (const pName of this.possiblePlankIds(activeStump,activePl.length)){
                    if (!activeNames.has(pName)){
                        // check that activePl does not intersect any other plank
                        const idx = this.planks.findIndex(p=>p!=activePl && p.intersects(pName))
                        if (idx<0){
                            jumps.push(new RiverCrossing_Jump(activePl.name(),pName))
                        }
                    }
                }
            }
        }
        return jumps        
    }
    
    isComplete(){
        return this.planks.some(p=>p.from.isOnUpperBank())
    }
    
    play(jump){
        const fromName = jump.fromPname;
        // remove the old plank
        const idx = this.planks.findIndex(p=>p.name()==fromName);
        if (idx<0) debugger;
        const plank=this.planks[idx];
        plank.from.removePlank(plank);
        plank.to.removePlank(plank);
        this.hikerPlank.hasHiker=false;
        // add the new plank
        const toName = jump.toPname;
        const fromS = this.grid.get(letter2ij[toName.charAt(0)]);
        const toS = this.grid.get(letter2ij[toName.charAt(1)]);
        plank.moveAt(fromS,toS);
        plank.hasHiker=true;
        this.hikerPlank=plank; 
    }
        
    undo(jump){
        this.play(new RiverCrossing_Jump(jump.toPname,jump.fromPname))
    }
}