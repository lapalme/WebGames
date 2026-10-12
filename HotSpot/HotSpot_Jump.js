import { Jump } from "../Jump.js"

export {HotSpot_Jump}

const ori2let = {"↑":"U","→":"R","↓":"D","←":"L"}

class HotSpot_Jump extends Jump{
    constructor(from,to,pid){
        super(from,to)
        this.pid = pid;
    }
    
    // recreate the notation used in the cards of the game
    toString(){
        return (this.pid=="0"?"X":this.pid)+ori2let[super.arrow()]
    }
    
    moveToString(){
        return "/"+ori2let[super.arrow()]
    }
    
}
