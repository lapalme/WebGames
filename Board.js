// abstract class for a Board
export {Board}

class  Board {
    constructor(no,state,display){
        this.no = no;
        this.state = state;
        this.display = display;
    }
    
    toState(){
         throw new Error("Board.toState: should be redefined in a subclass")       
    }
    
    possibleJumps(){
        throw new Error("Board.possibleJumps: should be redefined in a subclass")
    }
    
    isComplete(){
        throw new Error("Board.isComplete: should be redefined in a subclass")
    }
    
    play(jump){
        throw new Error("Board.play: should be redefined in a subclass")    
    }
    
    undo(jump){
        throw new Error("Board.undo: should be redefined in a subclass")         
    }
    
}