// English: https://www.smartgames.eu/uk/one-player-games/grizzly-gears
// French: https://www.smartgames.eu/fr/jeux-pour-1-joueur/parc’ours-en-forêt
// Rationale: https://www.smartgamesandpuzzles.com/grizzlygears.html

const levels =[{"en":"Starter","fr":"Débutant","from":1,"to":16},
               {"en":"Junior","fr":"Junior","from":17,"to":40},
               {"en":"Expert","fr":"Expert","from":41,"to":60},
               {"en":"Master","fr":"Maître","from":61,"to":80}];

// sides = for a given ori show what is at position 0..3
// positions  (noted by n)
//       0
//     3 . 1
//       2
// false: concave, true: convex
// this is used for checking that a boat is placed in a concave position 

const sides = {"G":[[false,true,false,true],
                    [true,false,true,false],
                    [false,true,false,true],
                    [true,false,true,false]],
               "H":[[false,true,true,false],
                    [false,false,true,true],
                    [true,false,false,true],
                    [true,true,false,false]]
               }

// for the disks in three strings for each line
//   H: pointed  with ↗︎, ↘︎, ↙︎, ↖︎
//   G: strip with - or |
// for the piece: [letter,i,j,ori] 0<=i<4, 0<=j<4, ori = - or |
//   
// "A": "pink",  // girl
// "B": "orange", // beaver
// "C": "lightskyblue",  // lumberjack
// "D": "tan",   // goat
// "E": "brown", // bear
// "F": "silver"  // hare

/* template for configurations
   NN:["","","",[[i,j,"l",n]]],
*/

const problems = {
     1:["↘︎-↙︎","||↖︎","↗︎↖︎↖︎",[[1,0,"e",3]]],
     2:["↘︎-↙︎","-|↙︎","↗︎↗︎↖︎",[[0,1,"b",0]]],
     7:["↗︎↗︎-","↗︎-↖︎","↗︎↗︎-",[[2,2,"b",2]]],
    15:["↗︎↘︎|","↗︎↘︎-","↗︎↙︎|",[[2,2,"c",1]]],
    17:["↖︎|↗︎","↗︎-↖︎","↗︎|↖︎",[[0,0,"b",3],[0,2,"e",1]]],
    21:["↘︎↘︎-","-↙︎↙︎","↙︎|↗︎",[[2,0,"c",3],[2,2,"d",1]]],
    27:["|-↙︎","↖︎↖︎↙︎","↗︎-↙︎",[[2,1,"e",2],[2,2,"a",2]]],
    35:["-↖︎|","↗︎↗︎↗︎","-↖︎↖︎",[[0,0,"c",0],[0,2,"b",1],[2,0,"d",2]]],
    39:["↖︎↙︎|","↖︎|-","↖︎↖︎↖︎",[[0,0,"a",3],[1,0,"c",3],[2,0,"b",3]]],
    41:["||↙︎","-↖︎↖︎","↙︎↖︎↖︎",[[0,0,"a",1],[0,1,"c",1],[2,0,"d",2]]],
    47:["|-↙︎","↗︎↘︎↗︎","-↖︎↖︎",[[0,2,"d",2],[1,1,"e",2],[2,0,"a",2]]],
    57:["↗︎-↙︎","↗︎↗︎-","↗︎-↖︎",[[0,2,"b",2],[1,2,"a",2],[2,1,"e",2]]],
    67:["|↙︎|","↗︎|↖︎","↗︎↗︎↗︎",[[0,1,"a",3],[1,1,"d",1],[2,2,"c",1]]],
    69:["↘︎-↙︎","↘︎↘︎-","-↖︎↙︎",[[0,1,"c",0],[1,2,"f",0],[2,1,"d",0]]],
    73:["↘︎-|","↘︎↗︎↖︎","|↗︎↗︎",[[0,2,"f",1],[1,1,"c",1],[2,2,"d",1]]],
    80:["|-↙︎","↗︎↗︎-","↖︎↖︎↖︎",[[0,1,"a",0],[1,1,"b",0],[1,2,"e",0],[2,2,"f",0]]],
}

// state has the following info (ori in degrees from the original ↖︎)
// {disks: [[i,j,"G"|"H",ori],...], boats:[[i,j,letter,ori]],...]}

export {levels, startStates,sides}
const arrow2rot = {"↖︎":0,"↗︎":1,"↘︎":2,"↙︎":3}
const rot2arrow = {0:"↖︎",1:"↗︎",2:"↘︎",3:"↙︎"}

let startStates={}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter/segment
// needed to take into account characters with diagonal arrows which are mot than one byte long
const segmenter = new Intl.Segmenter("en-US", { granularity: "grapheme" });

for (const no in problems){
    const problem = problems[no];
    if (problem.length !=4){
        console.log("*** Problem %d: length should be 4, but %d found",no,problem.length)
        continue;
    }
    let disks = [];
    let nbG=0,nbH=0;
    for (let i=0;i<3;i++){
        const line = [...segmenter.segment(problem[i])];
        if (line.length != 3){
            console.log("*** Problem %d, line %d: length should be 3 but %d found",no,i,line.length)
            continue;
        }
        for (let j=0;j<3;j++){
            const c = line[j].segment
            if (! "↖︎↗︎↘︎↙︎-|".includes(c)){
                console.log("*** Problem %d, line %d, pos %d: bad char: %s",no,i,j,c)
                continue;
            }
            if (c == "-"){
                 disks.push([i,j,"G",0]);
                 nbG++;
            } else if (c == "|"){
                disks.push([i,j,"G",1])
                nbG++;
            } else {
                disks.push([i,j,"H",arrow2rot[c]])
                nbH++;
            }
        }
    }
    if (nbG!=3 || nbH!=6){
        console.log("*** Problem %d: bad number of disks: %d,%d should be 3,6",no,nbG,nbH)
    }
    let boats = [];
    for (let [i,j,id,ori] of problem[3]){
        if (i<0 || i>=4 || j<0 || j>=4){
            console.log("*** Problem %d: bad position of boat",no,i,j,st);
            continue
        }
        if (!"abcdefxy".includes(id)){
            console.log("*** Problem %d: %s bad boat id at %d,%d ",no,id,i,j);
            continue
        }
        if (![0,1,2,3].includes(ori)){
            console.log("*** Problem %d: %d bad orientation for boat %s at %d,%d", no,ori,id,i,j)
            continue
        }
        const [d_i,d_j,d_id,d_ori] = disks[i*3+j]
        const d_sides = sides[d_id][d_ori];  
        if (d_sides[ori]){
            console.log("*** Problem %d, pos %d,%d: overlap for boat %s,%d",no,i,j,id,ori)
            continue;
        }
        boats.push([i,j,id,ori])
    }
    startStates[no] = JSON.stringify({disks:disks,boats:boats})
    // console.log(no, startStates[no])
}
