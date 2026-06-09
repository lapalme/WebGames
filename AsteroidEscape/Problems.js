//    https://www.smartgames.eu/uk/one-player-games/asteroid-escape-0
//    https://www.smartgames.eu/fr/jeux-pour-1-joueur/alerte-astéroïdes

// fix levels names and numbers
const levels =[{"en":"Starter","fr":"Débutant","from":1,"to":12},
               {"en":"Junior","fr":"Junior","from":13,"to":24},
               {"en":"Expert","fr":"Expert","from":25,"to":36},
               {"en":"Master","fr":"Maître","from":37,"to":48},
               {"en":"Wizard","fr":"Génie","from":49,"to":60}];

//  A configuration is a list of 3 list of 3 pieces identified by the letter
//  shown at the end of the booklet followed by an optional orientation (NESW) or (0123) which are simpler to type than arrows;
//   _ is the hole 
// model : "NN":["","",""],
const problems = {
    "1": ["BN DS GE","A CS EE","HE _ F"],
    "6": ["C G BE","DW EW A","H _ FS"],
    "11":["G HW D","EE _ A","CE FE BE"],
    "13":["DW HE A","G _ EW","BW CS FS"],
    "31":["DS A EE","FW _ G","CS BW H"],
    "42":["BW A E","DE _ HS","FS G CS"],
    "53":["G1 A _","E F3 H2","D2 C2 B"],
    "60":["A H D","E3 _ F3","B3 C G"],
}

const pieceRE = /(?<id>[A-H_])(?<ori>[NESW]|[0123])?/g
// state is the list of the 9 pieces with the orientation as an arrow
// e.g. for problem 1: ["B↑","D↓","G→","A↑","C↓","E→","H→","_↑","F↑"]
const letNum2ori = {"N":"↑","E":"→","S":"↓","W":"←","0":"↑","1":"→","2":"↓","3":"←"}
export {levels, startStates}
let startStates={}
for (const no in problems){
    const problem = problems[no];
    let piecesSeen = new Set("ABCDEFGH_".split(""));
    let lines = []
    if (problem.length!=3){
        console.log("*** Problem %s: three lines expected but %d found",no,problem.length)
        continue;
    }
    let pieces = []
    for (let k=0;k<3;k++){
        const matched = [...problem[k].matchAll(pieceRE)]
        if (matched==null || matched.length!=3){
            console.log("Problem %s: line %d: bad match",no,k)
        }
        for (let im=0;im<3;im++){
            const pid = matched[im].groups.id;
            if (piecesSeen.has(pid)){
                pieces.push(pid+letNum2ori[matched[im].groups.ori||"N"])
                piecesSeen.delete(pid)
            } else {
                console.log("*** Problem %s: line %d: repeated piece",no,k,pid)
            }
        }
    }
    if (piecesSeen.size>0){
        console.log("*** Problem %s: missing pieces:",no, [...piecesSeen])
    } else {
        startStates[parseInt(no)]=JSON.stringify(pieces)
        // console.log(no,startStates[parseInt(no)])
    }
}
