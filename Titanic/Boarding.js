export {Boarding}

class Boarding{
    constructor (people,p){
        this.personId = people.id;
        this.i = people.i;
        this.j = people.j;
        this.position = p;
    }
    
    toString(){
        return `Brd${this.personId}:${this.i}@${this.j}:${this.position}`
    }
    
    toJSON(){
        return JSON.stringify({id:this.personId,i:this.i,j:this.j,position:this.position})
    }
    
    static fromJSON(json){
        json = JSON.parse(json);
        return new Boarding(json.id,json.i,json.j,json.position)
    }
}