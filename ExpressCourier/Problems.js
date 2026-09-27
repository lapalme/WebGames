// en: Express Courier: https://www.smartgames.eu/uk/one-player-games/express-courier
// fr: Panique Logistique: https://www.smartgames.eu/fr/jeux-pour-1-joueur/panique-logique

// fix levels names and numbers
const levels =[{"en":"Starter","fr":"Débutant","from":1,"to":16},
               {"en":"Junior","fr":"Junior","from":17,"to":32},
               {"en":"Expert","fr":"Expert","from":33,"to":48},
               {"en":"Master","fr":"Maître","from":49,"to":64},
               {"en":"Wizard","fr":"Génie","from":65,"to":80}];

//  [nb of expected moves, pieces]
//  piece = color,direction,i,j,box-color?
//  color = r(ed), o(range), y(ellow), g(green), a(qua), b(lue), p(urple)
const validRE = /[roygabp][nesw][0-3][0-4][roygabp]?/
const problems = {
    1:[7,"yn00","gw01","bw03r","rs33"],
    2:[8,"gw12r","yn22","bw23","rw33"],
    3:[10,"bn01g","yn03","rn22","gs33"],
    4:[14,"bn02","gw13r","rw32"],
   13:[13,"gn02","rs10","bw13r","yn21","an24","pw32"],
   21:[26,"gw00r","bn02","yw13","rs30","an21","ow32","pn24"],
   25:[25,"bw01","yw03","pn12g","aw13","gw30r","rw32"],
   40:[33,"yn00","an01","on04g","bw12","rn22","pw23","gw33r"],
   60:[85,"pw01a","rs10g","ye12b","bs13r","gn22y","ow23","aw33"],
   80:[116,"aw00","pw02r","on04b","ge11","be13","rn22g","yw30y"] 
}

function validateProblems(){
    for (const no in problems){
        const problem = problems[no];
        if (!Array.isArray(problem)){
            console.log("*** Problem ",no,": should be an array")
            continue;
        }
        if ((typeof problem[0] !== 'number')){
            console.log("*** Problem ",no,"first element should be a number")
            continue
        }
        const colors= new Set()
        for (let k=1;k<problem.length;k++){
            if (typeof problem[k] !== "string" || !validRE.test(problem[k])){
                console.log("*** Problem",no,"element",k,"is not valid")
                continue
            }
            const color=problem[k].charAt(0);
            if (colors.has(color)){
                console.log("*** Problem",no,"repeated color",color)
            } else {
                colors.add(color)
            }
        }
    }
    console.log("End of problem validation")
}

validateProblems()

export {levels, startStates}

const startStates={}
for (const no in problems){
    const problem = problems[no];
    startStates[no]=JSON.stringify(problem)
}
