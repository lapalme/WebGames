import {svg,setSVGfactors,getPos} from "../SVGtools.js"
import { $makeTextBox } from "./Point.js";
import {radiusChanged,flagsChanged} from "./SVG_PP.js"
export {Commands,Command}

class Command{
    static nbC=0;
    constructor(kind,points,params=[]){
        this.kind=kind;
        this.points=points;
        this.no = Command.nbC++;
        if (this.kind == "A" ){
            if (params.length==0){
                this.radius = $("#rx").val()+","+$("#ry").val()
                this.flags = $("#x-axis-rot").val()+","+$("#large-arc").val()+","
                            +$("#sweep").val()
            } else { // called by parse
                this.radius = params[0]+","+params[1]
                this.flags  = params[2]+","+params[3]+","+params[4]
            }
        } 
    }
    
    toPath(){
        if (this.kind=="A"){
            return "A "+this.radius+" "+this.flags+" "+this.points[0].toPath();
        }
        return this.kind+this.points.map(p=>" "+p.toPath());
    }
    
    toTableLine(){
        const $tr = $(`<tr id="C${this.no}" />`);
        $tr.append(`<th>${this.kind}</th>`)
        let $td = $("<td/>")
        switch (this.kind) {
            case "M":case "L":case "T":
                $td.append(this.points[0].textbox)
                break;
            case "Q":case "S":
                $td.append(
                    this.points[0].textbox,$("<br/>"),
                    this.points[1].textbox)
                break;
            case "C":
                $td.append(
                    this.points[0].textbox,$("<br/>"),
                    this.points[1].textbox,$("<br/>"),
                    this.points[2].textbox)
                break;
            case "A":
                const radiusTB=$makeTextBox("Ar"+this.no,this.radius)
                    .data({command:this})
                    .on("change",radiusChanged)
                const flagsTB =$makeTextBox("Af"+this.no,this.flags)
                    .data({command:this})
                    .on("change",flagsChanged)
                $td.append(
                    radiusTB,$("<br/>"),
                    flagsTB,$("<br/>"),
                    this.points[0].textbox)
                break;
            default:
                console.log("bad command:",this.kind)
                debugger;
                break;
        }
        $tr.append($td)
        return $tr;
    }
}


class Commands {
    constructor(){
        this.commands=[];
        this.nbUsedPoints = 0;
        this.$table = $("#commands");
        this.$table.empty(); 
        this.$table.append($("<tr><th colspan='2'>Commands</th></tr>"))
    }
    
    isEmpty(){return this.commands.length==0}
    
    add(command){
        this.commands.push(command);
        this.nbUsedPoints += command.points.length;
        this.$table.append(command.toTableLine())
        this.update_path()
    }
    
    remove(idx=this.commands.length-1){
        const removed = this.commands.splice(idx,1)[0];
        $("#C"+removed.no).remove();
        this.nbUsedPoints-=removed.points.length;
        this.update_path();
        return removed
    }
    
    update_path(){
        const d = this.commands.map(cmd=>cmd.toPath()).join(" ")
        $("#path").attr("d",d)
        $("#trace").val(d)
    }
}


