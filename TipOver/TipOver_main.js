import {svg,setSVGfactors} from "../SVGtools.js";
import {TipOver_Board,showMoves} from "./TipOver_Board.js";
import {TipOver_Display} from "./TipOver_Display.js";
import {solveWeb} from "../Solver.js"
import { buildProblemSelection,setLang,initLanguageHandlers } from "../Main.js";

import {startStates, levels} from "./Problems.js"

let problemNo;
let board,display;

function play(no,state){
    $("#bravo").remove();
    console.log(`play(${no},${state})`)
    board = new TipOver_Board(no,state,display);
}

function initEventHandlers() {
    buildProblemSelection(levels,Object.keys(startStates))
    $("input[name=state-no]:first").prop("checked",true); // check first state
        problemNo = parseInt($("input[name=state-no]:first").val())
        $("input[name=state-no]").on("click",(e)=> {
            problemNo = parseInt($(e.target).val());
            play(problemNo,startStates[problemNo]) 
        })
        $("#solve").on("pointerdown",()=>
            solveWeb(problemNo,startStates[problemNo],TipOver_Board,display,showMoves));
        $("#reset").append(
            svg("use",{href:"#reset-def"})
        ).on("pointerdown",()=>play(problemNo,startStates[problemNo]));
        $("#undo").append(
            svg("use",{href:"#undo-def"})
        ).on("pointerdown",()=>display.undo())
        setLang("fr");     
}

$(document).ready(function() {
    // build the web page
    $("body").load("../body.html",function(){
        $("head title, .title").text("Tipover");
        $("#svg_element").attr("viewBox","-0.5 -0.5 7 7").attr("width","600px");
        setSVGfactors();
        initLanguageHandlers();
        initEventHandlers();
        display = new TipOver_Display();
        play(problemNo,startStates[problemNo]);
    })
});