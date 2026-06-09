// fix levels names and numbers
const levels =[{"en":"Starter","fr":"Débutant","from":1,"to":12},
               {"en":"Junior","fr":"Junior","from":13,"to":24},
               {"en":"Expert","fr":"Expert","from":25,"to":36},
               {"en":"Master","fr":"Maître","from":37,"to":48},
               {"en":"Wizard","fr":"Génie","from":49,"to":60}];

//  explain the notation
const problems = {

}

// if no state transformation is needed
// export {levels,problems as startStates}

// if some state transformation is needed
export {levels, startStates}
for (const no in problems){
    const problem = problems[no];
    // implement validation rules
}
