@import 'common.js'
var doc;
var selection;
var selectedElement;
var context;
var bootstrapSize;
var gridTotalWidth;
var gridColumnWidth;
var gridGutter = 15;
var artboard;
var artboardName;
var artboardWidth;
var artboardIndex;

function onPlayground(context) {
    checkArtboardSettings(context);
    selectedElement.frame().width = 10;
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
                gridTotalWidth = artboardWidth;
            } else if (artboardWidth >= 576 && artboardWidth <= 767) {
                bootstrapSize = "sm";
                gridTotalWidth = 540;
            } else if (artboardWidth >= 768 && artboardWidth <= 991) {
                bootstrapSize = "md";
                gridTotalWidth = 720;
            } else if (artboardWidth >= 992 && artboardWidth <= 1199) {
                bootstrapSize = "lg";
                gridTotalWidth = 960;
            } else if (artboardWidth >= 1200) {
                bootstrapSize = "xl";
                gridTotalWidth = 1170;
            }
            gridColumnWidth = getColumnWidth(); {}
            displayMessageToUser(context, "✅ bootstrapSize: " + bootstrapSize + "; columnWidth: " + gridColumnWidth + " ✅");

            return true;
        }
    }
}

function onDecreaseByOne(context) {
    if (checkArtboardSettings(context)) {
        if (selectedElement.frame().width() > (gridColumnWidth * 11) + (gridGutter * 20)) {
            selectedElement.frame().width = (gridColumnWidth * 11) + (gridGutter * 20);
        } else if (selectedElement.frame().width() > (gridColumnWidth * 10) + (gridGutter * 18) && selectedElement.frame().width() <= (gridColumnWidth * 11) + (gridGutter * 20)) {
            selectedElement.frame().width = (gridColumnWidth * 10) + (gridGutter * 18);
        } else if (selectedElement.frame().width() > (gridColumnWidth * 9) + (gridGutter * 16) && selectedElement.frame().width() <= (gridColumnWidth * 10) + (gridGutter * 18)) {
            selectedElement.frame().width = (gridColumnWidth * 9) + (gridGutter * 16);
        } else if (selectedElement.frame().width() > (gridColumnWidth * 8) + (gridGutter * 14) && selectedElement.frame().width() <= (gridColumnWidth * 9) + (gridGutter * 16)) {
            selectedElement.frame().width = (gridColumnWidth * 8) + (gridGutter * 14);
        } else if (selectedElement.frame().width() > (gridColumnWidth * 7) + (gridGutter * 12) && selectedElement.frame().width() <= (gridColumnWidth * 8) + (gridGutter * 14)) {
            selectedElement.frame().width = (gridColumnWidth * 7) + (gridGutter * 12);
        } else if (selectedElement.frame().width() > (gridColumnWidth * 6) + (gridGutter * 10) && selectedElement.frame().width() <= (gridColumnWidth * 7) + (gridGutter * 12)) {
            selectedElement.frame().width = (gridColumnWidth * 6) + (gridGutter * 10);
        } else if (selectedElement.frame().width() > (gridColumnWidth * 5) + (gridGutter * 8) && selectedElement.frame().width() <= (gridColumnWidth * 6) + (gridGutter * 10)) {
            selectedElement.frame().width = (gridColumnWidth * 5) + (gridGutter * 8);
        } else if (selectedElement.frame().width() > (gridColumnWidth * 4) + (gridGutter * 6) && selectedElement.frame().width() <= (gridColumnWidth * 5) + (gridGutter * 8)) {
            selectedElement.frame().width = (gridColumnWidth * 4) + (gridGutter * 6);
        } else if (selectedElement.frame().width() > (gridColumnWidth * 3) + (gridGutter * 4) && selectedElement.frame().width() <= (gridColumnWidth * 4) + (gridGutter * 6)) {
            selectedElement.frame().width = (gridColumnWidth * 3) + (gridGutter * 4);
        } else if (selectedElement.frame().width() > (gridColumnWidth * 2) + (gridGutter * 2) && selectedElement.frame().width() <= (gridColumnWidth * 3) + (gridGutter * 4)) {
            selectedElement.frame().width = (gridColumnWidth * 2) + (gridGutter * 2);
        } else if (selectedElement.frame().width() > gridColumnWidth) {
            selectedElement.frame().width = (gridColumnWidth * 1);
        }
    }
}

function onIncreaseByOne(context) {
    if (checkArtboardSettings(context)) {

        if (selectedElement.frame().width() < gridColumnWidth) {
            selectedElement.frame().width = gridColumnWidth;
        } else if (selectedElement.frame().width() >= gridColumnWidth && selectedElement.frame().width() < (gridColumnWidth * 2) + (gridGutter * 2)) {
            selectedElement.frame().width = (gridColumnWidth * 2) + (gridGutter * 2);
        } else if (selectedElement.frame().width() >= (gridColumnWidth * 2) + (gridGutter * 2) && selectedElement.frame().width() < (gridColumnWidth * 3) + (gridGutter * 4)) {
            selectedElement.frame().width = (gridColumnWidth * 3) + (gridGutter * 4);
        } else if (selectedElement.frame().width() >= (gridColumnWidth * 3) + (gridGutter * 4) && selectedElement.frame().width() < (gridColumnWidth * 4) + (gridGutter * 6)) {
            selectedElement.frame().width = (gridColumnWidth * 4) + (gridGutter * 6);
        } else if (selectedElement.frame().width() >= (gridColumnWidth * 4) + (gridGutter * 6) && selectedElement.frame().width() < (gridColumnWidth * 5) + (gridGutter * 8)) {
            selectedElement.frame().width = (gridColumnWidth * 5) + (gridGutter * 8);
        } else if (selectedElement.frame().width() >= (gridColumnWidth * 5) + (gridGutter * 8) && selectedElement.frame().width() < (gridColumnWidth * 6) + (gridGutter * 10)) {
            selectedElement.frame().width = (gridColumnWidth * 6) + (gridGutter * 10);
        } else if (selectedElement.frame().width() >= (gridColumnWidth * 6) + (gridGutter * 10) && selectedElement.frame().width() < (gridColumnWidth * 7) + (gridGutter * 12)) {
            selectedElement.frame().width = (gridColumnWidth * 7) + (gridGutter * 12);
        } else if (selectedElement.frame().width() >= (gridColumnWidth * 7) + (gridGutter * 12) && selectedElement.frame().width() < (gridColumnWidth * 8) + (gridGutter * 14)) {
            selectedElement.frame().width = (gridColumnWidth * 8) + (gridGutter * 14);
        } else if (selectedElement.frame().width() >= (gridColumnWidth * 8) + (gridGutter * 14) && selectedElement.frame().width() < (gridColumnWidth * 9) + (gridGutter * 16)) {
            selectedElement.frame().width = (gridColumnWidth * 9) + (gridGutter * 16);
        } else if (selectedElement.frame().width() >= (gridColumnWidth * 9) + (gridGutter * 16) && selectedElement.frame().width() < (gridColumnWidth * 10) + (gridGutter * 18)) {
            selectedElement.frame().width = (gridColumnWidth * 10) + (gridGutter * 18);
        } else if (selectedElement.frame().width() >= (gridColumnWidth * 10) + (gridGutter * 18) && selectedElement.frame().width() < (gridColumnWidth * 11) + (gridGutter * 20)) {
            selectedElement.frame().width = (gridColumnWidth * 11) + (gridGutter * 20);
        } else if (selectedElement.frame().width() >= (gridColumnWidth * 11) + (gridGutter * 20) && selectedElement.frame().width() < (gridColumnWidth * 12) + (gridGutter * 22)) {
            selectedElement.frame().width = (gridColumnWidth * 12) + (gridGutter * 22);
        } else if (selectedElement.frame().width() > (gridColumnWidth * 12) + (gridGutter * 22)) {
            selectedElement.frame().width = (gridColumnWidth * 12) + (gridGutter * 22);
        }

        //var tempColumnWidth = getElementsCurrentColumnWidth();
        displayMessageToUser(context, "✅ " + selectedElement.frame().width() + " ✅");
    }
}

/*function getElementsCurrentColumnWidth() {
    if (selectedElement.frame().width() > 0 && selectedElement.frame().width() <= gridColumnWidth) {
        return 1;
    } else if (selectedElement.frame().width() > gridColumnWidth && selectedElement.frame().width() <= (gridColumnWidth * 2) + (gridGutter * 2)) {
        return 2;
    } else if (selectedElement.frame().width() > (gridColumnWidth * 2) + (gridGutter * 2) && selectedElement.frame().width() <= (gridColumnWidth * 3) + (gridGutter * 4)) {
        return 3;
    } else if (selectedElement.frame().width() > (gridColumnWidth * 3) + (gridGutter * 4) && selectedElement.frame().width() <= (gridColumnWidth * 4) + (gridGutter * 6)) {
        return 4;
    } else if (selectedElement.frame().width() > (gridColumnWidth * 4) + (gridGutter * 6) && selectedElement.frame().width() <= (gridColumnWidth * 5) + (gridGutter * 8)) {
        return 5;
    } else if (selectedElement.frame().width() > (gridColumnWidth * 5) + (gridGutter * 8) && selectedElement.frame().width() <= (gridColumnWidth * 6) + (gridGutter * 10)) {
        return 6;
    } else if (selectedElement.frame().width() > (gridColumnWidth * 6) + (gridGutter * 10) && selectedElement.frame().width() <= (gridColumnWidth * 8) + (gridGutter * 12)) {
        return 7;
    } else if (selectedElement.frame().width() > (gridColumnWidth * 7) + (gridGutter * 12) && selectedElement.frame().width() <= (gridColumnWidth * 9) + (gridGutter * 14)) {
        return 8;
    } else if (selectedElement.frame().width() > (gridColumnWidth * 8) + (gridGutter * 14) && selectedElement.frame().width() <= (gridColumnWidth * 10) + (gridGutter * 16)) {
        return 9;
    } else if (selectedElement.frame().width() > (gridColumnWidth * 9) + (gridGutter * 16) && selectedElement.frame().width() <= (gridColumnWidth * 11) + (gridGutter * 18)) {
        return 10;
    } else if (selectedElement.frame().width() > (gridColumnWidth * 10) + (gridGutter * 18) && selectedElement.frame().width() <= (gridColumnWidth * 12) + (gridGutter * 20)) {
        return 11;
    } else if (selectedElement.frame().width() > (gridColumnWidth * 11) + (gridGutter * 20) && selectedElement.frame().width() <= (gridColumnWidth * 6) + (gridGutter * 22)) {
        return 12;
    } else if (selectedElement.frame().width() > (gridColumnWidth * 6) + (gridGutter * 22)) {
        return 999;
    }
}*/

/*----------------------------------*/
//Get column width
/*----------------------------------*/
function getColumnWidth() {
    var temp;
    if (bootstrapSize == "xs") {
        temp = gridTotalWidth - (2 * 15);
    } else {
        temp = (gridTotalWidth - (12 * 30)) / 12;
    }
    return temp;
}
