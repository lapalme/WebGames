import {svg,cText} from "../SVGtools.js"
import {Display} from "../Display.js"

// import {M,N} from "./ToadsNFrogs_Board.js";
export {ToadsNFrogs_Display}

class ToadsNFrogs_Display extends Display {
    makeDefs($defs){
        super.makeDefs($defs);
        $defs.append(
            svg("rect",{id:"case",x:0,y:0,width:1,height:1,fill:"white",
                        stroke:"black","stroke-width":0.005}),
            svg("image",{id:"toad",href:"Toad.jpg",x:0.1,y:0.1,width:0.8,height:0.8}),
            svg("image",{id:"frog",href:"Frog.jpg",x:0.1,y:0.1,width:0.8,height:0.8}),
        )
    }
    
    makeBackground($background,grid){
        for (let k=0;k<grid.N;k++){ 
            $background.append(svg("use",{href:"#case",x:k,y:0}),
                               cText(""+k,k+0.5,0.95,"black",0.1))
        }
    }

    setBoard(board){
        $("#svg_element")
            .attr("viewBox",`0 0 ${board.grid.N} 1`)
            .attr("width",board.grid.N*100)
        super.setBoard(board)
    }
}
