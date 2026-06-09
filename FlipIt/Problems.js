export {levels,problems as startStates}

const levels =[{"en":"Beginner","fr":"Débutant","from":1,"to":10},
               {"en":"Intermediate","fr":"Intermédiaire","from":11,"to":20},
               {"en":"Advanced","fr":"Avancé","from":21,"to":30},
               {"en":"Expert","fr":"Expert","from":31,"to":40}];

const problems = {
      1:"ABH",
      2:"ABF",
      3:"FGJ",
      4:"ABFG",
      5:"ABCGK",
      6:"ABCEG",
      7:"BCFJN",
      8:"BCEHJK",
      9:"ABCENP",
      10:"IJN",
      
      11:"ABCF",
      12:"ABFJK",
      13:"ABCFGIK",
      14:"ABCEI",
      15:"BEFKLO",
      16:"BFGHIJKO",
      17:"BEFGJKLO",
      18:"ABCEGJLNOP",
      19:"ABFGKLP",
      20:"ABDFNP",
      
      21:"ABCEFGIJK",
      22:"BCFGNO",
      23:"BCEFGHIJKLNO",
      24:"ABDEFHMNP",
      25:"BCEFHIKLNO",
      26:"ABCEFGIJKLO",
      27:"ACHKM",
      28:"ABCEGHIKLNO",
      29:"ABGM",
      30:"ADFGJKMP",
      
      31:"ABCDFGJKMNOP",
      32:"ABFGHIJP",
      33:"ABCEGHIJKLNO",
      34:"ABEFGHJN",
      35:"ACHLMO",
      36:"ABCDELMNOP",
      37:"ABCEGIJKLO",
      38:"ABCDEFHIKLMNOP",
      39:"ABCFHIJKLNP",
      40:"ABCDEFGHIJLMNOP"
   }


// validate problems and convert them to start states (here nothing to do)
const validRE= /^[A-P]{3,15}$/
for (const key in problems){
   const problem = problems[key];
   if (!validRE.exec(problem)){
      console.log("*** problem %d: bad letter in problem",key,problem)
      delete problems[key];
   }
   if (new Set(problem.split("")).size != problem.length){
      console.log("*** problem %d: repeated letters ",key,problem);
      delete problems[key];
   }
}

