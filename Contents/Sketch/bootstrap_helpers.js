@import 'common.js'
var doc;
var selection;
var selectedElement;
var context;
var bootstrapSize;
var gridColumnWidth;
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
    if (checkArtboardSettings(context)) {
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

}

/*----------------------------------*/
//Initializes the plugin based on the selection
/*----------------------------------*/
function checkArtboardSettings(context) {
    selection = context.selection;
    selectedElement = nil;

    if ([selection count] == 0) {
        displayMessageToUser(context, "❌ Please select an element. ❌");
        return false;
    } else {
        context = context;
        doc = NSDocumentController.sharedDocumentController().currentDocument();

        selectedElement = [selection objectAtIndex: 0];

        if (selectedElement.class() == "MSArtboardGroup") {
            displayMessageToUser(context, "❌ Please select an element and not an artboard. ❌");
            return false;
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
            gridColumnWidth = getColumnWidth();
            displayMessageToUser(context, "✅ bootstrapSize: " + bootstrapSize + "; columnWidth: " + gridColumnWidth + " ✅");

            return true;
        }
    }
}

function onIncreaseByOne(context) {
    if (checkArtboardSettings(context)) {
        var temp = getElementsCurrentColumnWidth();
        displayMessageToUser(context, "✅ "+ temp +" ✅");
    }
}

function getElementsCurrentColumnWidth() {
    if (selectedElement.frame().width() <= gridColumnWidth) {
        return 1;
    } else if (selectedElement.frame().width() > gridColumnWidth && selectedElement.frame().width() <= (gridColumnWidth + 15) * 2) {
        return 2;
    } else if (selectedElement.frame().width() > gridColumnWidth && selectedElement.frame().width() <= (gridColumnWidth + 15) * 3) {
        return 3;
    } else if (selectedElement.frame().width() > gridColumnWidth && selectedElement.frame().width() <= (gridColumnWidth + 15) * 4) {
        return 4;
    } else if (selectedElement.frame().width() > gridColumnWidth && selectedElement.frame().width() <= (gridColumnWidth + 15) * 5) {
        return 5;
    } else if (selectedElement.frame().width() > gridColumnWidth && selectedElement.frame().width() <= (gridColumnWidth + 15) * 6) {
        return 6;
    } else if (selectedElement.frame().width() > gridColumnWidth && selectedElement.frame().width() <= (gridColumnWidth + 15) * 7) {
        return 7;
    } else if (selectedElement.frame().width() > gridColumnWidth && selectedElement.frame().width() <= (gridColumnWidth + 15) * 8) {
        return 8;
    } else if (selectedElement.frame().width() > gridColumnWidth && selectedElement.frame().width() <= (gridColumnWidth + 15) * 9) {
        return 9;
    } else if (selectedElement.frame().width() > gridColumnWidth && selectedElement.frame().width() <= (gridColumnWidth + 15) * 10) {
        return 10;
    } else if (selectedElement.frame().width() > gridColumnWidth && selectedElement.frame().width() <= (gridColumnWidth + 15) * 11) {
        return 11;
    } else if (selectedElement.frame().width() > (gridColumnWidth + 15) * 12) {
        return 12;
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
