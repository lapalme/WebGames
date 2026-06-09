//  Game Cats & Boxes de Smart Games
//     https://www.smartgames.eu/uk/one-player-games/cats-boxes
//     https://www.smartgames.eu/fr/jeux-pour-1-joueur/chats-tournent-en-rond

// fix levels names and numbers
const levels =[{"en":"Starter","fr":"Débutant","from":1,"to":12},
               {"en":"Junior","fr":"Junior","from":13,"to":24},
               {"en":"Expert","fr":"Expert","from":25,"to":36},
               {"en":"Master","fr":"Maître","from":37,"to":48},
               {"en":"Wizard","fr":"Génie","from":49,"to":60},
               {"en":"Bonus","fr":"Bonus","from":101,"to":140},];

//   A problem is on 5 lines as a transcription of the drawing in the booklet (including the Bonus booklet)
//       5 lines of 5 letters which can be: cat | piece | box | space
//          cat: indicated as : w(hite), b(lack), g(ray), o(range), t(an)
//               tan instead of brown which would be the same as b(lack)
//          piece: F, G, H or I according to the part names in the last page of the booklet
//          box:    *   (star)
//          space : _ (underscore)
const problems = {
"1":`
wIF*b
*IgF_
_I*F_
oHG*G
H*HtG`,

"2":`
w_*FF
GGFb*
*gIII
GHo*_
H*Ht_`,

"13":`
w_F*b
_*gF_
IIIFG
*Hot*
H*HGG`,

"44":`
wHG*G
H*HbG
_*g_o
III_F
*tFF*`,

"52":`
*IwGG
bI**g
_I_GF
oHFF*
H*Ht_`,

"59":`
H*Hw_
_HG*G
*IbFG
gI*Fo
_It*F`,

"60":`
wG*G_
_HbGg
H**I_
oHFI*
FF*It`,

"101":`
wGGb_
F*gI_
FG*Io
*FHI*
tH*H_`,

"140":`
wFH*H
_FbHg
_*F_*
GoIII
G*G*t`,
}

// if no state transformation is needed
// export {levels,problems as startStates}

// state: position of the cats as [i,j] and position and orientation of each piece in the order FGHI 
export {levels, startStates,piecePos,allOris,catIds,pieceIds}

// these define the order of cats and pieces in the state
const catIds = "wbgot".split("");
const pieceIds = "FGHI".split("");

// precompute displacements for each orientation of all pieces
let piecePos = { // original is North as shown in the booklet...
    // F
    // F
    // *F
    "F":{"↑":[[0, 0], [-1, 0],  [-2, 0],  [0, +1]]},
    // GG
    // *
    // G
    "G":{"↑":[[0, 0], [ -1, 0],  [-1, +1], [ +1, 0]]},
    //    H
    //   H*H
    "H":{"↑":[[0, 0], [ 0, -1],  [-1, 0],  [ 0, +1]]},
    //    *
    //  III
    //   *
    "I":{"↑":[[0, 0], [ -1, -1], [-1, 0],  [ -1, +1], [ -2, +1]]}
}
// add other orientations
for (const piece in piecePos){
    // console.log("**",piece)
    const pos = piecePos[piece]["↑"]
    // console.log("↑ :",JSON.stringify(pos))
    piecePos[piece]["→"]= pos.map(([i,j])=>[j,-i])  // east
    // console.log("→ :", JSON.stringify(piecePos[piece]["→"]))
    piecePos[piece]["↓"]= pos.map(([i,j])=>[-i,-j]) // south
    // console.log("↓ :",JSON.stringify(piecePos[piece]["↓"]))
    piecePos[piece]["←"]= pos.map(([i,j])=>[-j,i])  // west
    // console.log("← :",JSON.stringify(piecePos[piece]["←"]))
} 

const allOris = Object.keys(piecePos["F"])

function check(grid,c,i,j){
    return i>=0 && i<5 && j>=0 && j<5 && grid[i][j]==c
}

function findPieceOri(grid,piece){
    for (const ori of allOris){
        const myPos = piecePos[piece][ori].slice(1,4);
        const IlastPos = piece=="I" ? piecePos["I"][ori][4] : null;
        for (let i=0;i<5;i++)
            for (let j=0;j<5;j++){
                const c=grid[i][j];
                if (c == "*"){
                    // if (piece == "I")debugger;
                    if (myPos.every(([di,dj])=>check(grid,piece,i+di,j+dj))){
                        if (piece != "I" || check(grid,"*",i+IlastPos[0],j+IlastPos[1])){
                            return [i,j,ori] 
                        }           
                    }
                }
            }
        }
    return null;
}

//  a state is given by two list:
//    - list of [i,j] for the cats in the order: w b g o t
//    - list of [i,j,ori] for the pieces in the order: F G H I
// e.g for Problem 1:  
//  [[[0,0],[0,4],[1,2],[3,0],[4,3]],
//   [[0,3,"↓"],[3,3,"→"],[4,1,"↑"],[1,0,"→"]]]
let startStates={}

for (const no in problems){
    const problem = problems[no].trim();
    let lines = problem.split("\n");
    let grid = [];
    let cats = {"w":null,"b":null,"g":null,"o":null,"t":null};
    let pieces = {"F":null,"G":null,"H":null,"I":null}
    if (lines.length!=5){
        console.log("*** Problem %s: bad number of lines: %d",no,lines.length);
        continue;
    }
    for (let k=0;k<5;k++){
        const letters = lines[k].split("")
        if (letters.length!=5){
            console.log("*** Problem %s: bad number of chars in line %d: %d",no,k,letters.length)
            continue;
        }
        grid.push(letters)
    }
    if (grid.length==5){
        // check the cats and set place to ' '
        for (let i=0;i<5;i++)
            for (let j=0;j<5;j++){
                const c = grid[i][j];
                if ("wbgot".includes(c)){
                    if (cats[c]!=null){
                        console.log("*** Problem %s: %s repeated cat",no,c)
                    } else {
                        cats[c]=[i,j];
                        grid[i][j]='_' // erase the cat
                    }
                }
            }
        // check that all pieces are there 
        for (const piece in piecePos){
            const res = findPieceOri(grid,piece);
            if (res == null){
                console.log("*** Problem %s: piece %s not found",no,piece)
            } else {
                const [i,j,dir] = res;
                pieces[piece] = res;
                piecePos[piece][dir].forEach(([di,dj])=>grid[i+di][j+dj]="_") // erase piece pos
            }
        }
        // check that only spaces are left...
        let empty=true;
        for (let i=0;i<5;i++)
            for (let j=0;j<5;j++){
                if (grid[i][j]!="_"){
                    console.log("Problem %s: cell %d,%d not empty:",no,i,j,grid[i][j])
                    empty=false
                }
            }
        if (empty){
            startStates[parseInt(no)]=JSON.stringify(
                [catIds.map(cid=>cats[cid]),
                 pieceIds.map(pId=>pieces[pId])])
            // console.log("**",no);
            // console.log(startStates[parseInt(no)])               
        }
    }
}
