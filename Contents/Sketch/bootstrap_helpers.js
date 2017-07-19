@import 'common.js'
var doc;
var selection;
var selectedElement;
var context;
var bootstrapSize;
var bootstrapColumnWidth;
var artboard;
var artboardName;
var artboardWidth;
var artboardIndex;

function onPlayground(context) {
    checkArtboardSettings(context);
}

/*----------------------------------*/
//Sets the selected element (idealy the bootstrap grid icon) to full grid width
/*----------------------------------*/
function onSetBootstrapGrid(context) {
    checkArtboardSettings(context);
    if (bootstrapSize == "xs") {
        selectedElement.frame().width = artboard.frame().width();
        selectedElement.frame().x = 0;
    } else if (bootstrapSize == "sm") {
        selectedElement.frame().width = 540;
        selectedElement.frame().x = (artboard.frame().width() - selectedElement.frame().width()) * 0.5;
    } else if (bootstrapSize == "md") {
        selectedElement.frame().width = 720;
        selectedElement.frame().x = (artboard.frame().width() - selectedElement.frame().width()) * 0.5;
    } else if (bootstrapSize == "lg") {
        selectedElement.frame().width = 960;
        selectedElement.frame().x = (artboard.frame().width() - selectedElement.frame().width()) * 0.5;
    } else if (bootstrapSize == "xl") {
        selectedElement.frame().width = 1170;
        selectedElement.frame().x = (artboard.frame().width() - selectedElement.frame().width()) * 0.5;
    } else {
        displayMessageToUser(context, "❌ Something went wrong. ❌");
    }

}

/*----------------------------------*/
//Initializes the plugin based on the selection
/*----------------------------------*/
function checkArtboardSettings(context) {
    selection = context.selection;
    selectedElement = nil;

    if ([selection count] == 0) {
        displayMessageToUser(context, "❌ Please select an element. ❌");
    } else {
        context = context;
        doc = NSDocumentController.sharedDocumentController().currentDocument();

        selectedElement = [selection objectAtIndex: 0];

        if (selectedElement.class() == "MSArtboardGroup") {
            displayMessageToUser(context, "❌ Please select an element and not an artboard. ❌");
        } else {
            bootstrapSize;
            artboard = selectedElement.parentArtboard();
            artboardName = artboard.name();
            artboardWidth = artboard.frame().width();
            pageName = artboard.parentPage().name();
            artboardIndex = artboard.parentPage().artboards().indexOf(artboard) + 1;
            
            //log(artboardName + ", " + artboard.frame().width() + ", " + artboard.frame().height());
            
            if (artboardWidth > 0 && artboardWidth <= 575) {
                bootstrapSize = "xs";
            } else if (artboardWidth >= 576 && artboardWidth <= 767) {
                bootstrapSize = "sm";
            } else if (artboardWidth >= 768 && artboardWidth <= 991) {
                bootstrapSize = "md";
            } else if (artboardWidth >= 992 && artboardWidth <= 1199) {
                bootstrapSize = "lg";
            } else if (artboardWidth >= 1200) {
                bootstrapSize = "xl";
            } else {
                bootstrapSize = "unknown";
            }
            bootstrapColumnWidth = getColumnWidth();
            displayMessageToUser(context, "✅ bootstrapSize: " + bootstrapSize + "; columnWidth: " + bootstrapColumnWidth + " ✅");
        }
    }
}

/*----------------------------------*/
//Get column width
/*----------------------------------*/
function getColumnWidth() {
    var temp;
    if (bootstrapSize == "xs") {
        temp = artboardWidth - (2 * 15);
    } else {
        temp = (artboardWidth - (12 * 30)) / 12;
    }
    return temp;
}
