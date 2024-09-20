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
    return frame
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
    table.cells.everyItem().texts.item(0).appliedFont = Font[data.Font || 0]
    table.cells.everyItem().texts.item(0).fontStyle = Style[0]
    table.cells.everyItem().texts.item(0).pointSize = 7
    for (const [index, value] of Object.keys(data.Table[0]).entries()) table.rows.item(0).cells.item(index).contents = value.toString()
    for (const [index, value] of data.Table.entries()) {
        for (const [index2, value2] of Object.keys(value).entries()) {
            table.rows.item(index + 1).cells.item(index2).contents = value[value2].toString()
        }
    }
    return frame.geometricBounds[2]

}

doPlace = (frame, data) => {
    frame.place(data.content)
    frame.fit(FitOptions.FRAME_TO_CONTENT)
}
doMove = (frame, data) => {
    frame.move([(data.x || 0) - (frame.geometricBounds[3] - frame.geometricBounds[1]) * (data.geo_x || 0), (data.y || 0) - (frame.geometricBounds[2] - frame.geometricBounds[0]) * (data.geo_y || 0),])
    if (!data.size_x && data.size_y) frame.fit(FitOptions.FRAME_TO_CONTENT)
}
doFit = (frame) => frame.fit(FitOptions.FRAME_TO_CONTENT)