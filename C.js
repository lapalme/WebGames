export {C}

// Coordinate 
class C {
    constructor (i,j){
        this.i = parseInt(i);
        this.j = parseInt(j);
    }
    
    toString(){
        return `${this.i}@${this.j}`
    }
    
    fromState(s){
        const [is,js] = s.split("@");
        return new C(parseInt(is,js))
    }
    
    translate(){
        return ` translate(${this.j},${this.i})`
    }
}