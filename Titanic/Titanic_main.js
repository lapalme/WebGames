import {svg,setSVGfactors} from "../SVGtools.js";
import {Titanic_Board,showMoves} from "./Titanic_Board.js";
import {Titanic_Display} from "./Titanic_Display.js";
import {solveWeb} from "../Solver.js"
import { buildProblemSelection,setLang,initLanguageHandlers } from "../Main.js";

import {startStates, levels} from "./Problems.js"

let problemNo;
let board,display;

function showState(state){
    const s = JSON.parse(state);
    return "boats:["+s.boats.join(", ")+"]\n      "+"people:["+s.people.join(", ")+"]"
}
function play(no,state){
    $("#bravo,.arrow").remove();
    console.log(`play(${no},${showState(state)})`)
    board = new Titanic_Board(no,state,display);
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
        solveWeb(problemNo,startStates[problemNo],Titanic_Board,display,showMoves));
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
        $("head title, .title").text("Titanic");
        $("#svg_element").attr("viewBox","0 0 6 6").attr("width","600px");  
        setSVGfactors();
        initLanguageHandlers();
        initEventHandlers();
        display = new Titanic_Display();
        play(problemNo,startStates[problemNo]);
    })
});