// Hansel & Gretel (en) : https://www.smartgames.eu/uk/one-player-games/hansel-gretel
// Hansel et Gretel (fr) : https://www.smartgames.eu/fr/jeux-pour-1-joueur/hansel-gretel

// fix levels names and numbers
const levels =[{"en":"Starter","fr":"Débutant","from":1,"to":12},
               {"en":"Junior","fr":"Junior","from":13,"to":24},
               {"en":"Expert","fr":"Expert","from":25,"to":36},
               {"en":"Master","fr":"Maître","from":37,"to":48},
               {"en":"Wizard","fr":"Génie","from":49,"to":60}];

//  NN:["","","","",],
//  4 lines of 4 pieces set on the board, nb of expected moves 
//  b:(boy) hansel, g:gretel, r:rectangle, h:house,.: free
const problems = {
    //  0:["....",".rr.","...r","...r",0],
     1:["..rb",".rr.",".rhh","....",10],
     2:["..b.","rrrr","hh..","....",8],
     3:["g.h.","rrh.",".l..","....",10],
    14:[".hh.","..rr","..l.","..lb",16],
    15:["bh..","rh..","r..l","rr..",13],
    20:["b.r.","hlrl","h...","..l.",16],
    27:["lr..",".rlb",".lhh","....",16],
    30:[".r..","brhh","l.rr","..lg",23],
    32:["r..l","rbh.","glh.","l...",24],
    38:["...r",".hlr","bhr.","l.rg",22],
    41:["gr.l",".r..","hh..","rr..",24],
    44:["...l",".hlg",".h.b","rrl.",25],
    54:["lhrb",".hrg",".l.l","rr..",28],
    59:["gl.b","lrlh","rr.h","r...",38],
    60:[".bgh","..lh",".lr.","rrrl",28],
    
}

// if no state transformation is needed
// export {levels,problems as startStates}

// if some state transformation is needed
const validRE = /[.bgrlh]{4}/
// state: liste of pieces
// piece:[[bgl],i,j] [[rh],i,j,[hv]]
const maxPiece = {"l":3,"h":1,"r":2,"b":1,"g":1}
let startStates={}
export {levels, startStates}
for (const no in problems){
    const problem = problems[no];
    if (problem.length != 5){
        console.log("*** Problem ",no,": length should be 5")
        continue;
    }
    let ok=true
    for (let i=0;i<4;i++){
        if (!validRE.test(problem[i])){
            console.log("*** Problem ",no,": bad line",i)
            ok=false
        }
    }
    let pieces=[]
    let counts={}
    if (ok){
       for (let i=0;i<4;i++){
           for (let j=0;j<4;j++){
               let c=problem[i][j];
               if (c == ".") continue;
               if (c=="g" || c=="b" || c=="l"){
                   pieces.push([c,i,j])
               } else {
                   if (problem[i][j+1]==c){
                      pieces.push([c,i,j,"←"])
                      problem[i]=problem[i].slice(0,j+1)+"."+problem[i].slice(j+2)
                   } else if (problem[i+1][j]==c){
                       pieces.push([c,i,j,"↑"])
                       problem[i+1]=problem[i+1].slice(0,j)+"."+problem[i+1].slice(j+1)
                   } else {
                       console.log("*** Problem", no,": strange piece at",i,j)
                   }
               }
           }
       }
       for (const p in maxPiece){
           const nb = pieces.filter(ps=>ps[0]==p).length;
           if (nb>maxPiece[p]){
               console.log("*** Problem",no,": too many ",p);
               ok=false;
           }
       }
    }
    startStates[no]=JSON.stringify(pieces)
    // console.log(no,startStates[no])
}
console.log("*** End problem validation")
