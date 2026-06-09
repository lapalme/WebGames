// For the game of Cannibal Eaters from Smart Games 
// now discontinued, but listed in https://www.smartgames.eu/uk/smartgames-archive
//     https://www.smartgamesandpuzzles.com/cannibal-monsters.html

const levels =[{"en":"Starter","fr":"Débutant","from":1,"to":12},
               {"en":"Junior","fr":"Junior","from":13,"to":24},
               {"en":"Expert","fr":"Expert","from":25,"to":36},
               {"en":"Master","fr":"Maître","from":37,"to":48}];

//  Four strings corresponding to the four lines
//   . is a space 
//   letter [rgb] corresponding to color (Blue, Red, Green)
//   number [1-4] number of eyes
//   template for configs : "N":["","","",""],
const problems = {
    // "1":["b1b2b3b4","r1r2r3r4","g1g2g3g4","...."],  // to test the drawing of all pieces
    "1":["....",".b1r1r2",".b2..",".g1.."],
    "2":["..b1.",".r1g1.","r2.b2.","...."],
    "5":["g1r1..",".r2..",".r3..",".b1b2g2"],
    "12":[".g1..","r1.r2b1",".r3b2g2","...."],
    "13":[".r1b1b2","..b3.","..r2.",".r3g1g2"],
    "15":[".r1r2r3",".g1.b1","b2g2b3.","...."],
    "19":["r1...","b1r2g1.","....","b2.g2r3"],
    "21":[".r1b1.","...r2","r3.b2g1","..g2."],
    "25":["g1r1r2b1","g2..g3","r3..b2","..r4b3"],
    "27":["g1r1.g2","...r2","b1..b2","...r3"],
    "34":["r1..r2",".g1r3b1","g2.b2b3","...."],
    "35":["....","g1r1b1r2","b2r3..","..g2."],
    "41":[".g1..","b1b2r1.","g2...","g3r2.."],
    "42":["g1r1g2g3","r2.b1r3","b2.g4r4",".b3.."],
    "43":["....",".g1.r1",".g2b1b2",".r2b3r3"],
    "44":["g1r1r2b1","g2b2..","g3..r3","b3.b4r4"],
    "45":["g1g2.r1","...r2","g3g4r3b1","b2..b3"],
    "46":[".r1g1b1",".g2r2b2","b3.r3b4","g3r4.."],
    "47":[".g1r1.","r2b1.g2","..b2g3","b3r3r4."],
    "48":["b1r1g1b2","b3.r2.","g2r3g3.","b4..g4"]
}

// state is a list of pieces of the form
// [ps, i,j] where ps is a stack of pieces at this position (initially a one element list)

export {levels, startStates}

let startStates={};
const problemRE = /\.|[rgb][1234]/g

for (const no in problems){
    const problem = problems[no];
    if (problem.length != 4){
        console.log("*** Problem %s: bad number of lines",no,problem.length)
        continue;
    }
    let state=[]
    let allPieces = new Set([])
    "RBG".split("").forEach(l=>"1234".split("").forEach(i=>allPieces.add(l+i)));
    for (let i=0;i<4;i++){
        const line = problem[i];
        const matches = [...line.matchAll(problemRE)];
        if (matches == null || matches.length!=4){
            console.log("*** Problem %s: line %d, bad infos",no,i,line)
            continue;
        }
        for (let j=0;j<4;j++){
            if (matches[j][0]!="."){
                const piece = matches[j][0].toUpperCase();
                if (!allPieces.has(piece)){
                    console.log("*** Problem %s: repeated piece: %s",no,piece)
                    continue;
                }
                allPieces.delete(piece);
                state.push([[piece],i,j])
            }
        }
    }
    startStates[parseInt(no)]=JSON.stringify(state);
}

// for (const key in startStates){
//     console.log(key,startStates[key])
// }
