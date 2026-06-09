export {levels,problems as startStates}
const levels =[{"en":"Starter","fr":"Débutant","from":1,"to":16},
               {"en":"Junior","fr":"Junior","from":17,"to":28},
               {"en":"Expert","fr":"Expert","from":29,"to":48},
               {"en":"Master","fr":"Maître","from":49,"to":64},
               {"en":"Wizard","fr":"Génie","from":65,"to":80}];

//  i,j,piece where piece: m:medium ball, l:large ball, t: tree
//  head: b:blue, y: yellow, r:red
const problems = {
    1:"01m 34l 30b",
    2:"10l 13y 24m 21t",
    3:"00t 03l 13m 24r 31t",
    4:"00t 03m 30y 34l",
    5:"00t 02t 04t 12b 03m 34l",
    6:"02t 10b 11m 13l 32t",
    7:"11t 12t 24r 30m 32l",
    8:"01t 03m 04l 24t 32b",
    9:"00t 02m 13r 31l 34t",
    10:"00t 02t 11t 23r 31m 34l",
    11:"00t 01t 03y 20m 24t 30l",
    12:"00t 01l 04t 21b 23m",
    13:"00t 02m 14r 21t 34l",
    14:"01t 13t 20m 32r 34l",
    15:"00t 01t 04m 14b 20l 32t",
    16:"00t 01t 14b 20m 30l 31t",
    17:"01t 14t 20t 23m 33r 34l",
    18:"02t 03m 04l 10t 23t 31b",
    19:"02t 04m 10t 14t 21y 33l",
    20:"01t 13y 20l 32t 34m",
    21:"03b 10t 24t 30m 32l",
    22:"01t 03m 10t 20b 32t 34l",
    23:"02t 10t 14b 21t 30l 34m",
    24:"02b 10t 14t 21t 31m 34l",
    25:"00t 02t 04m 23b 30l 31t",
    26:"00t 02l 14t 20t 30m 33r",
    27:"01t 04m 14t 20r 32t 33l",
    28:"00t 14t 20m 30l 33b",
    29:"11y 13b 20l 21m 23m 24l",
    30:"00r 02t 04m 10l 23m 30y 31l 32t",
    31:"00l 02b 04l 10t 12r 24m 32m",
    32:"02r 04l 11t 13y 22t 30m 32l 34m",
    33:"00l 04m 10r 12y 32m 34l",
    34:"00l 02b 03m 04l 10t 20t 23y 33m",
    35:"00t 02t 03l 04y 24m 30l 31m 33r",
    36:"00l 02y 04m 10r 11t 22t 30l 34m",
    37:"00y 02l 04m 11t 13b 23t 30l 32m",
    38:"00l 01l 03m 10t 11y 13b 14t 32m",
    39:"00b 03l 10m 12t 24m 30l 32r",
    40:"00t 01b 03l 04m 10r 12m 30l 33t",
    41:"00l 04m 12b 20m 22y 30l",
    42:"00l 04m 11r 20l 22y 24m",
    43:"00m 01b 02t 04m 30l 32r 34l",
    44:"04l 11t 12r 13t 22y 30m 33l 34m",
    45:"01t 10m 12m 14y 21b 23t 30l 34l",
    46:"00l 01m 02t 03l 04b 20t 21y 24m",
    47:"00l 02r 04m 11t 13t 14m 30b 34l",
    48:"01t 04l 11m 14t 31y 32m 33r 34l",
    49:"00m 01m 02m 03l 10t 12y 13t 21l 22r 32b 34l",
    50:"00y 01l 02m 04m 12t 14b 20l 22t 31r 32m 34l",
    51:"00l 01l 03r 10t 14b 20l 22t 30m 31m 32m 33y",
    52:"00t 01l 04l 13m 14b 20m 23r 24l 31m 32y",
    53:"00l 02t 11y 13b 20t 30m 31m 34l",
    54:"02l 11t 14y 21t 24b 30m 31m 34l",
    55:"00l 01t 02r 03b 04l 30m 33t 34m",
    56:"01t 03t 04m 20m 22y 24l 31r 33l",
    57:"02t 10t 12m 13r 21m 24y 30l 34l",
    58:"00t 01m 14y 20t 22l 30l 33r 34m",
    59:"00l 03l 11t 14b 20r 23t 31m 34m",
    60:"00l 01m 04b 11t 12t 20r 31m 34l",
    61:"00y 02r 04m 11b 13l 14t 20l 21m 22m 33l",
    62:"00m 01m 02m 03y 11t 12l 13l 14b 21t 33r 34l",
    63:"02l 04m 12t 14m 20r 22y 24b 30m 32l 34l",
    64:"00m 02b 10t 11r 13y 14l 23m 24t 30l 31l 34m",
    65:"01y 03b 10t 11m 12l 22m 24t 32l",
    66:"01y 04l 20m 32r 33m 34l",
    67:"01l 04l 10t 14m 20r 32b 33m",
    68:"00t 02y 03m 10m 11t 24l 30l 32r",
    69:"00l 02r 03b 04l 10m 11t 23t 24y 30l 33m 34m",
    70:"01t 02m 03m 11t 13m 14l 20r 21l 30y 32l 33b",
    71:"00l 02t 04m 10y 12t 14m 20b 21l 22m 30l 34r",
    72:"00l 02l 03l 04m 10t 11r 20b 21y 32m 34m",
    73:"01y 04m 20l 24m 33b 34l",
    74:"00t 01l 02l 11m 12m 14r 20b 33t",
    75:"00m 01t 14r 20m 24b 30l 31t 34l",
    76:"00l 03b 04m 10t 12l 24r 31m",
    77:"00t 01m 03l 10r 14m 22t 23m 24l 31b 33y 34l",
    78:"01b 02y 03r 04l 20m 24l 30m 31m 32l",
    79:"00t 02l 04t 10r 11b 12m 20y 21l 22m 32m 34l",
    80:"00m 01t 03b 11l 12l 13m 14l 20t 23m 33y 34r"
    // original at origin 1,1
    // 1:"12m 45l 41b",
    // 2:"21l 24y 35m 32t",
    // 3:"11t 14l 24m 35r 42t",
    // 4:"11t 14m 41y 45l",
    // 5:"11t 13t 15t 23b 14m 45l",
    // 6:"13t 21b 22m 24l 43t",
    // 7:"22t 23t 35r 41m 43l",
    // 8:"12t 14m 15l 35t 43b",
    // 9:"11t 13m 24r 42l 45t",
    // 10:"11t 13t 22t 34r 42m 45l",
    // 11:"11t 12t 14y 31m 35t 41l",
    // 12:"11t 12l 15t 32b 34m",
    // 13:"11t 13m 25r 32t 45l",
    // 14:"12t 24t 31m 43r 45l",
    // 15:"11t 12t 15m 25b 31l 43t",
    // 16:"11t 12t 25b 31m 41l 42t",
    // 17:"12t 25t 31t 34m 44r 45l",
    // 18:"13t 14m 15l 21t 34t 42b",
    // 19:"13t 15m 21t 25t 32y 44l",
    // 20:"12t 24y 31l 43t 45m",
    // 21:"14b 21t 35t 41m 43l",
    // 22:"12t 14m 21t 31b 43t 45l",
    // 23:"13t 21t 25b 32t 41l 45m",
    // 24:"13b 21t 25t 32t 42m 45l",
    // 25:"11t 13t 15m 34b 41l 42t",
    // 26:"11t 13l 25t 31t 41m 44r",
    // 27:"12t 15m 25t 31r 43t 44l",
    // 28:"11t 25t 31m 41l 44b",
    // 29:"22y 24b 31l 32m 34m 35l",
    // 30:"11r 13t 15m 21l 34m 41y 42l 43t",
    // 31:"11l 13b 15l 21t 23r 35m 43m",
    // 32:"13r 15l 22t 24y 33t 41m 43l 45m",
    // 33:"11l 15m 21r 23y 43m 45l",
    // 34:"11l 13b 14m 15l 21t 31t 34y 44m",
    // 35:"11t 13t 14l 15y 35m 41l 42m 44r",
    // 36:"11l 13y 15m 21r 22t 33t 41l 45m",
    // 37:"11y 13l 15m 22t 24b 34t 41l 43m",
    // 38:"11l 12l 14m 21t 22y 24b 25t 43m",
    // 39:"11b 14l 21m 23t 35m 41l 43r",
    // 40:"11t 12b 14l 15m 21r 23m 41l 44t",
    // 41:"11l 15m 23b 31m 33y 41l",
    // 42:"11l 15m 22r 31l 33y 35m",
    // 43:"11m 12b 13t 15m 41l 43r 45l",
    // 44:"15l 22t 23r 24t 33y 41m 44l 45m",
    // 45:"12t 21m 23m 25y 32b 34t 41l 45l",
    // 46:"11l 12m 13t 14l 15b 31t 32y 35m",
    // 47:"11l 13r 15m 22t 24t 25m 41b 45l",
    // 48:"12t 15l 22m 25t 42y 43m 44r 45l",
    // 49:"11m 12m 13m 14l 21t 23y 24t 32l 33r 43b 45l",
    // 50:"11y 12l 13m 15m 23t 25b 31l 33t 42r 43m 45l",
    // 51:"11l 12l 14r 21t 25b 31l 33t 41m 42m 43m 44y",
    // 52:"11t 12l 15l 24m 25b 31m 34r 35l 42m 43y",
    // 53:"11l 13t 22y 24b 31t 41m 42m 45l",
    // 54:"13l 22t 25y 32t 35b 41m 42m 45l",
    // 55:"11l 12t 13r 14b 15l 41m 44t 45m",
    // 56:"12t 14t 15m 31m 33y 35l 42r 44l",
    // 57:"13t 21t 23m 24r 32m 35y 41l 45l",
    // 58:"11t 12m 25y 31t 33l 41l 44r 45m",
    // 59:"11l 14l 22t 25b 31r 34t 42m 45m",
    // 60:"11l 12m 15b 22t 23t 31r 42m 45l",
    // 61:"11y 13r 15m 22b 24l 25t 31l 32m 33m 44l",
    // 62:"11m 12m 13m 14y 22t 23l 24l 25b 32t 44r 45l",
    // 63:"13l 15m 23t 25m 31r 33y 35b 41m 43l 45l",
    // 64:"11m 13b 21t 22r 24y 25l 34m 35t 41l 42l 45m",
    // 65:"12y 14b 21t 22m 23l 33m 35t 43l",
    // 66:"12y 15l 31m 43r 44m 45l",
    // 67:"12l 15l 21t 25m 31r 43b 44m",
    // 68:"11t 13y 14m 21m 22t 35l 41l 43r",
    // 69:"11l 13r 14b 15l 21m 22t 34t 35y 41l 44m 45m",
    // 70:"12t 13m 14m 22t 24m 25l 31r 32l 41y 43l 44b",
    // 71:"11l 13t 15m 21y 23t 25m 31b 32l 33m 41l 45r",
    // 72:"11l 13l 14l 15m 21t 22r 31b 32y 43m 45m",
    // 73:"12y 15m 31l 35m 44b 45l",
    // 74:"11t 12l 13l 22m 23m 25r 31b 44t",
    // 75:"11m 12t 25r 31m 35b 41l 42t 45l",
    // 76:"11l 14b 15m 21t 23l 35r 42m",
    // 77:"11t 12m 14l 21r 25m 33t 34m 35l 42b 44y 45l",
    // 78:"12b 13y 14r 15l 31m 35l 41m 42m 43l",
    // 79:"11t 13l 15t 21r 22b 23m 31y 32l 33m 43m 45l",
    // 80:"11m 12t 14b 22l 23l 24m 25l 31t 34m 44y 45r"  
}


// for (const key in problems){ // for transforming 1,1 based to 0,0 based...
//     console.log(` ${key}:"${problems[key].replaceAll("1","0").replaceAll("2","1").replaceAll("3","2").replaceAll("4","3").replaceAll("5","4")}",`)    
// }

const valideRE = /^([0-3][0-4])([lmtbry])$/
// validate problems
for (const problem in problems){
    let positions = new Set();
    let nbL=0,nbM=0,nbH=0;
    for (const piece of problems[problem].split(/ +/)){
        const m = valideRE.exec(piece)
        if (m==null){
            console.log("*** Problem %d: %s : bad piece %s ",problem,problems[problem],piece)
        } else {
            if (positions.has(m[1])){
                console.log("*** Problem %d: %s : superposition at %s",problem,problems[problem],m[1])
            } else {
                positions.add(m[1])
            }
            switch (m[2]) {
                case "l":nbL++;
                    break;
                case "m":nbM++;
                    break;
                case "y":case "b":case "r":nbH++;
                    break;
                default:
            }
        }
    }
    if (nbH != nbL || nbH != nbM)
        console.log("*** Problem %d: %s : number of balls and heads inconsistency",problem,problems[problem])
}