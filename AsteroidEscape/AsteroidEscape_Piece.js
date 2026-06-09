import {svg,translate,M,L,cText,rotate} from "../SVGtools.js"
import {Piece} from "../Piece.js"
import {rotateXY,Jump} from "../Jump.js"
import {Grid} from "../Grid.js"

export {AsteroidEscape_Piece}

//notation blocked positions around the center of a piece
//   CAUTION: these shifts are for x,y not i,j !!!
//        0       1      2      3
//  0 = -2,-2 | -1,-2 | 1,-2 | 2,-2
//            +--------------+
//  1 = -2,-1 | -1,-1 | 1,-1 | 2,-1
//                    +
//  2 = -2,1  | -1,1  | 1,1  | 2,1
//            +--------------+
//  3 = -2,2  | -1,2  | 1,2  | 2,2

const blocked = {
    "A": [[-2,-1],[-1,-1],[1,-1],[2,-1]],
    "B": [[-1,-2],[1,-2],[-1,-1],[1,-1]],
    "C": [[1,-2],[2,-2],[1,-1],[2,-1]],
    "D": [[1,-1]],
    "E": [[1,-1]],
    "F": [[1,-1]],
    "G": [[1,-1],[-1,1]],
    "H": [[-1,1],[1,1]],
    "_": [[-1,-1],[-1,1],[1,-1],[1,1]]
}


class AsteroidEscape_Piece extends Piece {
    constructor (id,i,j,ori){
        super(id,i,j)
        this.ori=ori;
        this.blocked= blocked[id]
        this.cells = new Grid(4,4);
        const c = id.toLowerCase();;
        for (const [i,j] of [[1,1],[1,2],[2,1],[2,2]])
            this.cells.set(i,j,c)
        for (let [x,y] of blocked[id]){
            const [xr,yr] = rotateXY(ori,x,y);
            this.cells.set(yr<0?yr+2:yr+1,xr<0?xr+2:xr+1,id);
        }
    }
    
    toString(){
        return this.toState()
    }
    
    show(){
        return this.cells.show(3)
    }
    
    toState(){
        return this.id+this.ori
    }
    
    // static fromState(state){
    //     //  create a piece from a state string
    // }
    
    // possibleJumps(grid){
    //     // TODO
    // }
    
    canMove(board_cells,di,dj){
        // check that this piece can move to the hole at hi,hj
        // while checking that all cells are free during the move
        const free = [this.id,this.id.toLowerCase(),null,"_"];
        // the plane should not move horizontally over a cell that outstreches
        if (this.id=="A" && dj!=0 && this.i<2){
            const c1 = board_cells.get(this.i*2+2,this.j*2+2*dj+1)
            const c2 = board_cells.get(this.i*2+2,this.j*2+2*dj+2);
            if (c1 == "B") return false; // B always blocks
            if (c1 == "C" && c2 == "_" && dj>0)return false
            if (c1 == "_" && c2 == "C" && dj<0)return false
        }
        // other move
        for (const k of [1,2]){
            for (let i=0;i<4;i++)
                for (let j=0;j<4;j++)
                    if (this.cells.get(i,j)==this.id){
                        // HACK: only i or j can be 1 at the same time
                        const c = board_cells.get(i+this.i*2+k*di, 
                                                  j+this.j*2+k*dj)
                        if (!free.includes(c) && c.toLowerCase()!=c)
                            return false
                    }
        }
        return true;
    }
    
    draw(){
        const drawings = {
            "A":svg("g",{id:"A"},
                    ...[-0.2,-0.05,1.05,1.2].map(x=>
                        svg("line",{x1:x,y1:0.05,x2:x,y2:0.35,stroke:"red","stroke-width":0.05})),
                    svg("path",{d:M(0.5,0)+L(1.3,0.1)+L(1.3,0.2)+L(0.6,0.55)+L(0.55,0.95)+
                                L(0.45,0.95)+L(0.4,0.55)+L(-0.3,0.2)+L(-0.3,0.1)+" Z",
                                fill:'lightgray',stroke:"white","stroke-width":0.01}),
                    svg("path",{d:M(0,0.05)+L(0,0.2)+L(1,0.2)+L(1,0.05),"fill":"transparent",
                                stroke:"white","stroke-width":0.02}),
                    svg("ellipse",{cx:0.5,cy:0.6,rx:0.05,ry:0.2,fill:"red",
                                stroke:"white","stroke-width":0.02})
                    ),
            "B":svg("g",{id:"B"},
                    svg("use",{href:"#asteroid-large",fill:"url(#gradient-1)",transform:translate(0.5,0.2)})
                    ),
            "C":svg("g",{id:"C"},
                    svg("use",{href:"#asteroid-large",fill:"url(#gradient-2)",transform:translate(0.75,0.2)}),
                    svg("use",{href:"#star",transform:translate(0.25,0.3)}),
                    svg("use",{href:"#star",transform:translate(0.75,0.75)})
                    ),
            "D":svg("g",{id:"D"},
                    svg("use",{href:"#asteroid",fill:"url(#gradient-1)",r:0.2,transform:translate(0.75,0.25)}),
                    svg("use",{href:"#star",transform:translate(0.3,0.7)}),
                    ),
            "E":svg("g",{id:"E"},
                    svg("use",{href:"#asteroid",fill:"url(#gradient-2)",r:0.2,transform:translate(0.75,0.25)}),
                    svg("use",{href:"#star",transform:translate(0.3,0.7)}),
                    ),
            "F":svg("g",{id:"F"},
                    svg("use",{href:"#asteroid",fill:"url(#gradient-3)",r:0.2,transform:translate(0.75,0.25)}),
                    svg("use",{href:"#star",transform:translate(0.3,0.7)}),
                    ),
            "G":svg("g",{id:"G"},
                    svg("use",{href:"#asteroid",fill:"url(#gradient-1)",r:0.2,transform:translate(0.75,0.25)}),
                    svg("use",{href:"#asteroid",fill:"url(#gradient-3)",r:0.2,transform:translate(0.25,0.75)}),
                    ),
            "H":svg("g",{id:"H"},
                    svg("use",{href:"#asteroid",fill:"url(#gradient-1)",r:0.2,transform:translate(0.25,0.75)}),
                    svg("use",{href:"#asteroid",fill:"url(#gradient-2)",r:0.2,transform:translate(0.75,0.75)}),
                    svg("use",{href:"#star",transform:translate(0.5,0.25)}),
                    ),
        }
        this.drawing = drawings[this.id];
        this.drawing.append(
            svg("title",{},this.id),
        )
        return this.drawing;
    }
}


