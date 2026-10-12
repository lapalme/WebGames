// Lunar Lockout: https://github.com/duecknoah/lunar-lockout-solver
// https://puzzleworld.org/PuzzleWorld/puz/lunar_lockout.htm
// https://puzzleworld.org/PuzzleWorld/art/art02.htm : Computer Analysis of the UFO Puzzle
// https://artofshopping.blogspot.com/2007/12/lunar-lockout.html
// All cards: https://www.cs.cmu.edu/~mmv/planning/assignments.html

// fix levels names and numbers
const levels =[{"en":"Beginner","fr":"Débutant","from":1,"to":10},
               {"en":"Intermediate","fr":"Intermédiaire","from":11,"to":20},
               {"en":"Advanced","fr":"Avancé","from":21,"to":30},
               {"en":"Expert","fr":"Expert","from":31,"to":40}];

//  explain the notation
// r: red
// b: blue
// o :orange
// y: yellow
// g: green
// p:purple
// .: free space
// list of strings for the 5 lines of the board, top to botton, left to right
const problems = {
     1:["....o","..g..",".p...","...y.","....r"],
     2:["..o..","....g",".p...","...y.",".r..."],
    19:[".o...","..g..","...p.","y....","..b.r"],
    20:[".o...","....g","p....","...r.",".y..."],
    22:[".....","o...g",".....","...p.","y...r"],
    31:["o.g..","....p","y....","...r.",".b..."],
    36:["..r..","o...g",".....","p...y","..b.."],
    37:["o..gp",".....",".....","y..r.","....."],
    38:["..o.g",".....","py...",".....",".r..b"],
    39:["o.g.p",".....","y....",".....","b...r"],
    40:["o.g.p",".....",".....","....y",".r..."]
}

const validRE=/[.rboygp]{5}/

// state = [[color,i,j]], where r is first
// if some state transformation is needed
export {levels, startStates}
let startStates={}
for (const no in problems){
    const problem = problems[no];
    let seen=new Set();
    let pieces = []
    for (let i=0;i<5;i++){
        const line = problem[i];
        if (validRE.test(line)){
            for (let j=0;j<5;j++){
                const c=line.charAt(j);
                if (c==".")continue;
                if (seen.has(c)){
                    console.log("*** Problem %d: line %d, pos %d, repeated %s",no,i,j,c)
                    continue
                } else {
                    seen.add(c);
                    if (c=="r") pieces.unshift(["R",i,j])
                    else pieces.push([c.toUpperCase(),i,j]) 
                }
            }
        } else {
            console.log("*** Problem %d: bad line %d",no,i);
            continuel
        }
    }
    if (!seen.has("r")){
        console.log("Problem %d: missing r",no)
    }
    startStates[no]=JSON.stringify(pieces)
    console.log(no,startStates[no])
}
