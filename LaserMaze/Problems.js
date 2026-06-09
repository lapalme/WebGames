
export {levels,startStates}
// fix levels names and numbers
const levels =[{"en":"Starter","fr":"Débutant","from":1,"to":15},
               {"en":"intermediate","fr":"Intermédiaire","from":16,"to":30},
               {"en":"Advanced","fr":"Avancé","from":31,"to":45},
               {"en":"Expert","fr":"Expert","from":46,"to":60}];

//  notation : color Red, Purple,Green, Blue, Yellow, #: Black (but B already used)) 
//  position : IJ
//  orientation: RED and Purple: North, Suth, East, West
//             : Green, Blue / or \  (internally N and W)
//             : Yellow : | or -     (internally N and W)
//  ? : free orientation
//  * : fixed target
//  in the reserve, only letter (always free orientation)
//                  but P can be followed by * when fixed target

const problems = {
    // test configurations used at one time for development
    // "0": ["",1,"R01S G11/ B10/ P20N #21 P33W G31\\ P41N Y32|"],
    // "0": ["G B P",1,"R01S #21 P33W G31\\ P41N Y32|"],
    // "-4":["P",1,"R01S Y10- P40S P41?"],
    // "-5":["G",2,"R30E P01?* P34?* #41"],
    // "-23":["P",2,"P04N* Y21- R31S P41S G42\\ P44E"],
    // "-31":["P B",1,"P00? P03? Y20- R34? #40 P43?*"],
    // "-60":["R G G P P",3,"P03W* P10S* #21 Y22| P34N* B41/"],
    // "1":["B R P*",1,"R11N R12? R13E  G01/ G02? G03\\  B21/ B22? B23\\  Y31- Y32? Y33| P40? P41?* P42S* P43W #44"], // test of display of all pieces
    
    "1":["B",1,"R11S P33W*"],
    "2":["P",1,"P04S* P30W R40?"],
    "3":["R",1,"P30? P40? P41?* P34N"],
    "4":["P P",1,"R01S Y10- P40?"],
    "5":["R G",2,"P01? P34? #41"],
    "6":["R B",1,"P01?* Y33|"],
    "7":["B",1,"P01S* R10E P14N P41S P44E"],
    "8":["P P",1,"P00?* Y02| R42? #44"], 
    "13":["G",2,"R02? B04\\ P20E* P30?* P34?"], 
    "16":["P P P G",2,"P23? R31S P42?"], 
    "17":["P* G",2,"R00? P04?* B13\\"],
    "23":["P P P G",2,"P04?* Y21? R31S"],
    "25":["P* B",2,"R00? #03 Y32? G33? P43?*"],
    "31":["P B",1,"P00? P03? Y20- R34? #40 P43?*"],
    "35":["B",2,"P02? P10?* Y11? R13? P21? G22? P30? P32?"],
    "39":["R P Y",1, "P12N P20E* #23 P24? B31? P34?"],
    "42":["R B G", 3, "P04?* Y21- P30?* #31 G32? P42? P44?*"],
    "46":["R G G Y",3,"P01?* P02? #11 P23? P31? P32N"],
    "48":["P P P G G",3,"R04S #10 P11S* B21/ P31N*"],
    "52":["P P P P",3,"G12? P14? R24W G41?"],
    "53":["P P G G",3,"P03?* #20 P22W* Y31? P34?* B40\\ R42?"], 
    "54":["R P G",3, "G01? P04? B13? P22S* P31N* P43?"],
    "55":["G Y",2,"R11? P13? P22? P31? P34? P42? B43?"],
    "56":["P P G G",3,"P01?* R14? Y21? P32?* P42N*"],
    "57":["P P G G",3,"#00 P02W Y11? P21E B23? P34? R40?"],
    "58":["P P G",2,"Y12? P20S P30? R32? P40S B44/"],
    "59":["P P P G",3,"P10?* #12 G13? P20?* B22? R31N Y33?"],
    "60":["R P P G G",3,"P03W* P10S #21 Y22? P34N* B41?"]
}

const startStates = {}

const pieceRE = /R[0-4][0-4][NESW?]|P[0-4][0-4][NESW?]\*?|[GB][0-4][0-4][\\/?]|Y[0-4][0-4][-|?]|#[0-4][0-4]/

const defaultOri = {"R":"?","P":"N", "G":"/", "B":"/","Y":"|"}

for (const no in problems){
    const [reserveS,targets,piecesS] = problems[no];
    const letters = reserveS.length==0 ? [] : reserveS.split(" ");
    let reserve = []
    for (const p of letters){
        if (!"RPGBY".includes(p.charAt(0))){
            console.log("*** Problem %s: illegal piece in reserve : %s",no,p)
        }
        reserve.push([p.charAt(0),-1.5,reserve.length,defaultOri[p.charAt(0)],true,p.includes("*")])
    }
    
    // sort pieces in the reserve by number of possible turns for each kind of piece
    // hoping that this will speed searching for possibilities in breadth first tree
    const reserveRank = {"R":0,"G":1,"B":2,"Y":3,"P":4}
    reserve.sort((a,b)=>reserveRank[a[0]]-reserveRank[b[0]])
    
    const pieces = [];
    for (const ps of piecesS.split(" ")){
        if (!pieceRE.test(ps)){
            console.log("*** Problem %s: illegal piece :%s",no,ps)
        } else {
            const id=ps.charAt(0);
            const i=parseInt(ps.charAt(1)), j=parseInt(ps.charAt(2));           
            if (id == "#"){
                pieces.push(["#",i,j,"N",false,false]);
            } else {
                let ori = ps.charAt(3);
                if (ori=="?")
                    pieces.push([id,i,j,defaultOri[id],true,ps.includes("*")])
                else
                    pieces.push([id,i,j,ori,false,ps.includes("*")])
            }
        }
    }
    startStates[parseInt(no)]=JSON.stringify({reserve:reserve,targets:targets,pieces:pieces})
}

//      display startStates
// for (const no in startStates){
//     console.log(problems[no])
//     console.log(no,startStates[no])
// }

///////////// solving time on March 12th on a Mac Pro 2023
/*
1: Solution after 1 iterations, 3 states unexplored
1: Solving time: 0 milliseconds
--
2: Solution after 2 iterations, 14 states unexplored
2: Solving time: 0 milliseconds
--
3: Solution after 135 iterations, 93 states unexplored
3: Solving time: 5 milliseconds
--
4: Solution after 135 iterations, 215 states unexplored
4: Solving time: 6 milliseconds
--
5: Solution after 675 iterations, 493 states unexplored
5: Solving time: 17 milliseconds
--
6: Solution after 349 iterations, 261 states unexplored
6: Solving time: 6 milliseconds
--
7: Solution after 1 iterations, 1 states unexplored
7: Solving time: 0 milliseconds
--
8: Solution after 137 iterations, 242 states unexplored
8: Solving time: 5 milliseconds
--
13: Solution after 38 iterations, 32 states unexplored
13: Solving time: 1 milliseconds
--
16: Solution after 984 iterations, 5 854 states unexplored
16: Solving time: 60 milliseconds
--
17: Solution after 274 iterations, 1 367 states unexplored
17: Solving time: 16 milliseconds
--
23: Solution after 7 205 iterations, 38 357 states unexplored
23: Solving time: 386 milliseconds
--
25: Solution after 241 iterations, 402 states unexplored
25: Solving time: 6 milliseconds
--
31: Solution after 179 iterations, 563 states unexplored
31: Solving time: 6 milliseconds
--
35: Solution after 631 iterations, 1 344 states unexplored
35: Solving time: 27 milliseconds
--
39: Solution after 10 504 iterations, 21 048 states unexplored
39: Solving time: 377 milliseconds
--
42: Solution after 514 661 iterations, 997 383 states unexplored
42: Solving time: 55 954 milliseconds
--
46: Solution after 1 179 474 iterations, 1 622 035 states unexplored
46: Solving time: 212 373 milliseconds
--
48: Solution after 45 395 iterations, 688 814 states unexplored
48: Solving time: 6 985 milliseconds
--
52: Solution after 360 231 iterations, 827 571 states unexplored
52: Solving time: 35 130 milliseconds
--
53: Solution after 1 175 526 iterations, 3 875 000 states unexplored
53: Solving time: 270 971 milliseconds
--
54: Solution after 139 233 iterations, 163 261 states unexplored
54: Solving time: 8 125 milliseconds
--
55: Solution after 32 556 iterations, 61 682 states unexplored
55: Solving time: 1 582 milliseconds
--
56: Solution after 385 453 iterations, 1 073 915 states unexplored
56: Solving time: 40 672 milliseconds
--
57: Solution after 901 401 iterations, 1 702 928 states unexplored
57: Solving time: 169 753 milliseconds
--
58: Solution after 3 590 iterations, 15 954 states unexplored
58: Solving time: 210 milliseconds
--
59: Solution after 605 158 iterations, 1 595 029 states unexplored
59: Solving time: 89 275 milliseconds
--
60: Solution after 8 731 iterations, 101 604 states unexplored
60: Solving time: 904 milliseconds

*/