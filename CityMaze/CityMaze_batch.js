// import {startStates} from "./Express_Delivery.js"
import {startStates} from "./On_the_Double.js"

import {solveAll} from "../Solver.js"
import {CityMaze_Board,showMoves} from "./CityMaze_Board.js"

solveAll(startStates,CityMaze_Board,showMoves)
