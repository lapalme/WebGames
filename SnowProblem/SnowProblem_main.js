import {svg,setSVGfactors} from "../SVGtools.js";
import {SnowProblem_Board,showMoves} from "./SnowProblem_Board.js";
import {SnowProblem_Display} from "./SnowProblem_Display.js";
import {solveWeb} from "../Solver.js"
import { buildProblemSelection,setLang,initLanguageHandlers } from "../Main.js";

import {startStates, levels} from "./Problems.js"

let problemNo;
let board,display;

function play(no,state){
    $("#bravo").remove();
    // console.log(`play(${no},${state})`)
    board = new SnowProblem_Board(no,state,display);
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
            solveWeb(problemNo,startStates[problemNo],SnowProblem_Board,display,showMoves));
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
        $("head title").text("Snow Problem");
        $(".title[lang='en']").html("Snow Problem");
        $(".title[lang='fr']").html("Je voudrais un <i>Bonhomme de neige</i>");
        // leave some space aound so thet a snomman on the first line can appear completely       
        $("#svg_element").attr("viewBox","-0.5 -0.5 6 5").attr("width","600px");
        setSVGfactors();
        initLanguageHandlers();
        initEventHandlers();
        display = new SnowProblem_Display();
        play(problemNo,startStates[problemNo]);
    })
});