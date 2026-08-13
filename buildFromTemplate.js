// create a new directory from the Template replacing XXX by NEW
import {readFileSync,writeFileSync,mkdirSync} from "fs";

const NEW = "ToadsNFrogs"
const fileNames = ["Explanation.html","Problems.js","XXX_batch.js","XXX_Board.js","XXX_Display.js",
                   "XXX_Jump.js","XXX_main.js","XXX_Piece.js","XXX.html"]

mkdirSync(NEW)
for (const fileName of fileNames){
    let content = readFileSync(`Template/${fileName}`,{"encoding":"utf-8"})
    content = content.replaceAll("XXX",NEW)
    writeFileSync(`${NEW}/${fileName.replace("XXX",NEW)}`,content)
}
console.log("%s created ! Have fun",NEW)

 