import {svg,setSVGfactors} from "../SVGtools.js";
import {SettingSun_Board,showMoves} from "./SettingSun_Board.js";
import {SettingSun_Display} from "./SettingSun_Display.js";
import {solveWeb} from "../Solver.js"
import { buildProblemSelection,setLang,initLanguageHandlers } from "../Main.js";

import {startStates, levels} from "./Problems.js"

let problemNo;
let board,display;

function play(no,state){
    $("#bravo").remove();
    console.log(`play(${no},${state})`)
    board = new SettingSun_Board(no,state,display);
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
            solveWeb(problemNo,startStates[problemNo],SettingSun_Board,display,showMoves));
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
        $("head title, .title[lang='en']").text("Setting Sun");
        $(".title[lang='fr']").text("L'Âne Rouge");
        $("#svg_element").attr("viewBox","-0.5 -0.5 5 6").attr("width","500px");  
        setSVGfactors();
        initLanguageHandlers();
        initEventHandlers();
        display = new SettingSun_Display();
        play(problemNo,startStates[problemNo]);
    })
});