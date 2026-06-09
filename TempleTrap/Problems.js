// Temple Trap : https://www.smartgamesandpuzzles.com/temple-trap.html
// https://www.smartgames.eu/uk/one-player-games/temple-trap-0
// L'aventurier : https://www.smartgames.eu/fr/jeux-pour-1-joueur/laventurier

const levels =[{"en":"Starter","fr":"Débutant","from":1,"to":12},
               {"en":"Junior","fr":"Junior","from":13,"to":24},
               {"en":"Expert","fr":"Expert","from":25,"to":36},
               {"en":"Master","fr":"Maître","from":37,"to":48},
               {"en":"Wizard","fr":"Génie","from":49,"to":60}];

// Pieces:
//   + : +
//   ◇ : d diamond
//   x : x
//   □ : s square
//   ○ : o 
//   = : =
//   * : *
//   ◃ : < 
//   _ : hole

// // with a North orientation  [entry:(orientation + level),exit:(orientation+level)]
// //   when 1 it has a hole for the adventurer
// d : [S1,N2]  
// * : [S1,N2]

// x : [S1,E1]
// o : [S1,E1]
// < : [S1,E1]

// = : [S2,E2]
// s : [S2,E2]

// + : [S2,N2]

// position of the id of each piece 
//  0 1
//  3 2
//  N: ["","","",N],

const validRE = /(_)|([=s+][0123])|([d*xo<][0123]!?)/g

const problems = {
   0: ["+3_x1","s0d3o2","=3*3<1!",11],
   1: ["+3d3x1","s0_o2","=3*3<1!",11],
   2: ["=1*2!x3","s3_d3","o3+1<1",9],
   3: ["x1*0!s2","d3o2<3","=3_+0",10],
   4: ["s0d3o1","*0!x3<2","_=3+3",12],
  17: ["x1<0*2","=1s0+0","o3!_d0",14],
  22: ["=3s1_","*1d3x1","+3<3!o2",13],
  30: ["o2s1x0!","*2_<3","=3+1d3",16],
  35: ["+2*0=1","<0x1o0","_d2!s3",17],
  40: ["s1_=0","x0*0o2","+1<3!d3",24],
  60: ["<1=0_","o1s2*3!","d1+0x2",189],
 }

// state = {pieces:[id,i,j,ori],adventurer:[i,j],hole:[i,j],exp_moves:N}
export {levels, startStates}
let startStates={}

for (const no in problems){
    let piecesSet = new Set("_=s+d*xo<!".split(""));
    let pieces = [];
    let hole = null;
    let adventurer=null;
    const problem = problems[no];
    const expected = problem[3];
    for (let i=0;i<3;i++){
        const matches = Array.from(problem[i].matchAll(validRE))
        for (let j=0;j<3;j++){
            const match = matches[j];
            if (match[1]!=null){
                if (hole != null){
                    console.log("*** Problem %d: duplicate hole at %d,%d",no,i,j)
                } else {
                    hole=[i,j];
                    piecesSet.delete(match[1])
                }
            } else {
                const k = match[2] ? 2 : 3;
                const p = match[k].charAt(0);
                if (!piecesSet.has(p)){
                    console.log("*** Problem %d: duplicate %s at %d,%d",no,p,i,j)
                } else {
                    piecesSet.delete(p);
                    const ori="↑→↓←".charAt(parseInt(match[k].charAt(1)))
                    pieces.push([p,i,j,ori])
                    if (match[k].length==3){
                        adventurer=[i,j];
                        piecesSet.delete("!")
                    }
                }
            }
        }
    }
    if (piecesSet.size>0){
        console.log("*** Problem %d: missing pieces: s",no,Array.from(piecesSet).join(", "))
    } else {
        startStates[no]=JSON.stringify({pieces:pieces,adventurer:adventurer,expected:expected})
        // console.log(startStates[no])
    }    
}
