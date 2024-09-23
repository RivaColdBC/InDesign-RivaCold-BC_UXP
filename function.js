const { FitOptions, SaveOptions } = require("indesign");
const Font = ["Frutiger LT Std"]
const Style = ["45 Light", "55 Roman", "65 Bold", "75 Black", "95 Ultra Black"]
const dir = "C:\\Proyecto\\InDesign-RivaCold-BC_UXP"
let Doc
module.exports.setConfig = (app, parameter) => {
    //app.documents.everyItem().close(SaveOptions.NO)
    if (app.documents.length > 0) app.documents.firstItem().close(SaveOptions.NO)
    app.updateFonts()
    app.loadSwatches(dir + "/data/indd/Proves components Yang.indd")
    app.documentPreferences.pageHeight = parameter.pageHeight
    app.documentPreferences.pageWidth = parameter.pageWidth
    app.documentPreferences.pagesPerDocument = 1
    app.documentPreferences.startPageNumber = 1
    return Doc = app.documents.add();
}
module.exports.addImagen = (page, data) => {
    const frame = page.textFrames.add()
    doPlace(frame, data)
    doMove(frame, data)
    frame
}

module.exports.addText = (page, data) => {
    const frame = page.textFrames.add({
        contents: data.content,
        geometricBounds: [0, 0, data.size_y, data.size_x],
        strokeWidth: 0,
        parentStory: {
            appliedFont: Font[data.Font || 7],
            fontStyle: Style[data.Style || 7],
            pointSize: data.fontSize || 7,
            justification: data.justification,
            fillColor: data.tfillColor || Doc.swatches.itemByName("r0g0b0 44"),
            fillTint: data.tfillTint || 100,
        },
        fillColor: data.bgfillColor || Doc.swatches.itemByName("r255g255b255"),
        fillTint: data.bgfillTint || 100,
    })
    if (data.vertical) frame.textFramePreferences.verticalJustification = data.vertical
    if (data.rotation) frame.absoluteRotationAngle = data.rotation
    if (data.fit) doFit(frame)
    doMove(frame, data)
    return frame.geometricBounds[2]
}
module.exports.addLine = (page, data) => {
    const line = page.graphicLines.add({
        geometricBounds: [data.y, data.x, data.y, data.x + data.size_x],
        strokeColor: data.tfillColor || Doc.swatches.itemByName("r255g255b255"),
        strokeWeight: 0.5
    });
    doMove(line, data)
    return line
}

module.exports.addTable = (page, data) => {
    const frame = page.textFrames.add({
        geometricBounds: [data.y, data.x, data.y + data.size_y, data.x + data.size_x],
        contents: "",
    });

    const table = frame.parentStory.tables.add({
        bodyRowCount: data.Table.length,
        columnCount: Object.keys(data.Table[0]).length,
        headerRowCount: 1,
    });
    if (data.headfillColor) table.rows.item(0).cells.everyItem().fillColor = data.headfillColor
    if (data.headfillColor) table.rows.item(0).cells.everyItem().texts.everyItem().fillColor = Doc.swatches.itemByName("r255g255b255")
    table.cells.everyItem().texts.item(0).appliedFont = Font[data.Font || 0]
    table.cells.everyItem().texts.item(0).fontStyle = Style[0]
    table.cells.everyItem().texts.item(0).pointSize = 7
    table.cells.everyItem().topEdgeStrokeColor = Doc.swatches.itemByName("None");
    table.cells.everyItem().bottomEdgeStrokeColor = Doc.swatches.itemByName("None");
    table.cells.everyItem().leftEdgeStrokeColor = Doc.swatches.itemByName("None");
    table.cells.everyItem().rightEdgeStrokeColor = Doc.swatches.itemByName("None");

    for (const [index, value] of Object.keys(data.Table[0]).entries()) table.rows.item(0).cells.item(index).contents = value.toString()
    for (const [index, value] of data.Table.entries()) for (const [index2, value2] of Object.keys(value).entries()) table.rows.item(index + 1).cells.item(index2).contents = value[value2].toString()
    const tableHeight = getTableTotalHeight(table);
    const frameHeight = frame.geometricBounds[2] - frame.geometricBounds[0];
    if (tableHeight > frameHeight) {
        const nextPage = page.parent.pages.add();
        const secondFrame = nextPage.textFrames.add({ geometricBounds: [50, 50, 400, 500], contents: "" });
        frame.nextTextFrame = secondFrame;
        return secondFrame.geometricBounds[2];
    }
    return frame.geometricBounds[2]
}

doPlace = (element, data) => {
    element.place(data.content)
    element.fit(FitOptions.FRAME_TO_CONTENT)
}
doMove = (element, data) => {
    element.move([(data.x || 0) - (element.geometricBounds[3] - element.geometricBounds[1]) * (data.geo_x || 0), (data.y || 0) - (element.geometricBounds[2] - element.geometricBounds[0]) * (data.geo_y || 0),])
    if (!data.size_x && data.size_y) element.fit(FitOptions.FRAME_TO_CONTENT)
}
doFit = (element) => element.fit(FitOptions.FRAME_TO_CONTENT)

getTableTotalHeight = (table) => {
    let totalHeight = 0;
    for (let i = 0; i < table.rows.length; i++) totalHeight += table.rows.item(i).height
    return totalHeight;
}

setTableNextFrame = () => { }