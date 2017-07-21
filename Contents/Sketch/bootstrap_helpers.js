@import 'common.js'
//var doc;
var selection;
var selectedElement;
var selectedElement2;
var context;
var bootstrapSize;
var gridTotalWidth;
var gridColumnWidth;
var gridGutter = 15;
var artboard;
var artboardName;
var artboardWidth;
var artboardIndex;

var reference_obj = new Object();

function onPlayground(context) {
    //checkArtboardSettings(context);
    //selectedElement.frame().width = 10;

    onDefineReference(context);
}

function onDefineReference(context) {
    selection = context.selection;
    selectedElement = nil;

    if ([selection count] == 0) {
        displayMessageToUser(context, "❌ Please select an element. ❌");
        return false;
    } else {

        selectedElement = [selection objectAtIndex: 0];
        
        reference_obj.name = selectedElement.name();
    }

    displayMessageToUser(context, "✅ Reference: " + reference_obj.name + " ✅");
}

/*----------------------------------*/
//Sets the selected element (idealy the bootstrap grid symbol) to full grid width
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
        //doc = NSDocumentController.sharedDocumentController().currentDocument();

        selectedElement = [selection objectAtIndex: 0];
        if ([selection count] > 1) {
            selectedElement2 = [selection objectAtIndex: 1];

            log(selectedElement.frame().width() + ", " + selectedElement2.frame().width());
        }

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
            gridColumnWidth = getColumnWidth();
            displayMessageToUser(context, "✅ bootstrapSize: " + bootstrapSize + "; columnWidth: " + gridColumnWidth + " ✅");

            return true;
        }
    }
}

function findColumnWidth(shallBeIncreased, myElementWidth, myGridColumnWidth, myGridGutterWidth) {
    if (shallBeIncreased) {
        var index = 1;
        var additionalSpace = (myGridGutterWidth * 2 * index) - (2 * myGridGutterWidth);
        var possibleNewWidth = (myGridColumnWidth * index) + additionalSpace;

        while (index <= 11 && myElementWidth >= possibleNewWidth) {
            index++;
            additionalSpace = (myGridGutterWidth * 2 * index) - (2 * myGridGutterWidth);
            possibleNewWidth = (myGridColumnWidth * index) + additionalSpace;
        }
        return possibleNewWidth;
    } else {
        var index = 11;
        var additionalSpace = (myGridGutterWidth * 2 * index) - (2 * myGridGutterWidth);
        var possibleNewWidth = (myGridColumnWidth * index) + additionalSpace;

        while (index > 1 && myElementWidth <= possibleNewWidth) {
            index--;
            additionalSpace = (myGridGutterWidth * 2 * index) - (2 * myGridGutterWidth);
            possibleNewWidth = (myGridColumnWidth * index) + additionalSpace;
        }
        return possibleNewWidth;
    }
}

function onDecreaseByOne(context) {
    if (checkArtboardSettings(context)) {

        selectedElement.frame().width = findColumnWidth(false, selectedElement.frame().width(), gridColumnWidth, gridGutter)

        displayMessageToUser(context, "✅ " + selectedElement.frame().width() + " ✅");
    }
}

function onIncreaseByOne(context) {

    if (checkArtboardSettings(context)) {

        selectedElement.frame().width = findColumnWidth(true, selectedElement.frame().width(), gridColumnWidth, gridGutter)

        displayMessageToUser(context, "✅ " + selectedElement.frame().width() + " ✅");
    }
}

function onMoveLeftByOne(context) {
    if (checkArtboardSettings(context)) {
        displayMessageToUser(context, "✅ onMoveLeftByOne " + selectedElement.frame().x() + " ✅");

        selectedElement.frame().x = selectedElement.frame().x() - (gridColumnWidth + gridGutter * 2);
    }
}

function onMoveRightByOne(context) {
    if (checkArtboardSettings(context)) {
        displayMessageToUser(context, "✅ onMoveRightByOne " + selectedElement.frame().x() + " ✅");

        selectedElement.frame().x = selectedElement.frame().x() + (gridColumnWidth + gridGutter * 2);
    }
}

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
