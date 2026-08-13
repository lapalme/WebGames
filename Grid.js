export {Grid}

function centerPad(str, length) {
  if (str.length >= length)return str;
  const leftPadding = Math.floor((length - str.length) / 2);
  return str.padStart(str.length + leftPadding).padEnd(length);
};

class Grid {
    constructor (M,N,fill=null){
        this.M = M;
        this.N = N;
        this.elems = Array.from({length:M},
                           _=> Array.from({length:N},_=>fill))
    }
    
    // Display of the grid
    toString(){
        let width;
        // use the length of the first non-null value...
        top: for (let i=0;i<this.M;i++)
                for (let j=0;j<this.N;j++)
                    if (this.elems[i][j]!=null){
                        width=String(this.elems[i][j]).length+1;
                        break top;
                    }
        if (width != undefined)
            return this.show(width) 
        return this.show(2)
    } 
    
    // Show the grid elements on width chars, if null display null_val
    show(width=1,null_val="."){
        const w0=this.M.toString().length // width of row numbers at the left
        let lines= [" ".repeat(w0)+":"+
                    Array.from({length:this.N},(_,k)=>k).map(v=>centerPad(String(v),width)).join("")]
        for (let i=0;i<this.M;i++){
            let line = [];
            for (let j=0;j<this.N;j++){
                const v = this.elems[i][j]
                line.push(v==null ? null_val : v.toString())
            }
            lines.push([i.toString().padStart(w0)+":"]+
                       line.map(v=>String(v).padStart(width)).join(""))
        }
        return lines.join("\n")        
    } 
    
    get(i,j){
        if (Array.isArray(i)){j=i[1],i=i[0]}  // allow indexing with [i,j]
        return this.elems[i][j]
    }
    
    set(i,j,val){
        this.elems[i][j]=val;
    }
    
    //  does [i,j] a valid index
    check(i,j){
        return 0<=i && i<this.M && 0<=j && j<this.N;
    }
    
    // element [i,j] exists and is null
    isNull(i,j){
        return this.check(i,j) && this.elems[i][j]==null;
    }
    
    /// functions for manipulating grid elements
    // action is a function with args (i,j,value at i,j)
    // modify each cell
    forEach(action){
        for (let i=0;i<this.M;i++)
            for (let j=0;j<this.N;j++)
                action(i,j,this.elems[i][j])
    }
    
    // create a new grid by transforming the original with the action
    map(action){
        let newGrid = new Grid(this.M,this.N)
        this.forEach((i,j,v)=>newGrid.set(i,j,action(i,j,v)))
        return newGrid;
    }
    
    // create a copy of this grid 
    copy(){
        return this.map((_i,_j,v)=>v)
    }

    // return the [i,j] that satisfy the action(v)
    findIndex(action){
        for (let i=0;i<this.M;i++)
            for (let j=0;j<this.N;j++)
                if (action(this.elems[i][j])) return [i,j]
        return null
    }
    
    // check that another grid has the same values at the same indices
    isSameAs(that){
        if (this.M != that.M || this.N != that.N){
            console.log("*** Grid.isSameAs applied to grids of different dimensions")
            debugger;
        }
        for (let i=0;i<this.M;i++)
            for (let j=0;j<this.N;j++)
                if (this.elems[i][j]!=that.elems[i][j])return false
        return true        
    }
}

//// a few unit tests
// const g1 = new Grid(2,3);
// g1.forEach((i,j)=>g1.set(i,j,i+j))
// console.log("g1\n"+g1.show(3))
// const g2=g1.map((i,j,v)=>v*2);
// console.log("g2\n"+g2.show(3))
// const g3 = g2.copy()
// console.log("g3\n"+g3.show())
// console.log(`${g3.findIndex(v=>v!=0)}`)
// console.log(g1.isSameAs(g2))
// console.log(g2.isSameAs(g3))