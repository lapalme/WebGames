//   https://www.think-fun.be/fr/products/river-crossing/
//   http://mechanical-puzzles.blogspot.com/2010/06/river-crossing.html

// rebranded as Obstacle hero
//    https://www.ravensburger.us/en-US/products/games/thinkfun/obstacle-hero--76640

// fix levels names and numbers
const levels =[{"en":"Starter","fr":"Débutant","from":1,"to":10},
               {"en":"Junior","fr":"Junior","from":10,"to":20},
               {"en":"Expert","fr":"Expert","from":21,"to":30},
               {"en":"Master","fr":"Maître","from":31,"to":40},
            //    {"en":"Wizard","fr":"Génie","from":41,"to":50}
               ];

//    places for stumps
// 0-4 :bottom bank, 5-9:top bank
// A-Y : in a 5x5 array 
//       first column from the bottom A-E
//       2nd column                   F-J
//       ....
// planks between two stumps, the Hiker starts at the first plank
//   stumps:planks
const problems = {
    1 :"2GHRS9:2G,GH",
    4 :"2ACDFLNTVWY9:2F,AC,VW",
    11:"4ACDPHKNPRW8:4P,AK",
    16:"3ACFIKMUX8:3K,AC,UX",
    17:"4DEGHJNPRW8:4P,GH,PR",
    21:"3ACDGJLMPSTVWY8:3L,GL,GJ",
    24:"1BDEFHKNQTUVXY7:1B,UV,ET",
    26:"2BDFIKLMOQTUXW9:2F,KU,IX",
    27:"4FGIJKMOQRS9:4Q,QR,KM",
    30:"2ACDEGJKNRUVX9:2G,GJ,KU,DE",
    31:"2ABDEGHJKNQTUW9:2G,DE,HJ,QT",
    36:"4ADGHKMORSUVXY7:4R,AK,MR,UV",
    39:"3ACFGJMNPQWY8:3M,CM,MW,FG,PQ",
    40:"2ACEFIKMQTUWXY7:2F,AC,QT,UW",
    // extra not in the booklet
    // 41 :"3VQGBWDINO7Y7:3Q,QV",
    // 42 :"2AFKUBQVMDISOY7:2K,FI,BD",
    // 43 :"3ABCDGIKMOQSWY7:3Q,AK,BG,DI",
    // 44 :"3ACFKMOPQRTVX9:3P,QV,KM,AC",
    // 45 :"3ABDFGIOQTUX7:3Q,AB,BD,IX,FG",      
}

const letters = [ // reproduce the Game Grid Key of page 7 of the booklet
    "6789Z",
    "EJOTY",
    "DINSX",
    "CHMRW",
    "BGLQV",
    "AFKPU",
    "12345"
]

let letter2ij={};
let ij2letter=Array.from({length:7},(_,i)=>Array.from({length:5},(_,j)=>" "))
letters.forEach((ls,i)=>ls.split("")
                .forEach((l,j)=>{
                    letter2ij[l]=[i,j];
                    ij2letter[i][j]=l;
                    }))

// make names of planks go bottom-up and left-right 
function normalizePlankId(fromId,toId){
    let [fromI,fromJ] = letter2ij[fromId]
    let [toI,toJ] = letter2ij[toId]
    if (fromI==toI){
        if (fromJ>toJ)[fromId,toId]=[toId,fromId]
    } else if (fromI<toI){
        [fromId,toId]=[toId,fromId]
    }
    return fromId+toId
}



const letters1_6 = letters.slice(1,6).join("")
const letters3_6 = letters.slice(3,6).join("")
const stumpsRE = new RegExp(`[${letters[6]}][${letters1_6}]+[${letters[0]}]`)
const planksRE = new RegExp(`[${letters[6]}][${letters3_6}](,[${letters1_6}][${letters1_6}])+`)

export {levels, startStates,letter2ij,ij2letter,normalizePlankId}
let startStates = {}
for (const no in problems){
    const problem = problems[no];
    let [stumpsL,planksL]=problem.split(":")
    if (!stumpsRE.test(stumpsL)){
        console.log("*** Problem %d: illegal stumps:",no,stumpsL)
        continue
    }
    const stumps=stumpsL.split("");
    if (!planksRE.test(planksL)){
        console.log("*** Problem %d: illegal planks:",no,planksL);
        continue
    }
    // check if planks are in the same row or col and at a difference of 1,2 or 3
    let planks=[]
    for (const pl of planksL.split(",")){
        const [c1,c2] = pl.split("");
        if (!stumps.includes(c1) || !stumps.includes(c2)){
            console.log("*** Problem %d: plank %s uses an absent stump");
            continue
        }
        const [i1,j1]=letter2ij[c1]
        const [i2,j2]=letter2ij[c2]
        if (j1==j2){
            const di = Math.abs(i1-i2);
            if (di<1 || di>3){
                console.log("*** Problem %d: bad plank",no,pl);
                continue;
            }
            planks.push(pl)   
        } else if (i1==i2){
            const dj = Math.abs(j1-j2);
            if (dj<1 || dj>3){
                console.log("*** Problem %d: bad plank",no,pl);
                continue;
            }
            planks.push(pl);
        } else {
            console.log("*** Problem %d: bad plank",no,pl)
        }
        if (planks.length==1)planks[0]=planks[0]+"*";   // put Hiker on the first plank
    }
    startStates[no] = JSON.stringify({stumps:stumps,planks:planks})
    // console.log(no,startStates[no])
}
