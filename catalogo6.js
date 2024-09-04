'strict use'
const { app } = require("indesign");
const datas = require("./json/data.json")

document.getElementById("catalogo6").onclick = createPage

async function createPage() {

    //Document setting
    app.documentPreferences.pageHeight = '225mm'
    app.documentPreferences.pageWidth = '190mm'
    app.documentPreferences.pagesPerDocument = 1
    app.documentPreferences.startPageNumber = 1
    app.documentPreferences.facingPages = true
    const myDocument = app.documents.add();

    //First page setting for not use
    const myTextFrame = myDocument.pages.item(0).textFrames.add();
    myTextFrame.geometricBounds = ["20mm", "20mm", "40mm", "140mm"];
    myTextFrame.contents = "FIRST PAGE, DO NOT USE IT FOR NOTHING";
    
    for (const data of datas) {
        const page = myDocument.pages.add()
    
    }

}

