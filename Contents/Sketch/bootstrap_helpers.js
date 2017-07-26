@import 'common.js'
//var doc;
//var context;
var bootstrapSize;
var gridTotalWidth;
var gridColumnWidth;
var gridGutter = 15;
var master;
var slave;

var reference_obj = new Object();

function onPlayground(context) {
    //checkArtboardSettings(context);

    if (onInitialize(context)) {
        log("onPlayground successfully executed. :)")

        //Sets the opacity of the sketch window to 50% (1 = 100%)
        if (NSApplication.sharedApplication().mainWindow().alphaValue() == 0.5) {
            NSApplication.sharedApplication().mainWindow().alphaValue = 1;
        } else {
            NSApplication.sharedApplication().mainWindow().alphaValue = 0.5;
        }
        displayMessageToUser(context, "✅ Alpha Value: " + NSApplication.sharedApplication().mainWindow().alphaValue() + " ✅");
    };
}

function onInitialize(context) {
    var selection = context.selection;

    master = new Object();
    slave = new Object();

    if ([selection count] == 0) {
        displayMessageToUser(context, "❌ Please select one or two elements. ❌");
        return false;
    } else {
        if ([selection count] == 1) {
            //SINGLE OBJECT SELECTED
            if ([selection objectAtIndex: 0].class() == "MSArtboardGroup") {
                displayMessageToUser(context, "❌ Please select an element and not an artboard. ❌");
                return false;
            } else {
                slave.element = [selection objectAtIndex: 0];
                slave.name = slave.element.name();

                master.element = slave.element.parentArtboard();
                master.name = master.element.name();
                master.width = master.element.frame().width();

                if (master.width > 0 && master.width <= 575) {
                    bootstrapSize = "xs";
                    gridTotalWidth = master.width;
                } else if (master.width >= 576 && master.width <= 767) {
                    bootstrapSize = "sm";
                    gridTotalWidth = 540;
                } else if (master.width >= 768 && master.width <= 991) {
                    bootstrapSize = "md";
                    gridTotalWidth = 720;
                } else if (master.width >= 992 && master.width <= 1199) {
                    bootstrapSize = "lg";
                    gridTotalWidth = 960;
                } else if (master.width >= 1200) {
                    bootstrapSize = "xl";
                    gridTotalWidth = 1170;
                }
                gridColumnWidth = getColumnWidth();

                log(master.name + ", " + master.width + ", " + gridColumnWidth + ", " + bootstrapSize);

                displayMessageToUser(context, "✅ One element selected: " + slave.name + " ✅");
                return true;
            }
        } else if ([selection count] == 2) {
            //TWO OBJECTS SELECTED
            slave.element = [selection objectAtIndex: 0];
            slave.name = slave.element.name();

            master.element = [selection objectAtIndex: 1];
            master.name = master.element.name();



            displayMessageToUser(context, "✅ Two elements selected: " + slave.name + ", " + master.name + " ✅");
            return true;

        } else {
            displayMessageToUser(context, "❌ Please select not more than two elements. ❌");
            return false;
        }

    }
}

/*----------------------------------*/
//Sets the selected element (idealy the bootstrap grid symbol) to full grid width
/*----------------------------------*/
function onSetBootstrapGrid(context) {
    if (onInitialize(context)) {
        if (bootstrapSize == "xs") {
            slave.element.frame().width = master.element.frame().width();
            slave.element.frame().x = 0;
        } else if (bootstrapSize == "sm") {
            slave.element.frame().width = 540;
            slave.element.frame().x = (master.element.frame().width() - slave.element.frame().width()) * 0.5;
        } else if (bootstrapSize == "md") {
            slave.element.frame().width = 720;
            slave.element.frame().x = (master.element.frame().width() - slave.element.frame().width()) * 0.5;
        } else if (bootstrapSize == "lg") {
            slave.element.frame().width = 960;
            slave.element.frame().x = (master.element.frame().width() - slave.element.frame().width()) * 0.5;
        } else if (bootstrapSize == "xl") {
            slave.element.frame().width = 1170;
            slave.element.frame().x = (master.element.frame().width() - slave.element.frame().width()) * 0.5;
        } else {
            displayMessageToUser(context, "❌ Something went wrong. ❌");
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
    if (onInitialize(context)) {

        slave.element.frame().width = findColumnWidth(false, slave.element.frame().width(), gridColumnWidth, gridGutter)

        displayMessageToUser(context, "✅ " + slave.element.frame().width() + " ✅");
    }
}

function onIncreaseByOne(context) {
    if (onInitialize(context)) {

        slave.element.frame().width = findColumnWidth(true, slave.element.frame().width(), gridColumnWidth, gridGutter)

        displayMessageToUser(context, "✅ " + slave.element.frame().width() + " ✅");
    }
}

function onMoveLeftByOne(context) {
    if (onInitialize(context)) {
        slave.element.frame().x = slave.element.frame().x() - (gridColumnWidth + gridGutter * 2);

        displayMessageToUser(context, "✅ onMoveLeftByOne " + slave.element.frame().x() + " ✅");
    }
}

function onMoveRightByOne(context) {
    if (onInitialize(context)) {
        slave.element.frame().x = slave.element.frame().x() + (gridColumnWidth + gridGutter * 2);

        displayMessageToUser(context, "✅ onMoveRightByOne " + slave.element.frame().x() + " ✅");
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
