import { dir2rot, allDirs,rotateXY, dirInv } from "../Jump.js";
export {levels,startStates, positions}
// fix levels names and numbers
const levels =[{"en":"Starter","fr":"Débutant","from":1,"to":12},
               {"en":"Junior","fr":"Junior","from":13,"to":24},
               {"en":"Expert","fr":"Expert","from":25,"to":36},
               {"en":"Master","fr":"Maître","from":37,"to":48},
               {"en":"Wizard","fr":"Génie","from":49,"to":60}];

//  en: https://www.smartgames.eu/uk/one-player-games/squirrels-go-nuts-xxl
//  fr: https://www.smartgames.eu/fr/jeux-pour-1-joueur/cache-noisettes-xxl

//  this version only deals with the original game (i.e. with the black nut and an extra tile with 2 squirrels)
// Each problem : {number: [configuration, nb expected moves]}
// G: grey
// R: red
// Y: yellow
// B: black
// 'arrow': nut
// . :free


// positions when dir = North (first pos is the nut)
const positions = {
    "G":{"↑":[[1,0]], "→":[[0,-1]], "↓":[[-1,0]], "←":[[0,1]]},
    "R":{"↑":[[1,0]], "→":[[0,-1]], "↓":[[-1,0]], "←":[[0,1]]},
    "Y":{"↑":[[0,1],[1,0]], "→":[[0,-1],[1,0]], "↓":[[-1,0],[0,-1]], "←":[[0,1],[-1,0]]},
    "B":{"↑":[[1,0],[1,1]], "→":[[0,-1],[1,-1]],"↓":[[-1,0],[-1,-1]], "←":[[0,1],[-1,1]]},
    // "D":{"↑":[[1,0],[1,-1]], "→":[[-1,0],[0,1]],"↓":[[1,0],[0,1]], "←":[[1,0],[1,1]]},
    // nut in pos 2
}


const problems = {
"1":[`
....
.←R.
.F↑.
..G.`,3],
"2":[`
.↑..
FGY.
..←Y
....`,4],
"3":[`
B→F.
B...
....
←R..`,8],
"4":[`
...Y
F.Y↓
...B
..←B`,6],
"26":[`
G→..
.B←R
←BY.
..←Y`,18],
"37":[`
.↑.Y
.GY↓
.BR.
←B↓.`,24],
"38":[`
.↑G→
RBB.
↓Y→.
..Y.`,24],
"39":[`
↑YB→
Y.B↑
.R→G
....`,12],
"40":[`
.BB.
..↓G
←RY↓
.Y↓.`,33],
"41":[`
...↑
Y→↑R
GYBB
↓...`,26],
"42":[`
.BB.
R→↓G
.Y.↓
Y↓..`,32],
"60":[`
G→Y→
..RY
BB↓.
.↓..
`,58],

}
// arrows for copy-paste
// ↑ ↓ → ←
// "NN":[``,N],


// State : piece: [color,I,J,dir,hasNut]  hasNut is true at the start 
// example for 1: {"pieces":[["R",1,1,"←",true],["F",2,1,"↑"],["G",2,2,"↑",true]],
//                 "filledHoles":[false,false,false,false]}

let startStates = {}

for (let no in problems){
    no=parseInt(no);
    let problem = problems[no];
    let nbMoves;
    if (Array.isArray(problem)){
        [problem,nbMoves] = problem;
    }
    problem = problem.trim()
    let lines=problem.split("\n");
    if (lines.length != 4){
        console.log("*** Problem %d: bad number of line %d != 4",no,lines.length)
    }
    let cells = []
    for (let i=1;i<=4;i++){
        const line=lines[i-1].split("");
        if (line.length !=4){
            console.log("*** Problem %d: bad number of columns for line %d: %d != 4 ",no,i,line.length);
        } else {
            cells.push(line)
        }
    }
    let pieces = []
    // check for nuts and find corresponding piece and direction
    for (let i=0;i<4;i++){
        for (let j=0;j<4;j++){
            const cell = cells[i][j];
            if (cell==".")continue;
            if (cell == "F"){
                pieces.push(["F",i,j,"↑"])
            } else if (allDirs.includes(cell)){
                const [_,di,dj] = dir2rot[cell]
                const [i1,j1] = [i+di,j+dj];
                if (i1>=0 && j1>=0 && i1<4 && j1<4){
                    const kind=cells[i1][j1];
                    switch (kind) {
                        case "G": case "R":
                            pieces.push([kind,i,j,cell,true])
                            break;
                        case "Y": case "B": 
                            const [di2,dj2] = positions[kind][cell][1];
                            const i2=i+di2,j2=j+dj2;
                            if (i2>=0 && j2>=0 && i2<4 && j2<4){
                                pieces.push([kind,i,j,cell,true]);
                            } else {
                                console.log("*** Problem %d: piece %s exits the board at %d@%d",no,kind, i2,j2)
                            }
                            break;
                        default:
                            console.log("*** Problem %d: unknown piece %s at %d@%d",no,kind,i1,j1)
                            break;
                    }
                } else {
                    console.log("*** Problem %d: piece exits the board at %d@%d",no,i1,j1)
                }
            }
        }
    }
    startStates[no]=JSON.stringify({pieces:pieces,filledHoles:[false,false,false,false]})
    // console.log(no,startStates[no])
}
