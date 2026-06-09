//  Graveyard Shift
//   design rationale: https://www.smartgamesandpuzzles.com/graveyard-shift.html
//   English: https://www.smartgames.eu/uk/one-player-games/graveyard-shift
//   French: https://www.smartgames.eu/fr/jeux-pour-1-joueur/tombe-frayeur
//
// fix levels names and numbers
const levels =[{"en":"Starter","fr":"Débutant","from":1,"to":16},
               {"en":"Junior","fr":"Junior","from":17,"to":32},
               {"en":"Expert","fr":"Expert","from":33,"to":48},
               {"en":"Master","fr":"Maître","from":49,"to":64},
               {"en":"Wizard","fr":"Génie","from":65,"to":80}];

/* model configuration for encoding problems
   NN : [".  .  .  .  ",
         ".  .  .  .  ",
         ".  .  .  .  "],
*/

// problems are coded in 3x4 square
// using the letters [a-h] possibly followed by direction n,e,s,o (see last page of booklet)
// uppercase for letters are also allowed
// assuming the piece is North when the letter can be read directly
// each position is separated by a space (but that is not mandatory)
// i is a "tomb"
// . is empty

const problems = {
    1 : ["i  cs i  .  ",
         ".  .  .  .  ",
         ".  an i  .  "],
    2 : [".  i  .  .  ",
         ".  i  cs i  ",
         ".  .  .  aw "],
    3 : [".  i  .  hw ",
         ".  ae .  i  ",
         ".  .  i  .  "],
    4 : ["ae .  hw ew  ",
         "i  .  i  .  ",
         ".  .  i  .  "],
   13 : ["i  .  dw  .  ",
         ".  an i  cn  ",
         ".  .  .  i  "],
   14 : ["as i  es cw  ",
         ".  .  .  i  ",
         ".  .  i  .  "],
   20 : ["as  i  .  .  ",
         ".  .  dw  .  ",
         "i fn  hn  i  "],
   21 : ["as i  .  .  ",
         ".  hw .  .  ",
         "cn ew i  i  "],
   25 : ["I  hs es gw ",
         ".  .  .  i  ",
         "bn  i  An  . "],
   26 : ["cs  es .  hs",
         ".  .  i  .  ",
         "i an  .  i "],
   27 : ["hs i  .  .  ",
         ".  .  Cw  i  ",
         "An i  .  .  "],
   28 : ["cs fs bw dw ",
         ".  .  i  .  ",
         ".  An i  en "],
   33 : ["ds es fw  .  ",
         ".  gs i  i  ",
         "an .  i  .  "],
   37 : [".  i  hs es  ",
         "ae .  .  cw ",
         "i  .  dn i  "],
   38 : [".  .  i  .  ",
         "i  i  .  hw ",
         "ae  . bw ew "],
   39 : [".  i  hs es  ",
         "i  ae .  cw  ",
         "de  .  .  i  "],
   40 : ["i  gs cw be",
         ".  .  i  hn  ",
         "i  an fe  .  "],
   48 : ["es cs .  .  ",
         "de .  i  i  ",
         "he be .  aw "],
   53 : [".  i  ge he  ",
         ".  i  ce bs ",
         "i  ae .  .  "],
   54 : ["as fe be ds",
         "gs i  es cw",
         ".  .  .  hw "],
   55 : [".  .  i  hs  ",
         "ae .  .  fw ",
         "i  i  Cn ew  "],
   56 : [".  .  .  gw  ",
         "i  i  hs bn",
         "ae .  dw i" ],
   57 : ["i  hs i  gs",
         "ae .  .  .  ",
         "i  bn dn cn"],
   61 : ["ee be ge he ",
         "i  cn .  i  ",
         "de .  .  aw  "],
   65 : [".  i  gs bw  ",
         "i  i  .  aw ",
         "he .  cn dw "],
   66 : [".  i  ae fs",
         "i  .  gw dw",
         "i  en bn hn"],
   67 : ["i  fe .  be",
         ".  i  ae en",
         ".  i  .  gw"],
   68 : ["bw .  ds hw",
         "i  an .  gw",
         ".  i  fn i "],
   69 : ["i  as i  cs",
         ".  .  .  dw ",
         "fn gn bn i"],
   80 : [".  i  ds  cw  ",
         "i  ge  .  hw ",
         "I  be  fn  aw "],
}

const validRE = /[a-h][nesw]|i|\./gi
const letter2ori = {"n":"↑","e":"→","s":"↓","w":"←"}

// if some state transformation is needed
export {levels, startStates}
let startStates= {}
for (const no in problems){
    const problem = problems[no];
    let pieces = []
    let letters = new Set()
    if (problem.length != 3){
        console.log("*** Problem %d: problem should have three lines, but %d found.",no,problem.length);
        continue
    }
    for (let i=0;i<3;i++){
        let matches = [...problem[i].matchAll(validRE)]
        if (matches.length != 4){
            console.log("*** Problem %d, line %d: should have 4 elements, but %d found",no,i,matches.length);
            continue
        }
        for (let j=0;j<4;j++){
            const m = matches[j][0]
            if (m==".")continue;
            if (m=="i"|| m=="I"){
                pieces.push(["I",i,j,"↑"])
                letters.add("I")
            } else {
                const letter = m.charAt(0).toUpperCase();
                if (letters.has(letter)){
                    console.log("*** Problem %d: repeated %s",no,letter)
                } else
                    letters.add(letter);
                pieces.push([letter,i,j,letter2ori[m.charAt(1)]])
            }
        }
    }
    if (!letters.has("A"))
        console.log("*** Problem %d: missing A",no)
    startStates[no] = JSON.stringify(pieces)
    // console.log(no,startStates[no])
}
