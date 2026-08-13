//  Bend-It by Raf Peeters 
//   https://www.smartgamesandpuzzles.com/bend-it.html
//  but is not available anymore

// fix levels names and numbers
const levels =[{"en":"Starter","fr":"Débutant","from":1,"to":12},
               {"en":"Junior","fr":"Junior","from":13,"to":24},
               {"en":"Expert","fr":"Expert","from":25,"to":36},
               {"en":"Master","fr":"Maître","from":37,"to":48},
               {"en":"Wizard","fr":"Génie","from":49,"to":60}];

//  The six lines of the goal (from top to bottom) where x: black, .: white
// model 
//    NN:["","","","","",""],
const problems = {
     1:[".xxx..",".xxxxx","....xx","xx..x.",".x....","xxxxx."],
     2:[".xxx..",".xx..x","x..x.x","x....x","xx...x",".xxxxx"],
    12:["...x..","xxxxxx","xxxxxx","....xx","..x...",".xxx.."],
    13:["x..xxx","..xx..","x...xx","..xxx.","...xxx","xx..xx"],
    25:["x...xx","x...xx","x.xxx.","x...x.","x.xxxx","x...x."],
    36:[".xxxxx","..x...","xxx...","xxx...","..xxxx","xxx..."],
    37:["..xxx.","x..xx.","..xx.x","x.xx.x","x.xx.x","x.x..."],
    38:[".x...x","....xx","..xx..","xxxx..","xxxxxx",".x..xx"],
    39:["xxxx..",".xxx..",".xxx..",".x..xx","....xx","xx..xx"],
    40:["x..xxx","...xxx","...xxx","x.....","xxxxx.","x..xx."],
    41:["..xx..","xxxx..",".x.xx.",".x.x.x","xx.xxx","x..x.."],
    42:["x....x","xxx..x","..x..x","x..xxx","xxx.xx","....xx"],
    43:["x..xxx","xxx.xx","....xx","x....x","xxx..x","..x..x"],
    44:["..xxx.","xxx...",".x..x.",".xx.xx","xx..xx","x...xx"],
    52:["x..xxx","xx..xx","..xx..","......","x.x..x","xxxxxx"],
    60:[".xxx.x",".....x","xx.xxx","xx....","xxx.xx","....xx"],
}

// if no state transformation is needed
// export {levels,problems as startStates}

const validRE = /^[x.]{6}$/
// if some state transformation is needed
export {levels, startStates,pieces_segments}
let startStates = {}

// segments as in the booklet
// the "pivots" are the first and last positions of the middle segments
// followed by the initial i,j (outside of the board, j>6)
// all positions are relative to the first cell of the middle segment
let pieces_segments = [
    ["orange","B","WW","BBB", 0,15],
    ["blue",  "B","BB","WWW", 1,15],
    ["red",   "B","WWW","BB", 2,15],
    ["green", "W","BBB","WW", 3,15],
    ["yellow","BB","WW","BB", 4,16],
    ["purple","WW","BB","WW", 5,16]
]

// create segments from pieces_segments at vertical relative positions 
//    each segment is of the form [angle in degrees, list of ball positions]
//    a ball is [color (x or .), di,dj] relative to the global i,j
// left segment: <-0, middle: 0->, right: 0--> 
// initially all pieces are horizontal as in the booklet at the right of the board 
// this will the center of rotation and flipping
// for left and right, dir correspond to the orientation of the corresponding pivot
// for middle, this is the direction of the whole piece
function initSegments(id,[color,left,middle,right,i,j]){
    let s1=[0],s2=[0],s3=[0];
    let l=left.length;
    for (let k=0;k<l;k++)
        s1.push([left.charAt(k),0,-(l-k)])
    let m=middle.length;    
    for (let k=0;k<m;k++)
        s2.push([middle.charAt(k),0,k])
    let r=right.length;
    for (let k=0;k<r;k++)
        s3.push([right.charAt(k),0,m+k])
    return [id,i,j,color,"-",[s2,s1,s3]]
}


for (const no in problems){
    const problem = problems[no];
    if (problem.length != 6){
        console.log("*** Problem %d: should have 6 elements, but has ",no,problem.length)
        continue;
    }
    let nbBlack=0
    for (let i=0;i<6;i++){
        let s = problem[i]
        if (!validRE.exec(s)){
            console.log("*** Problem %d: bad config at position %d",no,i)
            break;
        }
        let s1=[]
        for (let j=0;j<6;j++){
            if (s.charAt(j)=="x"){
                nbBlack++;
                s1+="B"
            } else 
                s1+="W"
        }
        problem[i]=s1
    }
    if (nbBlack!=19){
        console.log("*** Problem %d: number of black pieces should be 19, not ",no,nbBlack)
        break;
    }
    // set initially all pieces outside of the grid at -1,-1
    startStates[no]=JSON.stringify({
        "goal":problems[no],
        "pieces":pieces_segments.map((v,id)=>initSegments(id,v))
    })
}

// a state id defined by [angle,i,j of its three segments]
// in the order of pieces segments

// for (let no in startStates){
//     console.log(no)
//     console.log(startStates[no])
// }
