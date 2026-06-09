// Jump In: https://www.smartgames.eu/uk/one-player-games/jump
// Lievres et renards: https://www.smartgames.eu/fr/jeux-pour-1-joueur/lièvres-renards-nouvelle-edition

const levels =[{"en":"Starter","fr":"Débutant","from":1,"to":12},
               {"en":"Junior","fr":"Junior","from":13,"to":24},
               {"en":"Expert","fr":"Expert","from":25,"to":36},
               {"en":"Master","fr":"Maître","from":37,"to":48},
               {"en":"Wizard","fr":"Génie","from":49,"to":60}];

//  *: mushroom , Rabbits: w: white, t: tan (for brown), g: gray, b:black (for supplementary!)
//  Fox: arrow for the head and f for the tail
/* template 
   "NN":[".....",
         ".....",
         ".....",
         ".....",
         "....."],
*/
// numbers correspond to the original booklets except for the few last one
// that cam as extra in the new booklet
const problems = {
    "1":[".**..",
         "...*.",
         "...g.",
         ".....",
         "....."],
    "2":["..t*w",
         "....*",
         "...*.",
         ".....",
         "....."],
   "10":["g*t*w",
         "*....",
         ".....",
         ".....",
         "....."],
   "11":["g*.t.",
         "..*..",
         "....w",
         "...*.",
         "....."],
   "12":[".....",
         ".....",
         "gt..w",
         ".*...",
         "..**."],
   "13":["...*.",
         ".*g←f",
         "..*..",
         ".....",
         "....."],
   "25":[".f.↑.",
         ".↓.f*",
         "....*",
         "g..t.",
         "....*"],
   "30":[".f...",
         ".↓.←f",
         "....*",
         ".t...",
         "..g.."],

   "37":[".f...",
         "*↓...",
         "..*..",
         "f→...",
         "*.w.."],
   "44":[".....",
         ".↑←ft",
         ".f*..",
         ".w.*.",
         ".g..*"],
   "46":[".*.↑.",
         "**.f.",
         "w....",
         "g....",
         "...t."],
   "49":["....w",
         "f→.t.",
         ".f*..",
         ".↓...",
         "...g*"],

   "53":[".g.t.",
         "*↑..w",
         "*f...",
         ".←f..",
         "*...."],
   "54":[".g*f.",
         "*..↓.",
         ".....",
         ".*...",
         ".g.t."],
   "56":["....*",
         "f→.↑g",
         "..*f.",
         "w...*",
         ".t..."],
   "57":["w....",
         ".t.←f",
         "..*..",
         ".g.f→",
         ".*..*"],
   "58":[".g..*",
         "...↑.",
         "t.wf*",
         "...←f",
         "*...."],
   "59":["...*.",
         "f→.w.",
         "..*.t",
         "g.←f.",
         "....*"],
   "60":["...*.",
         "f→.w.",
         "..*.t",
         "*....",
         "...g."],
// extras...
   "29":[".....",
         "..*..",
         "b*w*g",
         "f→.←f",
         "..t.."],
   "32":["...f.",
         "...↓*",
         "wtg*b",
         "..*↑.",
         "...f."],
  "100":[".*..w",
         "..←f.",
         "g.*.t",
         "....*",
         ".b..."],

}

export {levels, startStates,sortState}

let grid,state;
function checkFox(c,i,j,di,dj,no){
    if (grid[i+di][j+dj]=="f"){
        state.push([c,i,j]);
        grid[i][j]="."  // erase fox
        grid[i+di][j+dj]="."
    } else {
        console.log("** Problem %s: bad fox at %d,%d",no,i,j)
    }
}

let startStates = {}
// state: sorted list of pieces where a piece = [kind,i,j]
// eg. for 1 [["*",0,1],["*",0,2],["*",1,3],["g",2,3]]
//     for fox: give head pos and orientation 
//     for 53 [["*",1,0],["*",2,0],["*",4,0],["f",3,1,"H"],["f",1,1,"V"],["g",0,1],["t",0,3],["w",1,4]]
for (const no in problems){
    const problem = problems[no];
    if (problem.length!=5){
        console.log("** Problem %s: bad number of lines:%d",no,problem.length);
        continue;
    }
    grid=[];
    for (let i=0;i<5;i++){
        const line=problem[i];
        if (line.length!=5){
            console.log("** Problem %s: line %d, bad line length:%d",no,i,line.length);
            grid.push(".".repeat(5))
            continue;
        }
        grid.push(line.split(""))
    }
    state = [];
    // find foxes
    for (let i=0;i<5;i++)
        for (let j=0;j<5;j++){
            const c=grid[i][j];
            if (c=="↑")checkFox(c,i,j,1,0,no)
            else if (c=="↓")checkFox(c,i,j,-1,0,no)
            else if (c=="←")checkFox(c,i,j,0,1,no)
            else if (c=="→")checkFox(c,i,j,0,-1,no)
        }
    // check other pieces        
    for (let i=0;i<5;i++){
        for (let j=0;j<5;j++){
            const c = grid[i][j];
            if (c == ".")continue;
            if ("*gtwb".includes(c)){
                state.push([c,i,j])
            } else {
                console.log("** Problem %s: strange character at: %d,%d : %s",no,i,j,c)
            }
        }
    }
    state.sort(sortState)
    startStates[parseInt(no)]=JSON.stringify(state) 
}

function sortState([c1,i1,j1],[c2,i2,j2]){
    if (c1<c2) return -1; // compare kind char
    if (c1>c2) return 1
    const i = i1-i2;      // compare coordinates
    if (i!=0) return i;
    return j1-j2;
}
