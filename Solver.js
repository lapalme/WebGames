import { jumps2moves } from "./Jump.js";
import {message,d} from "./Display.js";
export {solve,solveAll,solveWeb};

const fmt = new Intl.NumberFormat("fr-CA").format

function reorder(possibles,lastJump){
    let j; // index of the first jump not following lastJump
    for (j=0;j<possibles.length;j++){
        if (!(possibles[j].follows(lastJump)))break;
    }
    if (j<possibles.length){
        for (let i=j+1;i<possibles.length;i++){
            if (possibles[i].follows(lastJump)){ // swap elements
                [possibles[j],possibles[i]]=[possibles[i],possibles[j]];
                j++;
            }
        } 
    }    
}

function solve(no,state,Board,showMoves,TRACE=false){
    let done = new Set();    // already examined states
    let to_do = new Map();   // states to explore
    let lastJump = null;
    to_do.set(state,lastJump);
    while (to_do.size>0){
        const [state,lastJump] = to_do.entries().next().value; // get oldest Map entry
        to_do.delete(state);   // remove oldest entry
        done.add(state);
        let current = new Board(no,state);
        // console.log(current.isComplete())
        let possibles = current.possibleJumps();
        // if (lastJump != null) reorder(possibles,lastJump);
        if (TRACE && lastJump !=null && possibles.length>0){ // useful for debugging!!!
            console.log(current.toString());
            console.log(state);
            const [jumps,moves] = jumps2moves(lastJump);
            console.log(showMoves(moves),":",possibles.join(", ")) 
        }
        for (let i=0;i<possibles.length;i++){
            const jump = possibles[i];
            if (TRACE) console.log("play",jump.toString());
            current.play(jump);
            if (current.isComplete()){
                console.log("%d: Solution after %s iterations, %s states unexplored",no,fmt(done.size), fmt(to_do.size));
                return [current,jump.extend(lastJump)]
            } else {
                const state_new = current.toState();
                if (!done.has(state_new) && !to_do.has(state_new))
                    to_do.set(state_new,jump.extend(lastJump))
            }
            if (i<possibles.length-1) // avoid for the last step of the loop
                current = new Board(no,state) // recover current without the last jump
        }
        if (done.size % 10000 == 0){
            console.log("%d: iteration %s : %s states unexplored ",no,fmt(done.size),fmt(to_do.size))
        }
    }
    console.log("%d: No solution after %s iterations",no,fmt(done.size));
    return null;
}

function solveAll(problems,Board,showMoves,TRACE=false){
    let totalTime=0, nb=0;
    for (const key in problems){
        console.log("**",key,"**");
        const state = problems[key]
        const board = new Board(0,state); 
        console.log(board.toString()); // only for the display...
        const startTime = performance.now()
        const solution = solve(key,board.toState(),Board,showMoves,TRACE)
        const solutionTime = performance.now()-startTime;
        totalTime+=solutionTime;
        console.log(`${key}: Solving time: ${fmt(Math.trunc(solutionTime))} milliseconds`);
        if (solution!=null) {
            const [solutionState,jumps_inv] = solution;
            console.log(solutionState.toString());
            const [jumps,moves] = jumps2moves(jumps_inv);
            console.log("%d moves, %d jumps: %s",moves.length,jumps.length,showMoves(moves));
            nb++;
        } else {
            console.log("%d: No solution found!",key)
        }
    }
    console.log("Total time:%s milliseconds for %d problems: average: %s",fmt(Math.trunc(totalTime)),nb,fmt(Math.trunc(totalTime/nb)))    
}

function solveWeb(no,state,Board,display,showMoves){
    // this should display the "wait-cursor" during a "long" computation
    // but does not seem to always work in Chrome... at least during developement, seems to work in Safari/Friefox though  
    $("body").addClass("wait-cursor");
    setTimeout(()=>{ 
        const result = solve(no,state,Board,showMoves);
        $("#pieces").empty();
        if (result != null){
            const [moves_w,jumps_w] = $("input[name='lang']:checked").val()=="fr" ? 
                        [" coups,"," sauts: "] : [" moves,"," jumps: "]; 
            const [solutionState,jumps_inv] = result;
            const [jumps,moves] = jumps2moves(jumps_inv);
            message(d(no,2,":")+d(moves.length,3,moves_w)+d(jumps.length,3,jumps_w)+showMoves(moves)+"\n===");
            // display solution
            new Board(no,solutionState.toState(),display)        
        } else {
            message(d(no,2,": no solution"));
            // display initial state 
            new Board(no,state,display)    
        }
        $("body").removeClass("wait-cursor");
    },25)
}
