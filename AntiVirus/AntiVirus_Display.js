import {svg,makePoints,translate,rotate,M as MV,L,Q,C,S,A,cText,
        translateSVG_rel,translateSVG,getPos} from "../SVGtools.js"
import {Display,message,d} from "../Display.js"
import {showMoves,M, N} from "./AntiVirus_Board.js"

export {AntiVirus_Display}

// let allJumps;

const nbCells = [2,4,6,8,8,6,4,2]

class AntiVirus_Display extends Display {
        constructor(){
        super();
    }

    makeDefs($defs){
        super.makeDefs($defs);
        $defs.append(
            svg("g",{id:"cell-def"},
                 svg("rect",{width:1,height:1,stroke:"gray","stroke-width":0.05,fill:"lightgray"}),
                 ),
            svg("g",{id:"half-cell-def"},
                 svg("rect",{width:0.5,height:1,stroke:"gray","stroke-width":0.05,fill:"lightgray"})),
        )
    }
    
    makeBackground($background){
        const plate = svg("g",{})
        let k;
        for (let i=0;i<M;i++){
            const n=(8-nbCells[i])/2
            plate.append(svg("use",{href:"#half-cell-def",transform:translate(n+0.5,i)}))
            k = (i==0 || i>3) ? 0 : -1;
            for (let j=1;j<nbCells[i]-1;j++){
                plate.append(
                    svg("use",{href:"#cell-def",transform:translate(n+j,i)})
                )
                if (k>=0)
                    plate.append(
                        cText(i+","+k,n+j,i,"black",0.2).attr({"transform":rotate(45,n+j,i),class:"display-coord"})
                    )
                k++;
            }
            const j=n+nbCells[i]-1;
            plate.append(svg("use",{href:"#half-cell-def",transform:translate(j,i)}))
            if (k>=0)
                plate.append(
                    cText(i+","+k,j,i,"black",0.2).attr({"transform":rotate(45,j,i),class:"display-coord"})
                )
        }
        $background.append(plate,
            svg("polygon",{points:makePoints([4.5,0, 4.5,1, 7.5,4, 4,7.5, 0.5,4, 3.5,1, 3.5,0,
                                               -0.5,4, 4,8.5, 8.5,4]),
                             fill:"#F0F0F0",stroke:"white","stroke-width":0.1})
        ).attr("transform",rotate(-45,N/2,M/2))
    }
        
    pieceFromId(id){
        return this.board.pieces.find(p=>p.id == id);
    }
        
    setBoard(board){
        $("#pieces").attr("transform",rotate(-45,N/2,M/2))
        super.setBoard(board);
        $(".display-coord").hide(); // hidden hack... documented in problems.js
    }
}
