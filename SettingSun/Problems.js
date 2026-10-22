// Seeting Sun tiling game
// also known as Klotski : https://en.wikipedia.org/wiki/Klotski
//               L'Âne Rouge: https://fr.wikipedia.org/wiki/L%27Âne_rouge
//               Piano mover puzzle : https://www.doc.ic.ac.uk/~kb/MACTHINGS/pianoP.html
//
// levels taken from :https://omerkel.github.io/LAneRouge/html5/src/index.html
//  analyse du nombre de solutions:
//       https://c.developpez.com/defis/3-Ane-Rouge/#L6.3
const levels =[{"en":"Starter","fr":"Débutant","from":1,"to":15},
               {"en":"Intermediate","fr":"Intermédiaire","from":16,"to":30},
               {"en":"Advanced","fr":"Avancé","from":31,"to":40},
               {"en":"Expert","fr":"Expert","from":41,"to":49},
               {"en":"Classic","fr":"Classique","from":50,"to":53}]

// 4X5 square
//  *: single square
//  #: big 2x2 square
//  |: 2x1 square (vertical) suivi d'un souligné
//  -: 1x2 square (horizontal) suivi d'un souligné
//  . : free squares
/*
    NN: ["",
         "",
         "",
         "",
         ""],

*/

const problems = {
     1: ["-_-_",
         "|-_|",
         "_##_",
         "*##*",
         ".**."],
     2: ["-_..",
         "-_-_",
         "-_-_",
         "**##",
         "**##"],
     3: ["||.|",
         "__._",
         "|##|",
         "_##_",
         "****"],
     4: [".-_.",
         "-_-_",
         "|##|",
         "_##_",
         "****"],
     5: ["*-_*",
         "*-_*",
         ".-_.",
         "##||",
         "##__"],
    16: [".-_.",
         "-_-_",
         "*##*",
         "*##*",
         "-_-_"],
    21:["-_##",
         "||##",
         "__-_",
         "*..*",
         "-_**"],
    32: ["*-_*",
         "|-_|",
         "_##_",
         "*##*",
         ".-_."],
    36: ["|*##",
         "_|##",
         "*_|*",
         ".*_|",
         ".-__"],
    49: ["##**",
         "##*|",
         "-_|_",
         ".*_|",
         ".-__"],    
    50: ["|##|", // classical Klotski 
         "_##_",
         ".-_.",
         "|**|",
         "_**_"],
    51: ["|##|", // situation in https://fr.wikipedia.org/wiki/L'Âne_rouge
         "_##_",
         "|-_|",
         "_**_",
         "*..*"],
    52: ["|##|", // situation in 6.1 dans https://c.developpez.com/defis/3-Ane-Rouge/#L6.3
         "_##_",
         "****",
         "|-_|",
         "_.._"],
    53: ["##-_",  // Pennant Puzzle
         "##-_",
         "**..",
         "||-_",
         "__-_"],
    
}
/*
50: Solving time: 1 113 847 milliseconds
 : 0  1  2  3 
0: |2 |1 |4 |3
1: |2 |1 |4 |3
2: -1 -1 *3 *2
3: *1 #1 #1  .
4: *4 #1 #1  .
93 moves, 112 jumps: -1→, *1↑←, -1←, |4↑, *4→, *3→, |3→, *1↓, -1←, *1↓, *2↑, *3↑, *4←, |4↓, *2→, -1→, |1↓↓, #1←, |2←, *2↑↑, |4↑↑, *3→, *4→, |3→, *1→, |1↓, -1←, |3↑, *1↑, *4←←, |3↓, |2↓, *2←, |4↑, *3↑, |3→, |2↓↓, *3←↑, -1→, |1↑, -1→, *4←, *1↓, |1→, *4↑, *1←, |1↓, -1←←, |2↑, |4↓, *2→, *3↑, |2↑, |1→, *1→, *4↓, -1↓, #1↓, *3←, *2←, |4↑, |3↑, *3←, *2←, |2↑, |1↑, *1→→, *4→→, -1↓, #1↓, *2↓←, |2←, |1↑↑, #1→, *2↓↓, *3↓↓, |2←, |1←, |4←, |3↑↑, #1→, *2→↑, -1↑, *4←, *1←, *4←, *1←, #1↓, *2→→, *3→→, -1↑, *1↑←, #1←


This is the classical Klotski arrangement for which the minimum number of moves is 81  "if you consider sliding a single piece to any reachable position to be a single move.". This is different from the computed "number of moves"
51: Solving time: 1 219 524 milliseconds
** 51 **
 : 0  1  2  3 
0:  A  B  B  C
1:  A  B  B  C
2:  D  E  E  F
3:  D  G  H  F
4:  I  .  .  J
101 moves, 116 jumps: I→, D↓, E←, H↑, J←, F↓, H→, E→, D↑, I←, J←, F←, H↓, E→, G↑, H↓, J↑, I→, D↓, G←, E←, C↓↓, B→, A→, G↑, D↑, G↑, D↑, I←, J←, F←, H←, C↓, E→, F↑, H↑, I→→, F↓, A↓, G→, D↑, J↑, F←, A↓↓, J→↑, E←, C↑, E←, I→, H↓, C←, I↑, H→, C↓, E→, D↓, E→, A↑, G←, J↑, A↑, C←, H←, I↓, E↓, B↓, J→, G→, D↑, F↑, J→, G→, A↑, C↑, H←←, I←←, E↓, B↓, G↓→, A→, C↑↑, B←, G↓↓, J↓↓, A→, C→, D→, F↑↑, B←, G←↑, E↑, I→, H→, I→, H→, B↓, G←←, J←←, E↑, H↑→, B→

51: Solution after 10 533 428 iterations, 213 621 states unexplored: with jump reordoring
51: Solving time: 1 222 353 milliseconds
91 moves, 116 jumps: I→, D↓, E←, H↑, J←, F↓, H→, E→, D↑, I←, J←, F←, H↓↓, E→, G↑, J↑, I→, D↓, G←, E←, C↓↓, B→, A→, G↑↑, D↑↑, I←, J←, F←, H←↑, C↓, E→, F↑, I→→, F↓, A↓, G→, D↑, J↑, F←, A↓↓, J→↑, E←←, C↑, I→, H↓, C←, I↑, H→, C↓, E→→, D↓, A↑, G←, J↑, A↑, C←, H←, I↓, E↓, B↓, J→→, G→→, D↑, A↑, C↑, F↑, H←←, I←←, E↓, B↓, G↓→, A→, C↑↑, B←, G↓↓, J↓↓, A→, C→, D→, F↑↑, B←, G←↑, E↑, I→→, H→→, B↓, G←←, J←←, E↑, H↑→, B→

** 52 **
 : 0  1  2  3
0:  A  B  B  C
1:  A  B  B  C
2:  D  E  F  G
3:  H  I  I  J
4:  H  .  .  J
52: Solving time: 793 635 milliseconds
73 moves, 85 jumps: I↓, E↓, D→, E→, D↓, H↑, I←, E↓, D→, H→, A↓↓, B←, F↑, D↑, E↑, F↑, D↑, G←, I→, A↓, J↑, I→, H↓, B↓, F←, D↑, F←, D←, G↑↑, B→, A↑↑, H←, E←↓, B↓, D↓, G←, C←, J↑↑, B→, D↓↓, G↓, F→, A↑, H↑, E←, D↓, B←, J↓↓, C→, F→, G→, A→, H↑↑, B←, G↓, F↓, G↓, F↓, C←, J↑, G→, J↑, G↑, I↑, D→→, E→→, B↓, F←←, G←←, I↑, D↑, E→, B→
Total time:793 635 milliseconds for 1 problems: average: 793 635 milliseconds
// with jump reordering

61 moves, 85 jumps: I↓, F↓←, G←↓, J↑, I→, F↓, G←, J←, C↓↓, B→, E↑↑, D→↑, G↑, F↑, H↑, I←←, C↓, J↓, B↓, E→→, D↑→, G↑↑, B←, C↑↑, J→, F→↓, B↓, D↓, G→, A→, H↑↑, B←, D↓↓, G↓, E←, C↑, J↑, F→, D↓, B→, H↓↓, A←, E←, G←, C←, J↑↑, B→, G↓↓, E↓↓, A→, H↑↑, G←↑, I↑, D←←, F←←, B↓, E→→, G→→, I↑, F↑←, B←
Total time:791 747 milliseconds for 1 problems: average: 791 747 milliseconds
*/

// state : [[type,i,j]]

function checkNb(no,pieces,kind,expected){
    const found = pieces.filter(([_,_i,_j,k])=>kind.includes(k)).length
    if (found!=expected){
        console.log("*** Problem %d: piece %s found %d instead of %d",no,kind,found,expected)
    }
}

const alphabet = "ABCDEFGHIJ" // for the id of pieces

export {levels, startStates}
let startStates={}

for (const no in problems){
    const problem = problems[no];
    let pieces = []
    if (problem.length!=5){
        console.log("*** Problem %d: 5 lines expected",no);
        continue;
    }
    let cs = []
    for (let i=0;i<5;i++) // build array of chars to ease modification
        cs.push(problem[i].split(""))
    let k=0;
    let nbV=0,nbH=0,nb1=0,nb4=0;
    for (let i=0;i<5;i++){
        const line = cs[i];
        for (let j=0;j<4;j++){
            const c = line[j];
            if (c != "."){
                if (c=="|"){
                    if (cs[i+1][j] != "_")
                        console.log("*** Problem %d: _ expected at %d,%d",no,i+1,j)
                    cs[i+1][j]="."
                    nbV++;
                    pieces.push([alphabet.charAt(k++),i,j,c])
                } else if (c=="-"){
                    if (cs[i][j+1] != "_")
                        console.log("*** Problem %d: _ expected at %d,%d",no,i,j+1)
                    cs[i][j+1]="."
                    nbH++;
                    pieces.push([alphabet.charAt(k++),i,j,c])
                } else if (c=="#" && cs[i][j+1]=="#" && cs[i+1][j]=="#" && cs[i+1][j+1]=="#"){
                    cs[i][j+1]  ="."
                    cs[i+1][j]  ="."
                    cs[i+1][j+1]="."
                    nb4++;
                    pieces.push([alphabet.charAt(k++),i,j,c])
                } else if (c=="*"){
                    nb1++;
                    pieces.push([alphabet.charAt(k++),i,j,c])
                } else {
                    console.log("*** Problem %d: line %d, col %d: bad char",no,i,j,c)
                }
            }
        }
    }
    checkNb(no,pieces,"*",4)
    checkNb(no,pieces,"#",1)
    checkNb(no,pieces,"-|",5)
    startStates[no]=JSON.stringify(pieces)
    // console.log(no+"\n"+startStates[no])
}
