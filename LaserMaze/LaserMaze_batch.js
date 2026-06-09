import {startStates} from "./Problems.js"
import {solveAll} from "../Solver.js"
import {LaserMaze_Board,showMoves} from "./LaserMaze_Board.js"

// test a specific problem
// solveAll({"53":startStates[53]},LaserMaze_Board,showMoves)
// test all
solveAll(startStates,LaserMaze_Board,showMoves)
