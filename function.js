const { FitOptions, SaveOptions, Justification, VerticalJustification } = require("indesign");
const Font = ["Frutiger LT Std"]
const Style = ["45 Light", "55 Roman", "65 Bold", "75 Black", "95 Ultra Black"]
const dir = "C:\\Proyecto\\InDesign-RivaCold-BC_UXP"
let Doc
const TableParameter = [
    { Name: "Model", Width: 22, fontStyle: Style[3] },
    { Name: "€uros", fillColor: "C=98 M=55 Y=55 K=5", fontStyle: Style[3], Width: 21 },
    { Name: "Code", Width: 24 },
    { Name: "RPM", Width: 12 },
    { Name: "Current", Width: 12 },
    { Name: "Power", Width: 12 },
    { Name: "Connections", Width: 22 },
]

module.exports.setConfig = (app, parameter) => {
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
        geometricBounds: [0, 0, data.size_y || 50, data.size_x || 50],
        strokeWidth: 0,
        parentStory: {
            appliedFont: Font[data.Font || 0],
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
    return frame.geometricBounds[2] + data.padding || 0
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
    table.cells.everyItem().height = data.bodyHeight || 4.5
    table.cells.everyItem().texts.everyItem().appliedFont = Font[data.Font || 0]
    table.cells.everyItem().texts.everyItem().fontStyle = Style[0]
    table.cells.everyItem().texts.everyItem().pointSize = 6.5
    table.cells.everyItem().topEdgeStrokeColor = Doc.swatches.itemByName("None");
    table.cells.everyItem().bottomEdgeStrokeColor = Doc.swatches.itemByName("None");
    table.cells.everyItem().leftEdgeStrokeColor = Doc.swatches.itemByName("None");
    table.cells.everyItem().rightEdgeStrokeColor = Doc.swatches.itemByName("None");
    table.cells.everyItem().texts.everyItem().justification = Justification.CENTER_ALIGN
    table.cells.everyItem().verticalJustification = VerticalJustification.CENTER_ALIGN
    for (let i = 0; i < table.rows.length; i++) if (i % 2 === 0) {
        table.rows.item(i).cells.everyItem().fillColor = Doc.swatches.itemByName("rivacold nou")
        table.rows.item(i).cells.everyItem().fillTint = 11
    }

    for (const TParam of TableParameter) {
        const index = Object.keys(data.Table[0]).findIndex((a) => a === TParam.Name)
        if (index > -1) {
            if (TParam.Width) table.columns.item(index).width = TParam.Width
            if (TParam.fontStyle) table.columns.item(index).cells.everyItem().texts.everyItem().fontStyle = TParam.fontStyle
            if (TParam.fillColor) table.columns.item(index).cells.everyItem().texts.everyItem().fillColor = Doc.swatches.itemByName(TParam.fillColor)
        }
    }

    table.rows.item(0).cells.everyItem().height = data.headHeight || 6
    table.rows.item(0).cells.everyItem().fillColor = Doc.swatches.itemByName("rivacold nou")
    table.rows.item(0).cells.everyItem().fillTint = 100
    table.rows.item(0).cells.everyItem().texts.everyItem().fillColor = Doc.swatches.itemByName("r255g255b255")
    table.rows.item(0).cells.everyItem().texts.everyItem().pointSize = 6
    table.rows.item(0).cells.everyItem().texts.everyItem().fontStyle = Style[2]

    for (const [index, value] of Object.keys(data.Table[0]).entries()) table.rows.item(0).cells.item(index).contents = value.toString()
    for (const [index, value] of data.Table.entries()) for (const [index2, value2] of Object.keys(value).entries()) table.rows.item(index + 1).cells.item(index2).contents = value[value2].toString()
    doMove(frame, data)
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