import {svg,makePoints,translate,rotate,M,L,cText,translateSVG_rel,translateSVG,getPos} from "../SVGtools.js"
import {Display,message,d} from "../Display.js"
import { dir2rot,dirInv } from "../Jump.js";
import { Titanic_Jump } from "./Titanic_Jump.js";

import {M as nbLines,N as nbCols, showMoves} from "./Titanic_Board.js";
export {Titanic_Display}

let allJumps;

class Titanic_Display extends Display {
        constructor(){
        super();
    }

    makeDefs($defs){
        super.makeDefs($defs);
        $defs.append(
            svg("path",{id:"mauvais",
                        d:M(0.25,0.25)+L(0.75,0.75)+M(0.25,0.75)+L(0.75,0.25),
                        fill:"none",
                        stroke:"red","stroke-width":0.1,"stroke-linecap":"round"
                        }),
            svg("g",{id:"fond-def"},
                svg("rect",{width:1,height:1, "stroke":"gray","stroke-width":0.02})
            ),
            svg("g",{id:"P"},
                svg("circle",{cx:0.5,cy:0.5,r:0.3,stroke:"white","stroke-width":0.02})),
            svg("path",{id:"anchor",
                        d:M(0.5,0.65)+L(0.8,0.8),stroke:"black","stroke-width":0.075}),
        )
    }
    
    makeBackground($background,grid){
        grid.forEach((i,j,v)=>{
            $background.append(
                svg("use",{href:"#fond-def",class:"fond",id:"f"+i+j,transform:translate(j,i)},
                svg("title",{},i+","+j)))            
        })
    }
    
    setBoard(board){
        this.makeBackground($("#background"),board.grid)
        $("#pieces").empty();
        allJumps = null;
        // $("#bravo,#impasse,#x,.arrow").remove();
        this.board = board;
        this.$svg_element.data({board:board,display:this});
        // add people
        for (const person of board.people){
            person.drawing = person.draw().data({piece:person})
            $("#pieces").append(person.drawing)
        }
        // add boats
        for (const boat of board.boats){
            boat.drawing = boat.draw().data({piece:boat}).on("mousedown",mousedown)
            if (boat.people.some(p=> p !=null)){
                const bps = boat.people;
                // board and draw people
                for (let pos=0;pos<bps.length;pos++){
                    const pid = bps[pos].id;
                    const ps = board.people;
                    const p = ps[ps.findIndex(n=>n.id==pid)]
                    if (p!=null)
                        boat.drawing.append( 
                            p.drawing.attr("transform",translate(0,-pos-1)+rotate(-dir2rot[boat.dir][0],0.5,0.5)))
                }
                if (boat.isAnchored){
                    boat.drawing.append(svg("use",{href:"#anchor"}))
                }
            }
            $("#pieces").append(boat.drawing) 
        }
    }
    
    undo(){
        undoJump()
    }

}

let $current,boat,possibleJumps;
let arrowFollowed;

function mousedown(e){
    $("#x,.arrow,#bravo").remove();
    $current = $(e.currentTarget);
    boat = $current.data("piece");
    // console.log("mousedown",boat);
    const $svg_element = $("#svg_element");
    let {board,display} = $svg_element.data();
    if(!($._data($("body")[0],'events'))){ // avoid add more than one key listener
        $("body").on("keydown",processKeydown);
        $("body").on("keyup",processKeyup);           
    }


    $current.on("mouseup",mouseup);
    
    function changeCurrent(){  //  TAB key
        $("#x,.arrow").remove();
        // to ensure being on the right board, when TAB after having changed the game
        board = $("#svg_element").data("board")
        const bs = board.boats;  
        // add the current boat at the end to avoid selecting it again too soon
        bs.push(bs.splice(bs.findIndex((p,i)=>p==boat),1)[0])
        // find the next unanchored piece
        const idx = bs.findIndex(b=>!b.isAnchored);
        if (idx>=0){
            boat = bs[idx];
            $current = boat.drawing;
            boat.makeCurrent();
        }
    }
 
    function mouseup(e){
        // console.log("mouseup");
        if (!boat.isAnchored)
            boat.makeCurrent();
        else {
            changeCurrent();
        }
        possibleJumps = boat.possibleJumps(board.grid);       
        const l = boat.length;
        const arriere = boat.myPos[l]
        if (possibleJumps.length == 0) {
            if (boat.estfixe){
                $(".current").removeClass("current")
            } else 
                $("#pieces").append(
                    svg("use",{href:"#mauvais",id:"x",
                                transform:translate(boat.j+arriere[1]/2,boat.i+arriere[0]/2)})
                )
        } else {
            const isHoriz = d => d == "←" || d == "→";
            const boatHoriz = isHoriz(boat.dir);
            //group jumps by direction
            let jumpsDir = {};
            for (const jump of possibleJumps){
                const cs = jumpsDir[jump.dir];
                if (cs === undefined)
                    jumpsDir[jump.dir]=[jump]
                else
                    cs.push(jump)
            }
            for (const dir in jumpsDir){
                // place the arrow in the middle of the boat (a bit tricky...)
                const horizArrow = isHoriz(dir)
                let arrowI = boat.i, arrowJ = boat.j;
                if (boatHoriz){
                    if (horizArrow){
                        if (boat.dir!=dir)
                            arrowJ += arriere[1];
                    } else {
                            arrowJ += arriere[1]/2;
                    }
                } else {
                    if (!horizArrow){ // bateau vertical
                        if (boat.dir != dir)
                            arrowI += arriere[0];
                    } else { 
                            arrowI += arriere[0]/2;
                    }
                }
                $svg_element.append(
                    svg("use",{href:"#arrow-def",stroke:"green",
                                transform:translate(arrowJ,arrowI)+rotate(dir2rot[dirInv[dir]][0],0.5,0.5),
                                class:"arrow"}).data({piece:boat,jump:jumpsDir[dir]})
                    .on("mousedown",followArrow))
            }

        }
        if (board.isComplete()){
            $("#x").remove()
            display.showBravo(allJumps,showMoves,nbLines,nbCols)
        }
        $current.off("mouseup");
    }
    
    function followArrow(e){
        // console.log("followArrow",arrowFollowed);
        const $current = $(e.currentTarget);
        const jumps=$current.data("jump");
        // check if many jumps are possible
        if (jumps.length==1){
            const jump=jumps[0];
            boat.play(jump.dir,board.grid,jump.boardings);
            boat.move();
            boat.displayJump(jump);
            allJumps = jump.extend(allJumps);
            $(".arrow").remove();
            mouseup(e);
         } else {
            const [_,di,dj]=dir2rot[jumps[0].dir]
            boat.move(jumps[0].from.i-di,jumps[0].from.j-dj);
            $(".arrow").remove();          
            for (const jump of jumps){
                const emb = jump.boardings[0];
                const peopleD = $("#p"+emb.personId).data("piece").drawing
                $("circle",peopleD).addClass("choice");
                peopleD.on("mousedown",
                        function(e){
                            const jumpLocal=jump; // HACK: copy the current jump in the closure
                            boat.play(jumpLocal.dir,board.grid,jumpLocal.boardings);
                            boat.displayJump(jumpLocal);
                            allJumps = jump.extend(allJumps);
                            $(".choice").parent().off("mousedown")
                            $(".choice").removeClass("choice");
                            $(".arrow").remove();
                            mouseup(e);
                        })
            }
        }      
   }
   
   // HACK: as Keydown must be used to deal with arrow keys 
   //       This can give rise to many events in a row
   //       This the role of arrowFollowed when "finally" keyUp is detected
   function processKeydown(e){
        // console.log("processKey",e.which);
        if (e.which==9){ // tab key
            changeCurrent();
            mouseup(e);
            e.preventDefault(); // prevent the default action (scroll / move caret)
            return;
        }
        if (e.which == 90 && (e.ctrlKey || e.metaKey)){ // control-Z ou cmd-Z
            undoJump()
            e.preventDefault();
            return
        }
        if (arrowFollowed) return;
        const keyCode2arrow = {37:"←",38:"↑",39:"→",40:"↓"};
        const arrow = keyCode2arrow[e.which];
        if (arrow == undefined) return;
        $(".arrow").each(function(idx){
            if ($(this).data("jump")[0].dir==arrow){
                // console.log("trigger",this)
                arrowFollowed=true;
                $(this).trigger("mousedown")
                return false;
            }
            return true;
        })
        arrowFollowed=true;
        e.preventDefault(); // prevent the default action (scroll / move caret)
    }
   
    function processKeyup(e){
        arrowFollowed=false;
    }
}


function undoJump(){
    $("#x,.arrow,#bravo").remove();
    $(".current").removeClass("current");
    if (allJumps==null)return;
    const jump = allJumps;
    allJumps = allJumps.precedent;
    let board = $("#svg_element").data("board");
    // update the grid without boardings
    const boat = board.play(new Titanic_Jump(jump.to,jump.from,jump.boatId))
    boat.move();
    if (jump.boardings.length>0) { // deal with the selection of people to jump 
        boat.isAnchored=false;
        $("use[href='#anchor']",boat.drawing).remove();
        boat.drawing.on("mousedown",mousedown);
        for (const brd of jump.boardings){
            const pers = board.id2person(brd.personId);
            board.grid.set(brd.i,brd.j,pers);
            pers.i=brd.i;
            pers.j=brd.j;
            boat.people[brd.position]=null;
            $("#pieces").append(
                pers.drawing.attr("transform",translate(brd.j,brd.i)+rotate(0,0.5,0.5))
            );
        }        
    }
}