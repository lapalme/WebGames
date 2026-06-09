import {svg,setSVGfactors} from "../SVGtools.js";
import {LaserMaze_Board,showMoves} from "./LaserMaze_Board.js";
import {LaserMaze_Display} from "./LaserMaze_Display.js";
import {solveWeb} from "../Solver.js"
import { buildProblemSelection,setLang,initLanguageHandlers } from "../Main.js";

import {startStates, levels} from "./Problems.js"

let problemNo;
let board,display;

function play(no,state){
    $("#bravo").remove();
    console.log(`play(${no},${state})`)
    board = new LaserMaze_Board(no,state,display);
}

function initEventHandlers() {
    buildProblemSelection(levels,Object.keys(startStates))
    $("input[name=state-no]:first").prop("checked",true); // check first state
        problemNo = parseInt($("input[name=state-no]:first").val())
        $("input[name=state-no]").on("click",(e)=> {
            problemNo = parseInt($(e.target).val());
            play(problemNo,startStates[problemNo]) 
        })
        $("#solve").on("mousedown",()=>
            solveWeb(problemNo,startStates[problemNo],LaserMaze_Board,display,showMoves));
        $("#reset").append(
            svg("use",{href:"#reset-def"})
        ).on("mousedown",()=>play(problemNo,startStates[problemNo]));
        $("#undo").append(
            svg("use",{href:"#undo-def"})
        ).on("mousedown",()=>display.undo())
        setLang("fr");     
}

$(document).ready(function() {
    // build the web page
    $("body").load("../body.html",function(){
        $("head title, .title").text("Laser Maze");
        $("#svg_element")
            .attr("viewBox","-0.5 -1.75 6 7.25")
            .attr("width","500px")
        setSVGfactors();
        initLanguageHandlers();
        initEventHandlers();
        display = new LaserMaze_Display();
        play(problemNo,startStates[problemNo]);
    })
});