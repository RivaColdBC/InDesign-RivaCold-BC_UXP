const { FitOptions } = require("indesign");
const Font = ["Frutiger LT Std"]
const Style = ["45 Light", "55 Roman", "65 Bold", "75 Black", "95 Ultra Black"]

module.exports.setConfig = (app, parameter) => {
    app.documentPreferences.pageHeight = parameter.pageHeight
    app.documentPreferences.pageWidth = parameter.pageWidth
    app.documentPreferences.pagesPerDocument = 1
    app.documentPreferences.startPageNumber = 1
    app.documentPreferences.facingPages = true
    const myDocument = app.documents.add();
    const myTextFrame = myDocument.pages.item(0).textFrames.add();
    myTextFrame.geometricBounds = [parameter.startHeight, parameter.startWidth, parameter.endHeight, parameter.endWidth];
    myTextFrame.contents = "FIRST PAGE, DO NOT USE IT FOR NOTHING";
    return myDocument
}
module.exports.addImagen = (page, data) => {
    const frame = page.textFrames.add()
    doPlace(frame, data)
    doMove(frame, data)
}

module.exports.addText = (page, data) => {
    console.log(Style[data.Style])
    const frame = page.textFrames.add({
        contents: data.content,
        geometricBounds: [0, 0, data.size_y, data.size_x],
        strokeWidth: 0,
        parentStory: {
            appliedFont: Font[data.Font],
            fontStyle: Style[data.Style],
            pointSize: data.fontSize,
            justification: data.justification
        },
    })
    if (data.vertical) frame.textFramePreferences.verticalJustification = data.vertical
    if (data.rotation) frame.absoluteRotationAngle = data.rotation
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