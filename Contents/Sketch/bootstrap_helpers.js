@import 'common.js'
var doc;
//var context;
var bootstrapSize;
var gridTotalWidth;
var gridColumnWidth;
var gridGutter = 15;
var master;
var slave;
var artboard;

var reference_obj = new Object();

function onPlayground(context) {
    //checkArtboardSettings(context);

    /*if (onInitialize(context)) {
        log("onPlayground successfully executed. :)")

        //Sets the opacity of the sketch window to 50% (1 = 100%)
        if (NSApplication.sharedApplication().mainWindow().alphaValue() == 0.5) {
            NSApplication.sharedApplication().mainWindow().alphaValue = 1;
        } else {
            NSApplication.sharedApplication().mainWindow().alphaValue = 0.5;
        }
        displayMessageToUser(context, "✅ Alpha Value: " + NSApplication.sharedApplication().mainWindow().alphaValue() + " ✅");
    };*/
    drawBootstrapGrid(context);
}

function drawBootstrapGrid(context) {
    var selection = context.selection;

    if ([selection count] == 0 || [selection count] >= 2) {
        displayMessageToUser(context, "❌ Please select a single element. ❌");
    } else {
        if ([selection objectAtIndex: 0].class() == "MSArtboardGroup") {
            displayMessageToUser(context, "The width of your selected artboard is: " + [selection objectAtIndex: 0].frame().width() + "px.");

            master = new Object();
            master.element = [selection objectAtIndex: 0];
            master.name = master.element.name();
            master.width = master.element.frame().width();

            setGridSettings(master, [selection count]);
            
            
            //CREATE GRID
            layerGroup_array = new Array();
            doc = NSDocumentController.sharedDocumentController().currentDocument();
            
            var rectShape;
            
            for (var i=0; i<12; i++) {
                rectShape = MSRectangleShape.alloc().init();
                rectShape.frame = MSRect.rectWithRect(NSMakeRect(i*(gridColumnWidth + 2 * gridGutter), 0, gridColumnWidth, 200));
                //rectShape.cornerRadiusFloat = 5;
                var shapeGroup=MSShapeGroup.shapeWithPath(rectShape);
                var fill = shapeGroup.style().addStylePartOfType(0);
                myFillColor = "#FF33CC";
                fill.color = MSImmutableColor.colorWithSVGString(myFillColor);

                shapeGroup.frame().constrainProportions = false; // Set to `true` if you want shape to be constrained.
                shapeGroup.setName("column_" + (i+1));

                //Add to layer group
                layerGroup_array.push(shapeGroup);

                // Add created shape group to the current page.
                doc.currentPage().currentArtboard().addLayers([shapeGroup]);
            }
            
            

        } else {
            displayMessageToUser(context, "The width of your selection is: " + [selection objectAtIndex: 0].frame().width() + "px.");
            
            master = new Object();
            master.element = [selection objectAtIndex: 0];
            master.name = master.element.name();
            master.width = master.element.frame().width();
            
            gridTotalWidth = master.width;
            gridColumnWidth = (gridTotalWidth - (11 * (gridGutter * 2)))/12;
            
            log("gridTotalWidth: " + gridTotalWidth + ", gridColumnWidth: " + gridColumnWidth + ", gridGutter: " + gridGutter);
            
            
            //CREATE GRID
            layerGroup_array = new Array();
            doc = NSDocumentController.sharedDocumentController().currentDocument();
            
            var rectShape;
            
            for (var i=0; i<12; i++) {
                rectShape = MSRectangleShape.alloc().init();
                rectShape.frame = MSRect.rectWithRect(NSMakeRect(master.element.frame().x() + i*(gridColumnWidth + 2 * gridGutter), master.element.frame().y(), gridColumnWidth, 200));
                //rectShape.cornerRadiusFloat = 5;
                var shapeGroup=MSShapeGroup.shapeWithPath(rectShape);
                var fill = shapeGroup.style().addStylePartOfType(0);
                myFillColor = "#FF33CC";
                fill.color = MSImmutableColor.colorWithSVGString(myFillColor);

                shapeGroup.frame().constrainProportions = false; // Set to `true` if you want shape to be constrained.
                shapeGroup.setName("column_" + (i+1));

                //Add to layer group
                layerGroup_array.push(shapeGroup);

                // Add created shape group to the current page.
                doc.currentPage().currentArtboard().addLayers([shapeGroup]);
            }
        }

    }
}

function setGridSettings(myReference_obj, mySelectionCount) {
    if (myReference_obj.width > 0 && myReference_obj.width <= 575) {
        bootstrapSize = "xs";
        gridTotalWidth = myReference_obj.width;
    } else if (myReference_obj.width >= 576 && myReference_obj.width <= 767) {
        bootstrapSize = "sm";
        gridTotalWidth = 540;
    } else if (myReference_obj.width >= 768 && myReference_obj.width <= 991) {
        bootstrapSize = "md";
        gridTotalWidth = 720;
    } else if (myReference_obj.width >= 992 && myReference_obj.width <= 1199) {
        bootstrapSize = "lg";
        gridTotalWidth = 960;
    } else if (myReference_obj.width >= 1200) {
        bootstrapSize = "xl";
        gridTotalWidth = 1170;
    }
    gridColumnWidth = getColumnWidth(mySelectionCount);

    log("bootstrapSize: " + bootstrapSize + ", gridTotalWidth: " + gridTotalWidth + ", gridColumnWidth: " + gridColumnWidth + ", gridGutter: " + gridGutter);
}

function onInitialize(context) {
    var selection = context.selection;

    master = new Object();
    slave = new Object();
    artboard = new Object();

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

                setGridSettings(master, [selection count]);

                //log(master.name + ", " + master.width + ", " + gridColumnWidth + ", " + bootstrapSize);

                //displayMessageToUser(context, "✅ One element selected: " + slave.name + " ✅");
                return true;
            }
        } else if ([selection count] >= 2) {
            var selection = context.selection;
            //loop through the selected layers
            for (var i = 0; i < selection.count(); i++) {
                if ([selection objectAtIndex: i].class() == "MSArtboardGroup") {
                    displayMessageToUser(context, "❌ Please do not select an artboard. ❌");
                    return false;
                }
            }

            master.element = [selection objectAtIndex: [selection count] - 1];
            master.name = master.element.name();
            master.width = master.element.frame().width();

            gridTotalWidth = master.width;
            gridColumnWidth = getColumnWidth([selection count]);

            log(master.name + ", " + gridTotalWidth + ", " + gridColumnWidth);

            return true;
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
        var selection = context.selection;
        var tempCounter = selection.count();
        if (selection.count() > 1) {
            tempCounter = selection.count() - 1;
        }
        //loop through the selected layers
        for (var i = 0; i < tempCounter; i++) {
          [selection objectAtIndex: i].frame().width = findColumnWidth(false, [selection objectAtIndex: i].frame().width(), gridColumnWidth, gridGutter);
        }

        //displayMessageToUser(context, "✅ " + slave.element.frame().width() + ", " + gridColumnWidth + " ✅");
    }
}

function onIncreaseByOne(context) {
    if (onInitialize(context)) {
        var selection = context.selection;
        var tempCounter = selection.count();
        if (selection.count() > 1) {
            tempCounter = selection.count() - 1;
        }
        //loop through the selected layers
        for (var i = 0; i < tempCounter; i++) {
          [selection objectAtIndex: i].frame().width = findColumnWidth(true, [selection objectAtIndex: i].frame().width(), gridColumnWidth, gridGutter);
        }

        //displayMessageToUser(context, "✅ " + slave.element.frame().width() + ", " + gridColumnWidth + " ✅");
    }
}

function onMoveLeftByOne(context) {
    if (onInitialize(context)) {
        var selection = context.selection;
        //loop through the selected layers
        for (var i = 0; i < selection.count(); i++) {
          [selection objectAtIndex: i].frame().x = [selection objectAtIndex: i].frame().x() - (gridColumnWidth + gridGutter * 2);
        }

        //slave.element.frame().x = slave.element.frame().x() - (gridColumnWidth + gridGutter * 2);

        //displayMessageToUser(context, "✅ onMoveLeftByOne " + slave.element.frame().x() + " ✅");
    }
}

function onMoveRightByOne(context) {
    if (onInitialize(context)) {
        var selection = context.selection;
        //loop through the selected layers
        for (var i = 0; i < selection.count(); i++) {
          [selection objectAtIndex: i].frame().x = [selection objectAtIndex: i].frame().x() + (gridColumnWidth + gridGutter * 2);
        }

        //slave.element.frame().x = slave.element.frame().x() + (gridColumnWidth + gridGutter * 2);

        //displayMessageToUser(context, "✅ onMoveRightByOne " + slave.element.frame().x() + " ✅");
    }
}

/*----------------------------------*/
//Get column width
/*----------------------------------*/
function getColumnWidth(mySelectionCount) {
    var temp;
    if (bootstrapSize == "xs") {
        temp = gridTotalWidth - (2 * 15);
    } else {
        if (mySelectionCount == 1) {
            temp = (gridTotalWidth - (12 * 30)) / 12;
        } else /* if (mySelectionCount == 2)*/ {
            temp = (gridTotalWidth - (11 * 30)) / 12;
        }
    }
    return temp;
}

/*export function LayersMoved (context) {
  console.log("LayersMoved - by Konstantins Plugin");
  const movedLayers = Array.from(context.actionContext.layers)
  let needToArrange = false

  for (const layer of movedLayers) {
    if(layer.className() == "MSArtboardGroup") {
      needToArrange = true
    }
  }
  if (needToArrange) {
    ArrangeArtboards(context)
  }
}*/
