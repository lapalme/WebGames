import {Boat} from "./Boat.js"
import {Person} from "./Person.js"

export {levels,startStates}

const levels =[{"en":"Beginner","fr":"Débutant","from":1,"to":10},
               {"en":"Intermediate","fr":"Intermédiaire","from":11,"to":20},
               {"en":"Advanced","fr":"Avancé","from":21,"to":30},
               {"en":"Expert","fr":"Expert","from":31,"to":40}];

//  Numbered problems of the original Smart Games booklet encoded as strings
//  0 is an "interesting" starting problem having a solution in 11 jumps
const problems = {
0:
`--a-c-
---b--
4-d--e
4-←33-
↓---↑f
-1→-2-
`,
1:
`-←1---
a↑-b--
-4--c-
-4----
------
------
`,
2:
`a--↑--
b-24--
c-↓4--
------
------
------
`,
3:
`---a↑-
----3-
-b-2←1
---↓c-
------
------
`,
4:
`-a-b↑-
2---3-
↓---←1
----c-
------
------
`,
5:
`2-←1↑-
↓-a-3-
b-----
------
------
c-----
`,
6:
`←1----
------
------
a↑-b--
-32---
c-↓---
`,
7:
`2←1↑--
↓a-3--
------
------
b-----
-c----
`,
8:
`6----↑
6----4
↓a-b-4
c-----
---d--
------
`,
9:
`6-----
6-----
↓-----
↑a----
4--bc-
4--d--
`,
10:
`←1----
a-----
↑-b---
42-c--
4↓d---
------
`,
11:
`-a←1↑b
2-c-4-
↓-d-4-
------
------
------
`,
12:
`←12---
--↓-a-
b----c
↑d----
4-----
4-----
`,
13:
`↑-a-b-
4--c--
4--←55
---d--
------
------
`,
14:
`↑a←55-
4-b---
4-c---
------
-d----
------
`,
15:
`←55↑--
---4--
---4--
-ab---
------
-cd---
`,
16:
`--a←55
---2--
--b↓c-
-----d
----e-
66→---
`,
17:
`-----6
a--b-6
↑---c↓
4-d---
4-e---
←1----
`,
18:
`←1-a-6
b--c-6
-----↓
-d↑---
--4-e-
--4---
`,
19:
`a---←1
↑--bc-
4-de-6
4----6
-----↓
------
`,
20:
`--a←16
bc-d↑6
----4↓
----4-
------
----e-
`,
21:
`-a---b
6←1--c
6--d↑-
↓e--4-
----4-
------
`,
22:
`←1--↑6
a---46
b-c-4↓
---d--
------
-e----
`,
23:
`6----↑
6----4
↓a-3→4
----b-
-c----
de----
`,
24:
`a←12-b
---↓--
-c←55-
d↑----
-3-e--
------
`,
25:
`-a--b-
---c-2
--d--↓
e↑←55-
-4----
-4----
`,
26:
`------
---a--
-bc-de
2↑----
↓4←55-
-4----
`,
27:
`ab----
------
-----c
↑d-e--
4---←1
4-66→-
`,
28:
`--a←1↑
-----4
b-66→4
----c-
------
d--e--
`,
29:
`----ab
---c-d
←55-2-
↑---↓-
4-----
4---e-
`,
30:
`-a↑-b-
--42--
--4↓--
--←55-
--c---
-de---
`,
31:
`3→--ab
-c--d-
6-----
6-----
↓-----
←55-e-
`,
32:
`44→←55
--ab--
----6-
-cd-6-
---e↓-
f-----
`,
33:
`a--6↑-
---64-
b-c↓4-
-d-e--
--f←55
------
`,
34:
`ab-←55
------
-----c
↑def--
4-----
4-66→-
`,
35:
`←55--a
6↑-b--
64-cd-
↓4----
--ef--
------
`,
36:
`---a←1
b--c↑-
d-6-4-
e-6-4-
--↓---
------
`,
37:
`←1---6
-----6
--↑ab↓
--4--c
d-4--e
------
`,
38:
`-a---6
-bc--6
↑d--e↓
4←1---
4-----
------
`,
39:
`6--2-a
6←1↓bc
↓d----
----e-
------
3→----
`,
40:
`--a-b-
c--d--
←55---
↑6--e-
46-f--
4↓----
`,
41:
`---66→
-----a
--←55↑
b----4
-c---4
d-e-f-
`,
42:
`----a-
↑b-c-d
4----e
43→f--
←55-2-
----↓-
`,
43:
`--←552
abc--↓
-d-e↑-
----4-
-f--4-
3→----
`,
44:
`2-a---
↓--b--
----c↑
d-e--4
-3→--4
f←55--
`,
45:
`a-----
bc-d--
-←1--6
-----6
--e↑f↓
55→3--
`,
46:
`-a-66→
---2-b
←55↓-c
↑--d--
4--e--
4-f-g-
`,
47:
`↑6-a--
46-b--
4↓3→-c
←55-d-
----e-
--fg--
`,
48:
`↑a-bc-
4---d-
46---e
-6-f--
-↓3→--
-g←55-
`
}

// validate problem strings
const M=6,N=6;
for (const no in problems){
    const problem = problems[no].trim().split("\n");
    if (problem.length!=M){
        console.log("Configuration %d: bad number of lines: %d != %d", 
                    no,problem.length,M);
    } else {
        problem.forEach((l,idx)=>{
            if (l.length != N) console.log("Configuration %d: line %d has bad line length: %d!=%d",
                                            no,idx,l.length,N);   
        })
    }
}

// for each direction [rotation,Δi,Δj]
const dir2didj = {"↑":[1,0],"→":[0,-1],"↓":[-1,0],"←":[0,1]}

function problem2state(chars){
    // build a state that will be serialized as a JSON string (used as a key identifier)
    let state = {people:[],boats:[]}
    for (let i=0;i<M;i++){
        for (let j=0;j<N;j++){
            const char = chars[i][j];
            if ("abcdefg".includes(char)){
                const person = new Person(char.toUpperCase(),i,j).toState()
                state.people.push(person);
            } else if (char in dir2didj){
                let boat;
                const [di,dj]=dir2didj[char];
                let i1=i+di,j1=j+dj;
                const id = chars[i1][j1];
                let i2=i1+di,j2=j1+dj;
                if (i2>=0 && i2<M && j2>=0 && j<N && chars[i2][j2]==id){
                    boat = new Boat(id,i,j,char,2).toState();
                } else {
                    boat = new Boat(id,i,j,char,1).toState();
                }
                state.boats.push(boat);
            } else if (!(".-123456".includes(char))){
                console.log("bad char at "+i+"@"+j+":"+chars);
                debugger;
            }
        }
    }
    return JSON.stringify(state)   
}

// create JSON representations of startStates
let startStates = {};

for (const no in problems){
    const problem = problems[no];
    const state=problem2state(problem.split("\n").map(l=>l.split("")))
    startStates[no]=state
}

