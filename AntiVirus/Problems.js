export {levels,startStates}

const levels =[{"en":"Starter","fr":"Débutant","from":1,"to":12},
               {"en":"Junior","fr":"Junior","from":13,"to":24},
               {"en":"Expert","fr":"Expert","from":25,"to":36},
               {"en":"Master","fr":"Maître","from":37,"to":48},
               {"en":"Wizard","fr":"Génie","from":49,"to":60}];

// Numbered configuration of the game by Smart Games 
//  Given the fact that the grid is "slanted", we use a zero based notation
//  based on the line number from the opening and a column from the left of the board
//  
//  Each piece position is specified in square brackets containing
//    - the number of the piece (given in first page of the booklet)
//    - the coordinates of its "atoms" in parentheses (line number,column number)
//      starting with the "center", possibly followed by one or two other atom positions
//  This notation is a bit contrived, but I could not find simpler...
//  To help finding these points use the following hack:
//  Running the application in the browser and, in the JavaScript console, type 
//          $(".display-coord").show()
//  This displays the coordinates of each point except those hidden by pieces...
const problems = {  
    1:"[6(2,1)(3,1)(3,3)][0(3,2)(4,3)][9(5,2)]",    
    2:"[8(4,4)(5,2)(4,5)][0(5,3)(6,2)][9(4,2)][9(5,0)]",    
    3:"[0(3,0)(4,1)][9(3,1)][9(4,3)][3(4,4)(5,2)][1(6,0)(6,1)]",    
    4:"[5(2,2)(1,0)(3,4)][6(4,4)(3,2)(5,2)][0(4,1)(5,0)][9(5,3)]",    
    5:"[3(2,0)(3,2)][5(4,3)(3,3)(5,1)][0(4,1)(5,0)][9(6,0)][9(4,5)]",
    6:"[6(3,3)(2,1)(4,3)][0(4,5)(5,4)][7(5,3)(4,4)(6,1)][9(3,1)]",
    7:"[7(2,1)(2,0)(3,3)][0(4,5)(5,4)][8(4,2)(4,1)(3,2)][9(3,4)][9(3,0)]",   
    12:"[3(2,0)(3,2)][7(5,1)(6,0)(4,3)][0(6,1)(7,0)][9(3,0)][9(3,3)]",    
    13:"[5(2,0)(1,0)(3,0)][3(2,2)(3,2)][7(5,2)(4,2)(5,3)][0(5,1)(6,0)][9(4,5)]",    
    14:"[8(1,0)(0,0)(2,2)][0(3,4)(4,5)][1(5,1)(5,2)][3(5,4)(6,2)][9(4,1)][9(4,3)]",    
    15:"[7(3,2)(2,1)(4,2)][2(4,4)(4,3)(5,3)][0(3,4)(4,5)][6(6,0)(5,0)(5,2)][9(6,1)][9(4,6)]", 
    16:"[6(1,0)(2,0)(2,2)][0(3,1)(4,2)][7(3,4)(3,3)(4,6)][8(5,2)(6,0)(5,3)]",
    17:"[0(3,1)(4,2)][3(1,0)(2,0)][4(2,2)(3,4)][1(3,2)(3,3)][9(3,0)][9(4,3)]",
    18:"[0(3,4)(4,5)][7(4,3)(4,4)(3,1)][2(4,1)(4,2)(5,0)][4(6,0)(5,2)][9(6,1)][9(3,0)]",   
    24:"[1(2,1)(2,2)][0(3,4)(4,5)][2(4,1)(3,0)(4,2)][7(6,0)(6,1)(5,0)][6(6,2)(5,2)(7,0)]", 
    25:"[0(4,2)(5,1)][5(6,0)(5,0)(7,0)][2(5,3)(5,2)(6,2)][4(4,4)(5,4)][6(4,3)(3,1)(3,3)]",   
    30:"[6(3,0)(4,0)(4,2)][0(4,1)(5,0)][8(5,2)(5,3)(6,0)][9(2,0)][9(4,6)]",    
    31:"[6(4,5)(3,3)(5,3)][7(4,3)(4,4)(3,1)][4(5,2)(6,0)][0(3,0)(4,1)][9(7,0)]",    
    37:"[3(4,0)(5,0)][4(4,1)(3,1)][6(5,2)(4,2)(4,4)][7(3,3)(2,2)(4,3)][2(5,4)(4,5)(5,3)][0(6,1)(7,0)]",    
    38:"[6(3,0)(2,0)(4,2)][1(3,1)(3,2)][2(4,4)(3,3)(4,3)][9(4,5)][9(4,1)][0(5,3)(6,2)]",    
    39:"[8(3,0)(3,1)(4,0)][0(4,1)(5,0)][7(5,2)(5,1)(6,2)][1(6,0)(6,1)][9(3,4)]",    
    44:"[3(1,0)(2,2)][7(4,3)(3,3)(5,2)][0(5,3)(6,2)][1(6,0)(6,1)][9(3,1)][9(3,4)]",    
    48:"[6(4,1)(3,1)(5,1)][4(4,0)(5,0)][8(3,3)(3,4)(4,3)][0(4,4)(5,3)][1(6,1)(6,2)][9(4,5)]",    
    49:"[7(2,0)(3,1)(1,0)][0(2,2)(3,3)][2(4,3)(3,2)(4,2)][4(4,1)(5,1)][6(6,0)(5,0)(5,2)][1(6,1)(6,2)]",    
    50:"[3(1,0)(2,0)][6(2,1)(3,1)(3,3)][0(3,2)(4,3)][8(5,2)(5,1)(4,4)][9(4,5)][9(6,2)]",    
    51:"[6(2,2)(1,0)(3,2)][7(4,3)(3,1)(4,4)][1(5,1)(5,2)][0(5,3)(6,2)][5(6,0)(5,0)(7,0)]",    
    52:"[8(2,1)(3,1)(2,2)][6(4,2)(3,2)(5,2)][4(4,3)(5,3)][3(4,4)(3,4)][0(4,5)(5,4)][1(6,0)(6,1)][9(4,0)]",    
    53:"[7(2,0)(1,0)(3,1)][1(2,1)(2,2)][0(3,2)(4,3)][4(4,2)(5,2)][5(5,0)(4,0)(6,0)][9(3,0)][9(4,5)]",    
    54:"[1(2,0)(2,1)][4(3,1)(4,3)][5(3,4)(2,2)(4,6)][7(3,3)(3,2)(4,5)][8(6,2)(5,4)(6,1)][0(4,4)(5,3)][9(4,0)]",    
    55:"[1(2,0)(2,1)][5(3,4)(2,2)(4,6)][4(3,3)(4,5)][6(3,2)(4,2)(4,4)][2(4,1)(4,0)(5,0)][0(5,2)(6,1)]",    
    56:"[8(3,3)(2,1)(4,4)][2(3,1)(3,2)(4,2)][4(3,0)(4,0)][1(5,0)(5,1)][3(5,2)(6,2)][0(4,5)(5,4)][9(6,1)]",    
    57:"[6(3,2)(2,0)(2,2)][4(3,1)(4,1)][2(5,1)(5,0)(4,2)][0(3,3)(4,4)][7(5,4)(4,5)(6,2)]",    
    58:"[7(1,0)(0,0)(2,0)][9(2,2)][8(3,1)(4,1)(3,2)][1(3,3)(3,4)][4(4,4)(5,4)][0(5,2)(6,1)][6(5,0)(4,0)(4,2)]",    
    59:"[3(1,0)(2,0)][6(2,2)(3,2)(3,4)][7(4,3)(3,1)(4,4)][0(5,1)(6,0)][1(5,3)(5,4)][2(6,1)(5,2)(6,2)]",    
    60:"[6(1,0)(2,0)(2,2)][4(2,1)(3,1)][3(3,0)(4,0)][7(4,2)(4,1)(5,2)][0(5,1)(6,0)][1(5,3)(5,4)][9(4,6)]",
}

const pieceRE = /\[(\d)(.*?)\]/g
const posRE = /\((\d),(\d)\)/g
const pieceLength = [2,2,3,2,2,3,3,3,3,1];
const DECS  =  [3,3,2,1,0,1,2,3];

// Validate each piece (very simplistic)
for (const key in problems){
    const problem = problems[key];
    let nosPiece = new Set();
    const matches = problem.matchAll(pieceRE);
    for (const m of matches){
        const no = parseInt(m[1]);
        const pos = m[2];
        if (no != "9" && nosPiece.has(no)){
            console.log("*** repeated piece: %d in problem %d",no,key);
            delete problems[key]
        } else if (pos.length != 5 * pieceLength[no] ){
            console.log("*** bad length for piece %d in problem %d",no,key)
        } else {
            nosPiece.add(no)
        }
    }
}

function getArrayPos(is,js){
    const i = parseInt(is);
    return [i,DECS[i]+parseInt(js)]
}

let startStates = {}

// create startStates in the "absolute" coordinates as JSON
// with the following format [noPiece,[i,j], [di,dj]...]
for (const problemNo in problems){
    const problem = problems[problemNo];
    const matches = problem.matchAll(pieceRE);
    let pieceIdijs = []
    for (const m of matches){
        const pieceNo = parseInt(m[1]);
        const ms = [... m[2].matchAll(posRE)];
        const l = ms.length;
        const [i1,j1] = getArrayPos(ms[0][1],ms[0][2])
        let ijs = [pieceNo,[i1,j1]]
        if (l>=2){
            const [i2,j2] = getArrayPos(ms[1][1],ms[1][2])
            ijs.push([i2-i1,j2-j1])
            if (l==3) { 
                const [i2,j2] = getArrayPos(ms[2][1],ms[2][2])
                ijs.push([i2-i1,j2-j1])
            }
        }
        pieceIdijs.push(ijs)
    }
    startStates[problemNo]=JSON.stringify(pieceIdijs)    
}
