export {levels,problems as startStates}  // no conversion necessary between problem and states
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
//  U : u-turn-rigth
//  W : u-turn-left
// color : B(blue) | R (red) if red piece must be inverted
// direction: N|S|E|O

const problems = {
    0:"*R45N +R40 +R44",
    1:"*R02E +R05 +R44",
    2:"*R45N +R01 +R52",
    3:"*R22O +R02 +R44",
    4:"*B20N +B01 +B13",
    5:"*B12O +B01 +B13",
    6:"*B22S +B41 +B43",
    7:"*B32N +B13 +B14",
    8:"*B43E +B24 +B25",
    9:"*B33O +B30 +B05",
    10:"*B34N +B11 +B03",
    11:"*R12O +R15",
    12:"*R50E +R30 +R44",
    13:"*R52N +R11 +R44",
    14:"*R51E +R20 +R44",
    15:"*R14O +R11 +R25",
    16:"*R13O +R15 +R44",
    17:"*B35S +B03 +B30",
    18:"*B32N +B01 +B13",
    19:"*B52O +B11 +B14",
    20:"*B15S +B04 +B33",
    21:"*R52O +R21 +R45",
    22:"*R12O +R03 +R44",
    23:"*R14O +R02 +R50",
    24:"*B44O +B32 +B55",
    25:"*B43N +B04 +B14",
    26:"*R13O +R20 +R44",
    27:"*B54O +B41",
    28:"*R10S +R41",
    29:"*R52O +R11 +R21",
    30:"*B22N +B03 +B14",
    31:"*B41E +B33 +B55",
    32:"*B04S +B02 +B20",
    33:"*R15O +R31 +R32",
    34:"*R32E +R01 +R44",
    35:"*R13E +R25 +R34",
    36:"*R53O +R40 +R22",
    37:"*B44O +B21 +B45",
    38:"*B14S +B04 +B31",
    39:"*B15S +B05 +B14",
    40:"*B13O +B10 +B14",
    41:"*R32E +R21 +R44",
    42:"*R35S +R13 +R44",
    43:"*B44N +B11 +B04",
    44:"*B31N +B13 +B14",
    45:"*B22S +B41 +B52",
    46:"*R35N +R20 +R13",
    47:"*B32S +B41 +B55",
    48:"*B32O +B02 +B41",
    49:"*R12O +R04 +R25",
    50:"*R33O +R40 +R45",
    51:"*R31N +R12 +R33",
    52:"*R43N +R11 +R44",
    53:"*R55N +R53",
    54:"*B14O +B34 +B44",
    55:"*B12O +B34 +B51",
    56:"*B35S +B13 +B20",
    57:"*B40E +B20 +B04",
    58:"*R03S +R25 +R52",
    59:"*B25O +B03 +B35",
    60:"*R42N +R10 +R15"
}

// validate starting configurations
const startConfigRE =/\*[RB][0-5][0-5][NSEO]|\+[RB][0-5][0-5]/
const letter2arrow = {"S":"↓", "O":"←", "N":"↑", "E":"→"}
for (const no in problems){
    const problem = problems[no];
    let pieces = [];
    for (let piece of problem.split(" ")){
        if (!startConfigRE.test(piece)){
            console.log("Problem %d: bad configuration: %d",no,piece);
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