// Toads and Frogs https://en.wikipedia.org/wiki/Toads_and_Frogs
//  but this single-player puzzle variation 
//   is known as "Game of pawns" by Edouard Lucas (1883)
//   also "Saute Moutons" http://abrobecker.free.fr/java/SauteMoutons/SauteMoutons.htm
//   number of moves: n*(n+2) https://oeis.org/search?q=A005563&language=english
//   Detailed explanation at https://fr.scribd.com/document/922484730/the-jumping-frogs

// fix levels names and numbers
const levels =[{"en":"Starter","fr":"Débutant","from":1,"to":2},
               {"en":"Junior","fr":"Junior","from":3,"to":3},
               {"en":"Expert","fr":"Expert","from":4,"to":4},
               {"en":"Master","fr":"Maître","from":5,"to":5},
               {"en":"Wizard","fr":"Génie","from":6,"to":6}];


//  T: toad, F:frog
//  build the states by program...
const problems = {}
for (let k=1;k<=6;k++){
    problems[k]=JSON.stringify(Array.from({length:k},_ => "T").concat([null],Array.from({length:k},_ => "F")))
    console.log(k,problems[k])
}

export {levels,problems as startStates}
