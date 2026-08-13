import {svg,setSVGfactors,getPos} from "../SVGtools.js"
import { $makeTextBox, round, Point } from "./Point.js";
import { Command,Commands } from "./Commands.js";

export {flagsChanged, radiusChanged}

let grid_unit, graph_area, the_points, commands, nbDecimals, last_used_point;

const nbPoints ={"M":1,"L":1,"T":1,"Q":2,"S":2,"C":3,"A":1}

function setGrid($grid){
    // version of cText without stroke, only fill
    function text(text,x,y,fill="black",fsize="0.1"){
        return svg("text",{x:x,y:y,
                        "text-anchor":"middle",
                        "dominant-baseline":"central", "alignment-baseline":"middle",
                        "font-family":"sans-serif","font-size":fsize,fill:fill},
                    text)
    }
    $grid.empty();
    const nb = parseInt($("#lines").val())
    const minx = parseFloat($("#min-x").val())
    const miny = parseFloat($("#min-y").val())
    const dimension = parseFloat($("#dimension").val())
    graph_area = [minx,minx+dimension,miny,miny+dimension]
    const padding = dimension*0.05
    $grid.append(
        svg("rect",{x:minx,y:miny,width:dimension,height:dimension,
                    fill:"aliceblue",stroke:"black","stroke-width":"0.2%"})
    )
    grid_unit = dimension/nb;
    const axis_unit = nb/10;
    // add horizontal lines
    for (let i=1;i<nb;i++){
        const y = miny+i*grid_unit;
        if ( nb<=10 || i%axis_unit == 0) // aed axis values
            $grid.append(text(round(y),minx-padding/2,y,"black","0.03"))
        $grid.append(
            svg("line",{x1:minx,y1:y,x2:minx+dimension,y2:miny+i*grid_unit})
        )
    }
    // vertical lines
    const maxy=miny+dimension
    for (let j=1;j<nb;j++){
        const x = minx+j*grid_unit;
        if (nb<=10 || j % axis_unit == 0) // aed axis values
            $grid.append(text(round(x),x,maxy+padding/2,"black","0.03"))
        $grid.append(
            svg("line",{x1:x,y1:miny,x2:x,y2:miny+dimension})
        )
    }
}

function isNear(x0,y0,x1,y1){
    const dist2 = (x0-x1)*(x0-x1)+(y0-y1)*(y0-y1);
    return dist2 < grid_unit*0.01       
}


function parseDefinitions(e){
    // match a command or a number 
    const pathRE = /(?<cmd>[A-Za-z])|(?<num>[+-]?(\d+(\.\d*)?|\.\d+)([eE][+-]?\d+)?)/g

    init(false)
    const ms = [...$("#trace").val().matchAll(pathRE)];
    // split in commands
    let cmds = [], cmd=[];
    for (let k=0;k<ms.length;k++){
        const v = ms[k].groups;
        if (v.cmd){
            if (nbPoints[v.cmd]===undefined){
                alert(`Bad command ${v.cmd} at position ${ms[k].index}`);
                return;
            }
            if (cmd.length>0) cmds.push(cmd);
            cmd = [v.cmd]
        } else if (v.num){
            const val = parseFloat(v.num);
            if (!isNaN(val))
                cmd.push(val)
            else {
                alert(`Bad path ${ms[k].index} at ${v.num}: %s`);
                return
            }
        } else {
            alert(`Bad path at: ${ms(k).index}`);
            return
        }
    }
    if (cmd.length>0)cmds.push(cmd);
    commands = new Commands();
    for (const cmd of cmds){
        const l = cmd[0]
        if (l == "A"){
           if (cmd.length!=8){
                alert(`Bad number of parameters for A`);
                return;
           }
           const pt = new Point(cmd[6],cmd[7],pointChanged)
           commands.add(new Command("A",[pt],cmd.slice(1,6)))
        } else {
            const nb = nbPoints[l];
            if (nb != (cmd.length-1)/2){
                alert(`Bad number of parameters for ${l}`);
                return;
            }
            for (let k=1;k<cmd.length;k+=2){
                const pt = new Point(cmd[k],cmd[k+1],pointChanged);
                the_points.push(pt)
            }
            commands.add(new Command(l,the_points.slice(-nb)))

        }
    }
    commands.update_path()
}

function parseVals(str,nb){
    const vals = str.split(",")
    if (vals.length != nb) return null;
    let res = []
    for (let k=0;k<nb;k++){
        const val = parseFloat(vals[k])
        if (isNaN(val))return null;
        res.push(val)
    }
    return res
}

function pointChanged(e){
    const pt = $(this).data("pt");
    const savedVal = pt.toPath();
    const res = parseVals($(this).val(),2)
    if (res==null)
        $(this).val(saveVal)
    else {
        const [newX,newY] = res;
        if (newX!=pt.x || newY != pt.y){
            pt.move(newX,newY)  
            commands.update_path();
        }
    }
}

function radiusChanged(e){
    const cmd = $(this).data("command")
    const savedVal = cmd.radius;
    const res = parseVals($(this).val(),2)
    if (res==null)
        $(this).val(savedVal)
    else {
        cmd.radius = res.map(round).join(",");
        commands.update_path();
    }
}

function flagsChanged(e){
    const cmd = $(this).data("command")
    const savedVal = cmd.flags;
    const res = parseVals($(this).val(),3)
    if (res==null)
        $(this).val(savedVal)
    else {
        cmd.flags = res.map(round).join(",");
        commands.update_path();
    }
}

function doCommand(e){
    const cmd = $(this).val().charAt(0);
    const nb=nbPoints[cmd]
    const nbUsed = commands.nbUsedPoints;
    // check that enough points have be given
    const nbMissing = nbUsed+nb-the_points.length;
    if (nbMissing>0){
        alert(`Missing ${nbMissing} point${nbMissing>1 ? "s" : ""}`);
        return;
    } 
    // clear unused points
    let k=the_points.length-nb-1;
    while(k>=nbUsed){
        // console.log("removing",k,the_points[k].toPath())
        the_points[k].drawing.remove();
        the_points.splice(k,1);
        k--;
    }
    if (the_points.length-k<nb)return;
    commands.add(new Command(cmd,the_points.slice(-nb)))
}


function undo(){
    if (commands.isEmpty()){
        init();
        return;
    }
    const removed_s=commands.remove();
    for (let k=0;k<removed_s.points.length;k++){
        if (the_points.length==0) break;
        const pt = the_points.pop();
        pt.drawing.remove()
    }
    commands.update_path();
}

function mousedown(e){
    let [x,y] = getPos(e);
    // check that the point is within the graph area not the axis
    const [minx,maxx,miny,maxy] = graph_area  
    if (x<minx || x>maxx || y<miny || y>maxy) return;
    // is the on an existing point
    const idx = the_points.findIndex(p=>isNear(x,y,p.x,p.y))
    if (idx<0){
        the_points.push(new Point(x,y,pointChanged));
        commands.update_path();
    } else {
        const pt = the_points[idx];
        const $svg_element = $("#svg_element");
        $svg_element.on("mousemove",function(e1){
            const [x1,y1] = getPos(e1);
            pt.move(x1,y1);
            commands.update_path();
        })
        $svg_element.on("mouseup",function(e2){
            $svg_element.off("mousemove");
            $svg_element.off("mouseup");
            commands.update_path();
        })
    }   
}

const lang="en";

function addListeners(){
    $("#svg_element").on("mousedown",mousedown);
    $("#M,#L,#Q,#T,#C,#S,#A").on("click",doCommand)
    $("#rx,#ry,#x-axis-rot,#large-arc,#sweep").on("change",()=>commands.update_path());
    $("#undo").on("click",undo);
    $("#clear").on("click",()=>init(true))
    $("#parse").on("click",parseDefinitions)
    $("#reset-vb").on("click",resetViewBox)
    nbDecimals=$("#nbDecimals").val()
    $("#nbDecimals").on("change",function (e){
        nbDecimals=$("#nbDecimals").val()
    })
    $(window).on("resize",setSVGfactors)
    $("#explanation").hide();
    $("#hide-show-explanation").click(function(){
        $("#explanation").toggle();
        if ($("#explanation").is(":visible")){
            $(`#show-${lang}-expl`).hide();
            $(`#hide-${lang}-expl`).show();
        } else {
            $(`#show-${lang}-expl`).show();
            $(`#hide-${lang}-expl`).hide();
        }
        setSVGfactors();
    });
}

function init(clearTrace=true){
    if(clearTrace)$("#trace").val("");
    $("#points").empty();
    the_points = [];
    commands = new Commands();
    $("#path").attr("d","")
}

function resetViewBox(){
    const dimension = parseFloat($("#dimension").val())
    const padding = dimension*0.05;
    const minX = parseFloat($("#min-x").val());
    const minY = parseFloat($("#min-y").val());
    const vb= (minX-padding)+" "+(minY)+" "+(dimension+padding)+" "+(dimension+padding)
    $("#svg_element").attr("viewBox",vb);
    setSVGfactors();
    setGrid($("#grid")); 
    init();
}

$(document).ready(function() {
    addListeners();
    resetViewBox();
});