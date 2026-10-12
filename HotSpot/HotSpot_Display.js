import {svg} from "../SVGtools.js"
import {Display,message,d} from "../Display.js"
export {HotSpot_Display}

const sw=0.05; // large stroke-width;

class HotSpot_Display extends Display {
        constructor(){
        super();
    }

    makeDefs($defs){
        super.makeDefs($defs);
        $defs.append(
            svg("g",{id:"green-robot"},
                svg("circle",{cx:0.5,cy:0.5,r:0.4,stroke:"black","stroke-width":sw,fill:"greenyellow"}),
                svg("circle",{cx:0.5,cy:0.5,r:0.25,stroke:"black","stroke-width":sw,fill:"none"})
                ),
            svg("g",{id:"blue-robot"},
                svg("circle",{cx:0.5,cy:0.5,r:0.5,stroke:"black","stroke-width":sw,fill:"dodgerblue"}),
                svg("circle",{cx:0.5,cy:0.5,r:0.25,stroke:"black","stroke-width":sw,fill:"none"})
                ),
            svg("g",{id:"red-robot"},
                svg("circle",{cx:0.5,cy:0.5,r:0.5,stroke:"black","stroke-width":sw,fill:"red"}),
                svg("circle",{cx:0.5,cy:0.5,r:0.25,stroke:"black","stroke-width":sw,fill:"none"})
                ),
        )
    }
    
    makeBackground($background,grid){ 
        $background.append(
            svg("rect",{x:-0.75,y:-0.75,width:5.5,height:5.5,rx:0.25,fill:"darkgray"}),
            svg("rect",{x:0,y:0,width:4,height:4,rx:0.25,fill:"royalblue"}),
            svg("circle",{cx:0.5,cy:0.5,r:0.75,fill:"royalblue"})
        )
        grid.forEach((i,j,_)=>
            $background.append(
                svg("circle",{cx:j+0.5,cy:i+0.5,r:0.3,fill:"none","stroke-width":sw,"stroke":"black"})
            ))
        $background.append(
            svg("circle",{cx:0.5,cy:0.5,r:0.5,fill:"red","stroke-width":sw,"stroke":"black"}),
            svg("circle",{cx:0.5,cy:0.5,r:0.4,fill:"none","stroke-width":sw,"stroke":"black"})

        )
    }
}

