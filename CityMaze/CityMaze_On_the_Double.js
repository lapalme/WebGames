import {svg,setSVGfactors} from "../SVGtools.js";
import {CityMaze_Board,showMoves} from "./CityMaze_Board.js";
import {CityMaze_Display} from "./CityMaze_Display.js";
import {solveWeb} from "../Solver.js"
import { buildProblemSelection,setLang,initLanguageHandlers } from "../Main.js";

// import {startStates, levels} from "./Express_Delivery.js"
import {startStates, levels} from "./On_the_Double.js"

let problemNo;
let board,display;

function play(no,state){
    $("#bravo").remove();
    console.log(`play(${no},${state})`)
    board = new CityMaze_Board(no,state,display);
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
            solveWeb(problemNo,startStates[problemNo],CityMaze_Board,display,showMoves));
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
        $("head title, .title").text("City Maze - On the Double");
        $("#svg_element").attr("viewBox","0 0 10 6").attr("width","800px");  
        setSVGfactors();
        initLanguageHandlers();
        initEventHandlers();
        display = new CityMaze_Display();
        play(problemNo,startStates[problemNo]);
    })
});