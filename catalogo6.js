const { app } = require("indesign");
const datas = require("./json/data.json")
const fUXP = require("./function.js")
const parameter = { pageHeight: 225, pageWidth: 190, startHeight: 30, startWidth: 20, endHeight: 225 - 20, endWidth: 190 - 20, }

createDoc = () => {
    try {
        const Doc = fUXP.setConfig(app, parameter)
        for (const data of datas) {
            const page = createPage(Doc, data)
        }
        console.log(page)
    } catch (error) {
        console.log(error)
    }
}


createPage = (Doc, data) => {
    const page = Doc.pages.add()
    fUXP.addImagen(page, { content: "C:\\Proyecto/InDesign-RivaCold-BC_UXP/assets/catalogo6/bg/border1.png" })
    fUXP.addImagen(page, { content: "C:\\Proyecto/InDesign-RivaCold-BC_UXP/assets/catalogo6/bg/border1.png", x: parameter.pageWidth, geo_x: 1 })
    fUXP.addText(page, { content: data.Label, y: 15 })
    fUXP.addText(page, { content: data.Label, x: parameter.pageWidth, y: 15, geo_x: 1 })
    return page
}


document.getElementById("catalogo6").onclick = createDoc
createDoc()

