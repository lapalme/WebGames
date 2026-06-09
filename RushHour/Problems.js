export {levels,problems as startStates}

const levels =[{"en":"Beginner","fr":"Débutant","from":1,"to":10},
               {"en":"Intermediate","fr":"Intermédiaire","from":11,"to":20},
               {"en":"Advanced","fr":"Avancé","from":21,"to":30},
               {"en":"Expert","fr":"Expert","from":31,"to":40}];

// H:horizontal, V: vertical, C: Horizontal chosen to remove, piece identifier, i,j of head of tile
const problems = {
    1:  "VA32 VB45 VO00 VP04 HQ33 HR52 CX21",
    // 2:  "CX23 CZ20 VA01", // for easy testing for two tiles 
    11: "VA02 HB03 VC05 HD13 VE25 HF30 VG33 VH41 VO00 VP24 HQ53 CY21",
    12: "HA04 VB30 VC32 HD33 VO03 VP15 HQ50 CY20",
    13: "VA01 HB04 HC14 VD30 HE41 VF43 HG54 VO02 VP25 HQ31 CX23 CZ20",// two tiles
    21: "VA02 HB03 VC05 VD13 VE14 VF25 HG31 HH33 VI41 HJ44 HK54 VO30 CY20",  
    31: "VA01 VB05 HC12 VD25 HE30 VF32 VO00 HP02 VQ14 HR43 HY51 CX21",
    32: "VA12 HB13 HC31 HD44 HO02 VQ23 VP05 VR30 CX20 HY53",
    33: "VA01 VB13 HC32 VD42 HE43 HF50 HG54 VO00 HP02 VQ14 VR25 CX21"
}

// crude validation
// TODO: check for tile overlapping...
const problemRE = /[HV][A-KO-RY][0-5][0-5]|C[XYZ]2[0-5]/

for (const key in problems){
    const problem = problems[key];
    const tiles = problem.split(" ");
    for (const tile of tiles){
        if (!problemRE.test(tile)){
            console.log("*** Problem %d: illegal tile: %s",key,tile);
            delete problems[key];
        }
        else 
            problems[key] = tiles.sort().join(" ")
    }
}
