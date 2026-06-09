import {svg,setSVGfactors} from "../SVGtools.js";
import {JumpIn_Board,showMoves} from "./JumpIn_Board.js";
import {JumpIn_Display} from "./JumpIn_Display.js";
import {solveWeb} from "../Solver.js"
import { buildProblemSelection,setLang,initLanguageHandlers } from "../Main.js";

import {startStates, levels} from "./Problems.js"

let problemNo;
let board,display;

function play(no,state){
    $("#bravo").remove();
    console.log(`play(${no},${state})`)
    board = new JumpIn_Board(no,state,display);
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
            solveWeb(problemNo,startStates[problemNo],JumpIn_Board,display,showMoves));
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
        $("head title").text("Jump In - Lièvres et renards");
        $(".title[lang='fr']").text("Lièvres et renards");
        $(".title[lang='en']").text("Jump In");
        $("#svg_element").attr("viewBox","-0.5 -0.5 6 6").attr("width","500px"); 
        setSVGfactors();
        initLanguageHandlers();
        initEventHandlers();
        display = new JumpIn_Display();
        play(problemNo,startStates[problemNo]);
    })
});