'strict use'
const uxp = require('uxp');
let { app } = require("indesign");

const openDialogBtn = document.getElementById("openDialogBtn");

openDialogBtn.onclick = showDialog;
function showDialog() {
    let myDocument = app.documents.add();
    let myTextFrame = myDocument.pages.item(0).textFrames.add();
    myTextFrame.geometricBounds = ["6p", "6p", "24p", "24p"];
    myTextFrame.contents = "Hello World!";
}
