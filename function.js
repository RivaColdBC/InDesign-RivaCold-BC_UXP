const { FitOptions } = require("indesign");
const font = ["Frutiger 45 Light", "Frutiger 55", "Frutiger 65", "Frutiger 75 Black", "Frutiger 95 Ultra Black"]

module.exports.setConfig = (app, parameter) => {
    app.documentPreferences.pageHeight = parameter.pageHeight + 'mm'
    app.documentPreferences.pageWidth = parameter.pageWidth + 'mm'
    app.documentPreferences.pagesPerDocument = 1
    app.documentPreferences.startPageNumber = 1
    app.documentPreferences.facingPages = true
    const myDocument = app.documents.add();
    const myTextFrame = myDocument.pages.item(0).textFrames.add();
    myTextFrame.geometricBounds = [parameter.startHeight + "mm", parameter.startWidth + "mm", parameter.endHeight + "mm", parameter.endWidth + "mm",];
    myTextFrame.contents = "FIRST PAGE, DO NOT USE IT FOR NOTHING";
    return myDocument
}
module.exports.addImagen = (page, data) => {
    const frame = page.textFrames.add()
    doPlace(frame, data)
    doMove(frame, data)
}

module.exports.addText = (page, data) => {
    const frame = page.textFrames.add({
        contents: data.content,
        parentStory: {
            appliedFont: font[data.font],
            pointSize: data.fontSize
        },
    })
    if (data.justification) frame.texts[0].justification = data.justification
    if (data.vertical) frame.textFramePreferences.verticalJustification = data.vertical
    console.log(page.swatches)
    frame.texts[0].fillColor = [1, 2, 3]
    frame.texts[0].tracking = 40
    doMove(frame, data)
}

module.exports.addTable = () => { }

doPlace = (frame, data) => {
    frame.place(data.content)
    frame.fit(FitOptions.FRAME_TO_CONTENT)
}
doMove = (frame, data) => {
    frame.move([(data.x | 0) - (frame.geometricBounds[3] - frame.geometricBounds[1]) * (data.geo_x | 0), (data.y | 0) - (frame.geometricBounds[2] - frame.geometricBounds[0]) * (data.geo_y | 0),])
}