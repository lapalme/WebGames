export {levels,problems as startStates}
const levels =[{"en":"Starter","fr":"Débutant","from":1,"to":12},
               {"en":"Junior","fr":"Junior","from":13,"to":24},
               {"en":"Expert","fr":"Expert","from":25,"to":36},
               {"en":"Master","fr":"Maître","from":37,"to":48},
               {"en":"Wizard","fr":"Génie","from":49,"to":60}];

// configuration : piece,color,i,j,direction
// pièce
//  + : cross
//  * : start
//  S : Elbow
//  F : right-arrow
//  U : u-turn-right
//  W : u-turn-left
// color : B(blue) | R (red) if red piece must be inverted
// direction: N|S|E|O

const problems = {
    1:"*B21N +B22 *R45N +R25",
    2:"*B32O +B50 *R25N +R54",
    3:"*B21N +B22 *R40N +R13",
    4:"*B33E +B05 *R42O +R53",
    5:"*B42N +B13 *R30S +R21",
    6:"*B13O +B01 *R31S +R20",
    7:"*B31N +B32 *R43O +R02",
    8:"*B33E +B24 *R12O +R22",
    9:"*B31N +B43 *R55N +R24",
    10:"*B34O +B45 *R32S +R55",
    11:"*B25O +B35 *R51E +R43",
    12:"*B22N +B03 *R25N +R24",
    13:"*B12O +B53 *R21S +R01",
    14:"*R12E +R35 *B34S +B04",
    15:"*R34S +R12 *B04O +B14",
    16:"*R25N +R32 *B42O +B55",
    17:"*B32E +B53 *R35S +R30",
    18:"*B25O +B11 *R53O +R21",
    19:"*B43O +B53 *R11S +R20",
    20:"*B40E +B53 *R21E +R43",
    21:"*B35S +B24 *R21E +R30",
    22:"*B42N +B52 *R41N +R03",
    23:"*B11S +B03 *R51N +R54",
    24:"*B35S +B24 *R51N +R40",
    25:"*B20N +B43 *R31S +R42",
    26:"*B24S +B03 *R15S +R42",
    27:"*B10E +B21 *R32O +R53",
    28:"*B42E +B20 *R12S +R33",
    29:"*B20E +B14 *R33E +R24",
    30:"*B20S +B42 *R05S +R11",
    31:"*B45N +B14 *R42E +R41",
    32:"*B30E +B21 *R10E +R41",
    33:"*B41N +B20 *R11E +R43",
    34:"*B32E +B44 *R53N +R15",
    35:"*B32E +B22 *R20E +R41",
    36:"*B43E +B12 *R42O +R01",
    37:"*B10S +B13 *R02S +R53",
    38:"*B43N +B45 *R32N +R35",
    39:"*B22S +B14 *R31N +R54",
    40:"*B45O +B31 *R13O +R20",
    41:"*B34O +B24 *R42O +R25",
    42:"*B14O +B53 *R25S +R05",
    43:"*B21S +B35 *R45O +R55",
    44:"*B50E +B20 *R33E +R15",
    45:"*B20N +B12 *R55N +R42",
    46:"*B14S +B03 *R12S +R20",
    47:"*B02S +B33 *R53N +R32",
    48:"*B14O +B42 *R43E +R25",
    49:"*B40E +B12 *R15O +R50",
    50:"*B40N +B32 *R52E +R31",
    51:"*B43N +B35 *R14S +R44",
    52:"*B30S +B22 *R11E +R55",
    53:"*B30E +B35 *R15O +R25",
    54:"*B43N +B12 *R04O +R44",
    55:"*B01S +B55 *R50E +R03",
    56:"*B44N +B52 *R20N +R14",
    57:"*B33E +B20 *R01S +R40",
    58:"*B25O +B52 *R05O +R35",
    59:"*B51N +B50 *R11S +R55",
    60:"*B02O +B03 *R55O +R15"
}

// validate starting configurations
const startConfigRE =/\*[RB][0-5][0-5][NSEO]|\+[RB][0-5][0-5]/
const letter2arrow = {"S":"↓", "O":"←", "N":"↑", "E":"→"}
for (const no in problems){
    const problem = problems[no];
    let pieces = [];
    for (let piece of problem.split(" ")){
        if (!startConfigRE.test(piece)){
            console.log("Problem %d: bad configuration: %s",no,piece);
            delete problems[no];
            pieces=[];
            break;
        } else {
            // set direction as an arrow
            if (piece.length==4)piece+="↑"; 
            else 
                piece = piece.slice(0,4)+letter2arrow[piece.charAt(4)]
            pieces.push(piece)
        }
    }
    if (pieces.length>0)problems[no] = pieces.sort().join(" ")
}