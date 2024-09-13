const { FitOptions, SaveOptions } = require("indesign");
const Font = ["Frutiger LT Std"]
const Style = ["45 Light", "55 Roman", "65 Bold", "75 Black", "95 Ultra Black"]
const dir = "C:\\Proyecto\\InDesign-RivaCold-BC_UXP"
let Doc
module.exports.setConfig = (app, parameter) => {
    //app.documents.everyItem().close(SaveOptions.NO)
    app.documents.firstItem().close(SaveOptions.NO)
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
    console.log(page)
    const frame = page.textFrames.add({
        contents: data.content,
        geometricBounds: [0, 0, data.size_y, data.size_x],
        strokeWidth: 0,
        parentStory: {
            appliedFont: Font[data.Font || 0],
            fontStyle: Style[data.Style || 0],
            pointSize: data.fontSize,
            justification: data.justification,
            fillColor: data.tfillColor || Doc.swatches.itemByName("r0g0b0 44"),
            fillTint: data.tfillTint || 100,
        },
        fillColor: data.bgfillColor || Doc.swatches.itemByName("r255g255b255"),
        fillTint: data.bgfillTint || 100,
    })
    if (data.vertical) frame.textFramePreferences.verticalJustification = data.vertical
    if (data.rotation) frame.absoluteRotationAngle = data.rotation
    doMove(frame, data)
    return frame
}

module.exports.addTable = () => { }

doPlace = (frame, data) => {
    frame.place(data.content)
    frame.fit(FitOptions.FRAME_TO_CONTENT)
}
doMove = (frame, data) => {
    frame.move([(data.x || 0) - (frame.geometricBounds[3] - frame.geometricBounds[1]) * (data.geo_x || 0), (data.y || 0) - (frame.geometricBounds[2] - frame.geometricBounds[0]) * (data.geo_y || 0),])
}