const { app, Justification, VerticalJustification } = require("indesign");
const datas = require("./json/data.json")
const fUXP = require("./function.js")
const parameter = { pageHeight: 225, pageWidth: 190, startHeight: 30, startWidth: 20, endHeight: 225 - 20, endWidth: 190 - 20, Width: 143 }
const Doc = fUXP.setConfig(app, parameter)
fUXP.addText(Doc.pages.lastItem(), { content: "FIRST PAGE, DO NOT USE IT FOR NOTHING", size_x: 100, size_y: 100 })
let page, invPar, pageStatus

console.clear()
createDoc = () => {
    for (const [index, data] of datas.entries()) {
        createPage(data)
        pageStatus.height = fUXP.addText(page, { content: data.Label, x: invPar.x + invPar.signe * pageStatus.width, geo_x: invPar.geo_x, y: pageStatus.height, size_x: parameter.Width, size_y: 10, justification: invPar.justification, fontSize: 7.5, Style: 1, tfillColor: Doc.swatches.itemByName("rivacold nou"), fit: true, padding: 2 })
        pageStatus.height = fUXP.addText(page, { content: data.Title, x: invPar.x + invPar.signe * pageStatus.width, geo_x: invPar.geo_x, y: pageStatus.height, size_x: parameter.Width, size_y: 10, justification: invPar.justification, fontSize: 7.5, Style: 1, tfillColor: Doc.swatches.itemByName("C=92 M=97 Y=100 K=21"), fit: true, padding: 2 })
        pageStatus.height = fUXP.addText(page, { content: data.Descripcion, x: invPar.x + invPar.signe * pageStatus.width, geo_x: invPar.geo_x, y: pageStatus.height, size_x: parameter.Width, size_y: 10, justification: invPar.justification, fontSize: 7, Style: 1, tfillColor: Doc.swatches.itemByName("C=92 M=97 Y=100 K=21"), fit: true, padding: 2 })
        if (data.Table.length > 0) pageStatus.height = checkTableHeight(pageStatus.height, data.Table, data)
        console.log(index)
    }
}

invert = (v) => { return { x: v ? 0 : parameter.pageWidth * 2, geo_x: v ? 0 : 1, signe: v ? 1 : -1, justification: v ? Justification.LEFT_ALIGN : Justification.RIGHT_ALIGN } }

createPage = (data) => {
    page = Doc.pages.add()
    invPar = invert(page.index === 0)
    pageStatus = { height: parameter.startHeight, width: parameter.startWidth }
    fUXP.addImagen(page, { content: "C:\\Proyecto/InDesign-RivaCold-BC_UXP/assets/catalogo6/bg/" + (page.index === 0 ? "encabezado izquierda.jpg" : "encabezado derecha.jpg"), x: invPar.x, geo_x: invPar.geo_x })
    fUXP.addText(page, { content: data.Label, x: invPar.x, y: 15, geo_x: invPar.geo_x, size_x: 18, size_y: 18, justification: Justification.CENTER_ALIGN, vertical: VerticalJustification.CENTER_ALIGN, fontSize: 7.5, Style: 2, tfillColor: Doc.swatches.itemByName("r255g255b255"), bgfillColor: Doc.swatches.itemByName("rivacold nou") })
    fUXP.addText(page, { content: data.Label, x: invPar.x + invPar.signe * 5, y: 105, geo_x: invPar.geo_x, size_x: 70, size_y: 8, rotation: 90, justification: Justification.RIGHT_ALIGN, vertical: VerticalJustification.CENTER_ALIGN, vertical: VerticalJustification.CENTER_ALIGN, fontSize: 11, Style: 3, tfillColor: Doc.swatches.itemByName("c0m0y0k68") })
    fUXP.addText(page, { content: page.properties.name, x: invPar.x, y: parameter.pageHeight, geo_y: 1, geo_x: invPar.geo_x, size_x: 18, size_y: 10, justification: Justification.CENTER_ALIGN, fontSize: 9, Style: 1, tfillColor: Doc.swatches.itemByName("r255g255b255"), bgfillColor: Doc.swatches.itemByName("C=92 M=62 Y=27 K=58"), vertical: VerticalJustification.CENTER_ALIGN, })
    fUXP.addText(page, { content: "PRECIOS VÁLIDOS EN LA PENÍNSULA DESDE ABRIL DE 2025", x: invPar.x + invPar.signe * 22, y: parameter.pageHeight, geo_y: 1, geo_x: invPar.geo_x, size_x: 146, size_y: 9.5, justification: invPar.justification, fontSize: 7, Style: 1, tfillColor: Doc.swatches.itemByName("c0m0y0k68") })
    fUXP.addLine(page, { x: invPar.x + invPar.signe * 22, y: parameter.pageHeight - 10, geo_y: 1, geo_x: invPar.geo_x, size_x: 146, tfillColor: Doc.swatches.itemByName("c0m0y0k68") })
    fUXP.addLine(page, { x: invPar.x + invPar.signe * 22, y: parameter.pageHeight - 7.25, geo_y: 1, geo_x: invPar.geo_x, size_x: 146, tfillColor: Doc.swatches.itemByName("c0m0y0k68") })
    fUXP.addText(page, { content: "www.e-bcsystems.com", x: invPar.x + invPar.signe * 5, y: 210, geo_x: invPar.geo_x, size_x: 110, size_y: 10, rotation: 90, vertical: VerticalJustification.CENTER_ALIGN, fontSize: 21, Style: 1, tfillColor: Doc.swatches.itemByName("rivacold nou"), fillTint: 30 })
}

checkTableHeight = (Height, Table, data) => {
    if (parameter.endHeight - Height > 6 + 4.5 * Table.length)
        return fUXP.addTable(page, { Table: Table, x: invPar.x + invPar.signe * pageStatus.width, geo_x: invPar.geo_x, y: pageStatus.height, size_x: parameter.Width, size_y: parameter.endHeight - Height })
    else {
        const len = Math.round((parameter.endHeight - Height - 6) / 4.5)
        fUXP.addTable(page, { Table: Table.slice(0, len), x: invPar.x + invPar.signe * pageStatus.width, geo_x: invPar.geo_x, y: pageStatus.height, size_x: parameter.Width, size_y: parameter.endHeight - Height })
        createPage(data)
        return checkTableHeight(parameter.startHeight, Table.slice(len, Table.length - 1), data)
    }
}

document.getElementById("catalogo6").onclick = createDoc
createDoc()

