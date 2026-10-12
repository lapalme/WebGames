import {svg,translate} from "../SVGtools.js"
import {Display} from "../Display.js"
export {RushHour_Display}


class RushHour_Display extends Display {
    makeDefs($defs){
        const dims = {x:0.1,y:0.1,width:0.80,height:0.80}
        super.makeDefs($defs);
        $defs.append(
            svg("g",{id:"fond-def"},
                svg("rect",{width:1,height:1,fill:"#C0C0C0"}),
                svg("rect", Object.assign({"stroke":"#708090","stroke-width":0.02,fill:"#d3D3D3"},dims))
            ),
        )
    }
    
    makeBackground($background,grid){ 
        $background.append(
            svg("rect",{x:-0.5,y:-0.5,width:7,height:7,fill:"#C0C0C0"}),
            svg("rect",{x:-0.1,y:-0.1,width:6.2,height:6.2,rx:0.1,stroke:"blue", "stroke-width":0.1})
        );
        // draw cells
        grid.forEach((i,j,v)=>{
            $background.append(
                svg("use",{href:"#fond-def",transform:translate(j,i)},
                        svg("title",{},i+","+j))
            )})
        // draw exit
        $background.append(
            svg("use",{href:"#fond-def",transform:translate(6,2)})
        )
    }
}
