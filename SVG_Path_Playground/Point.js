import { svg } from "../SVGtools.js";
export {$makeTextBox,round,Point}

function $makeTextBox(id,value){
    return $(`<input type='text' id='${id}' size='10' value='${value}'>`)
}

function round(x){return parseFloat(x.toFixed($("#nbDecimals").val()))}

class Point {
    static nbP = 0;
    constructor (x,y,pointChanged){
        this.x=round(x);
        this.y=round(y);
        this.no = Point.nbP++;
        this.textbox = $makeTextBox("P"+this.no,this.toPath())
            .data({pt:this})
            .on("change",pointChanged);
        this.drawing = svg("circle",{cx:this.x,cy:this.y,r:"0.5%"});
        $("#points").append(this.drawing);
    }
    
    toString(){return this.toPath()}
        
    toPath(){
        return this.x+","+this.y;
    }
    
    move(newX,newY){
        this.x=round(newX);
        this.y=round(newY);
        this.drawing.attr({cx:this.x,cy:this.y})
        $("#P"+this.no).val(this.toPath())
    }
}
