// fix levels names and numbers
const levels =[{"en":"Starter","fr":"Débutant","from":1,"to":10},
               {"en":"Intermediate","fr":"Intermédiaire","from":11,"to":20},
               {"en":"Advanced","fr":"Avancé","from":21,"to":30},
               {"en":"Master","fr":"Maître","from":31,"to":40}];

//  Tip Over : thinkfun
//  https://www.fatbraintoys.com/toy_companies/thinkfun/tipover.cfm
//  https://www.sciencenews.org/article/complexity-tipover-and-other-puzzles
//  http://www.puzzlebeast.com/ => The Kung Fu Packing Crate Maze http://www.puzzlebeast.com/crate/index.html

/*  model
NN:["......",
    "......",
    "......",
    "......",
    "......",
    "......"],
*/

// colors:height r(ed):1, y(ellow):2, g(reen):3, b(lue):4  (uppercase: position of the tipper)
// build a path to the red
const validRE = /[ryYgGbB.]{6}/
const problems = {
1:["...g..",
   "g.....",
   "....Y.",
   "......",
   ".r....",
   "......"],
2:["B...g.",
   "..y..y",
   "......",
   "...r..",
   "......",
   "b....g"],
8:["G.....",
   ".gg...",
   "..g..y",
   ".....y",
   "b.....",
   ".....r"],
11:["......",
    "..yB.r",
    ".ygg..",
    "......",
    "......",
    ".y...."],
13:["...y..",
    "...gB.",
    "...y..",
    "......",
    ".yy...",
    "r....."],
18:["......",
    "y....b",
    "y....Y",
    "g....y",
    "......",
    "r.ygg."],
22:[".r....",
    "y.g...",
    "yg....",
    "By....",
    "b.....",
    "y.y..."],
25:[".y...y",
    "byg...",
    "..Y...",
    ".y..g.",
    ".y...r",
    "yg.yy."],
27:["r.yggb",
    ".Y....",
    "y.....",
    "y...y.",
    "....g.",
    ".g...b"],
33:["gbY...",
    "gy....",
    "y.....",
    ".....g",
    "...yy.",
    "y..g.r"],
35:[".gg..r",
    "Byygy.",
    "...y.y",
    "......",
    "..y...",
    "...yyy"],
40:["...yg.",
    "...y..",
    "..yY..",
    "..y...",
    "y.y.g.",
    ".r...."],
}

export {levels, startStates}

// state = {color:[id,i,j,tipped:[LRUD]|null]]..,tipper:[i,j]}
// e.g for state[1] : {"r":[[4,4,1,null]],"g":[[1,0,3,null],[2,1,0,null]],"b":[],"y":[[3,2,4,null]],"tipper":[2,4]}
// 
let startStates={}
for (const no in problems){
    const problem = problems[no];
    let letters = {r:[],g:[],b:[],y:[]},tipper=null;
    let id=1;
    for (let i=0;i<6;i++){
        if (validRE.test(problem[i])){
            const cs = problem[i].split("");
            for (let j=0;j<6;j++){
                let c=cs[j];
                if (c!="."){
                    if ("GBY".includes(c)){
                        if (tipper==null){
                            tipper=[i,j];
                        } else {
                            console.log("*** Problem %d: tipper already set at %d,%d",no,tipper[0],tipper[1])
                        }
                        c=c.toLowerCase();
                    }
                    letters[c].push([id++,i,j,null]);
                }
            }
        } else {
            console.log("*** Problem %d: line %d invalid",no,i)
        }
    }
    if (tipper==null)
        console.log("*** Problem %d: no tipper found",no)
    if (letters["r"].length != 1)
        console.log("*** Prolbem $d: only one red should be there, but %d found",no,letters["r"].length)
        
    startStates[no]=JSON.stringify({r:letters["r"],g:letters["g"],b:letters["b"],
                                    y:letters["y"],tipper:tipper})
    // console.log(no,startStates[no])
}
