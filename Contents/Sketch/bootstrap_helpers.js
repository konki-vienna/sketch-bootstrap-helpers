@import 'common.js'
var doc = NSDocumentController.sharedDocumentController().currentDocument(); //context.document;
//var context;
var bootstrapSize;
var gridTotalWidth;
var gridColumnWidth;
var gridGutter = 15;
var gridGroupName = "B00T$TRAP-Grid";
var myFillColor = "#FF33CC59"; //100% — FF, 95% — F2, 90% — E6, 85% — D9, 80% — CC, 75% — BF, 70% — B3, 65% — A6, 60% — 99, 55% — 8C, 50% — 80, 45% — 73, 40% — 66, 35% — 59, 30% — 4D, 25% — 40, 20% — 33, 15% — 26, 10% — 1A, 5% — 0D, 0% — 00
var master;
var slave;
var artboard;

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

/*-------------------------------------------------*/
//OPENS TOOLBAR WINDOW - END
/*-------------------------------------------------*/
function onToolbar(context) {
  log("onToolbar1")
  var panelWidth = 240;
  var panelHeight = 120;

  // Create an NSThread dictionary with a specific identifier
  var threadDictionary = NSThread.mainThread().threadDictionary();
  var identifier = "co.awkward.floatingexample";

  // If there's already a panel, prevent the plugin from running
  if (threadDictionary[identifier]) return;

  // Create the panel and set its appearance
  var panel = NSPanel.alloc().init();
  panel.setFrame_display(NSMakeRect(0, 0, panelWidth, panelHeight), true);
  panel.setStyleMask(NSTexturedBackgroundWindowMask | NSTitledWindowMask | NSClosableWindowMask | NSFullSizeContentViewWindowMask);
  panel.setBackgroundColor(NSColor.whiteColor());

  // Set the panel's title and title bar appearance
  panel.title = "";
  panel.titlebarAppearsTransparent = true;

  // Center and focus the panel
  panel.center();
  panel.makeKeyAndOrderFront(null);
  panel.setLevel(NSFloatingWindowLevel);

  // Make the plugin's code stick around (since it's a floating panel)
  COScript.currentCOScript().setShouldKeepAround_(true);

  // Hide the Minimize and Zoom button
  panel.standardWindowButton(NSWindowMiniaturizeButton);//.setHidden(true);
  panel.standardWindowButton(NSWindowZoomButton);//.setHidden(true);

  // Create the blurred background
  var vibrancy = NSVisualEffectView.alloc().initWithFrame(NSMakeRect(0, 0, panelWidth, panelHeight));
  vibrancy.setAppearance(NSAppearance.appearanceNamed(NSAppearanceNameVibrantLight));
  vibrancy.setBlendingMode(NSVisualEffectBlendingModeBehindWindow);

  // Create the WebView with a request to a Web page in Contents/Resources/
  var webView = WebView.alloc().initWithFrame(NSMakeRect(0, 0, panelWidth, panelHeight - 44));
  var request = NSURLRequest.requestWithURL(context.plugin.urlForResourceNamed("webView.html"));
  webView.mainFrame().loadRequest(request);
  webView.setDrawsBackground(false);

  // Add the content views to the panel
  panel.contentView().addSubview(vibrancy);
  panel.contentView().addSubview(webView);

  // After creating the panel, store a reference to it
  threadDictionary[identifier] = panel;

  var closeButton = panel.standardWindowButton(NSWindowCloseButton);

  // Assign a function to the Close button
  closeButton.setCOSJSTargetFunction(function(sender) {
    panel.close();

    // Remove the reference to the panel
    threadDictionary.removeObjectForKey(identifier);

    // Stop the plugin
    COScript.currentCOScript().setShouldKeepAround_(false);
  });
}
/*-------------------------------------------------*/
//OPENS TOOLBAR WINDOW - END
/*-------------------------------------------------*/

/*-------------------------------------------------*/
//SELECT ALL BOOTSTRAP GRIDS ON THAT PAGE - END
/*-------------------------------------------------*/
function onSelectGrids(context) {
    var subSetOfLayers_array = new Array();
    var selectLayersOfType_inContainer = function (layerType, containerLayer) {

        // Filter layers using NSPredicate
        var scope = (typeof containerLayer !== 'undefined') ? [containerLayer children] : [[doc currentPage] children],
            predicate = NSPredicate.predicateWithFormat("(className == %@)", layerType),
            layers = [scope filteredArrayUsingPredicate: predicate];

        // Deselect current selection
        //[[doc currentPage] deselectAllLayers]

        // Loop through filtered layers and select them
        var loop = [layers objectEnumerator],
            layer;
        while (layer = [loop nextObject]) {
            layer.visibility = false;
            if (layer.name() == gridGroupName) {
                subSetOfLayers_array.push(layer);
                [layer select: true byExpandingSelection: true];
            }
        }
        //log([layers count] + " " + layerType + "s found of which " + subSetOfLayers_array.length + " match");
    }

    // Select all MSLayerGroup in current page
    selectLayersOfType_inContainer("MSLayerGroup")

    /*for (var i = 0; i < subSetOfLayers_array.length; i++) {
        subSetOfLayers_array[i].isVisible = false;
    }*/
}
/*-------------------------------------------------*/
//SELECT ALL BOOTSTRAP GRIDS ON THAT PAGE - END
/*-------------------------------------------------*/




/*----------------------------------*/
//DRAWS A BOOTSTRAP GRID - START
/*----------------------------------*/
function onDrawBootstrapGridWithOuterGutter(context) {
    drawBootstrapGrid(context, true);
}

function onDrawBootstrapGridWithoutOuterGutter(context) {
    drawBootstrapGrid(context, false);
}

function drawBootstrapGrid(context, myHasOuterGutter) {
    var selection = context.selection;

    if ([selection count] == 0 || [selection count] >= 2) {
        displayMessageToUser(context, "❌ Please select a single element. ❌");
    } else {
        if ([selection objectAtIndex: 0].class() == "MSArtboardGroup") {
            myHasOuterGutter = true; //in case an Artboard is selected, there shall always be a gutter
            master = new Object();
            master.element = [selection objectAtIndex: 0];
            master.name = master.element.name();
            master.width = master.element.frame().width();
            if (myHasOuterGutter) {
                setGridSettings(master, 1);
            } else {
                setGridSettings(master, 2);
            }

            if (bootstrapSize == "xs") {
                displayMessageToUser(context, "❌ Drawing a grid for this (and smaller) artboard sizes is not supported ❌");
                return;
            } else {
                drawGrid(master, true, myHasOuterGutter);
            }
        } else {
            master = new Object();
            master.element = [selection objectAtIndex: 0];
            master.name = master.element.name();
            master.width = master.element.frame().width();
            if (myHasOuterGutter) {
                master.width -= 2 * gridGutter;
            }

            gridTotalWidth = master.width;
            gridColumnWidth = (gridTotalWidth - (11 * (gridGutter * 2))) / 12;

            drawGrid(master, false, myHasOuterGutter);
        }
        displayMessageToUser(context, "GridWidth: " + gridTotalWidth + "px, ColumnWidth: " + gridColumnWidth + "px, gutterWidth: " + gridGutter + "px, hasOuterGutter: " + myHasOuterGutter);

    }
}

function drawGrid(myMaster, myMasterIsArtboard, myHasOuterGutter) {
    //CREATE GRID
    //doc = NSDocumentController.sharedDocumentController().currentDocument();

    var rectShape;
    var tempRect;

    //Add to layer group
    layerGroup_array = new Array();

    for (var i = 0; i < 12; i++) {
        var myName = "column_" + (i + 1);
        var myObj = new Object();
        if (myMasterIsArtboard) {
            var artBoardOffSet = (myMaster.width - gridTotalWidth) * 0.5;
            myObj.x = artBoardOffSet + (i * (gridColumnWidth + (2 * gridGutter)));
            myObj.y = 0;
        } else {
            myObj.x = myMaster.element.frame().x() + (i * (gridColumnWidth + (2 * gridGutter)));
            myObj.y = myMaster.element.frame().y();
        }
        if (myHasOuterGutter) {
            myObj.x += gridGutter;
        }

        myObj.width = gridColumnWidth;
        myObj.height = 200;
        tempRect = drawRect(myFillColor, myName, myObj, 0);
        layerGroup_array.push(tempRect);

        // Add created shape group to the current page.
        doc.currentPage().currentArtboard().addLayers([tempRect]);
    }

    groupLayers(layerGroup_array, gridGroupName);
}

function groupLayers(myLayer_array, myGroupName) {
    //CREATE GROUP
    var groupLayer = MSLayerGroup.new();
    groupLayer.name = myGroupName;
    var parent = myLayer_array[0].parentGroup();
    parent.addLayers([groupLayer]);

    var temp;
    for (var i = 0; i < myLayer_array.length; i++) {
        parent.removeLayer(myLayer_array[i]);
        temp = myLayer_array[i];
        groupLayer.addLayers([temp]);
    }

    groupLayer.setConstrainProportions(0); //constrainProportions = off

    groupLayer.resizeToFitChildrenWithOption(1);
}

function drawRect(myFillColor, myName, myObj, myCornerRadius) {
    if (myCornerRadius == undefined) myCornerRadius = 0;

    var rectShape;
    rectShape = MSRectangleShape.alloc().init();
    rectShape.frame = MSRect.rectWithRect(NSMakeRect(myObj.x, myObj.y, myObj.width, myObj.height));
    rectShape.cornerRadiusFloat = myCornerRadius;

    var shapeGroup = MSShapeGroup.shapeWithPath(rectShape);
    var fill = shapeGroup.style().addStylePartOfType(0);
    fill.color = MSImmutableColor.colorWithSVGString(myFillColor);

    shapeGroup.frame().constrainProportions = false; // Set to `true` if you want shape to be constrained.
    shapeGroup.setName(myName);

    return shapeGroup;
}
/*----------------------------------*/
//DRAWS A BOOTSTRAP GRID - START
/*----------------------------------*/

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

            //log(master.name + ", " + gridTotalWidth + ", " + gridColumnWidth);

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
        //var temp_gridColumnWidth = getColumnWidth([selection objectAtIndex: 0]);
        //log(temp_gridColumnWidth);
        //loop through the selected layers
        for (var i = 0; i < selection.count(); i++) {
          [selection objectAtIndex: i].frame().x = [selection objectAtIndex: i].frame().x() - (temp_gridColumnWidth + gridGutter * 2);
        }

        //slave.element.frame().x = slave.element.frame().x() - (gridColumnWidth + gridGutter * 2);

        displayMessageToUser(context, "✅ onMoveLeftByOne " + " ✅");
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

        displayMessageToUser(context, "✅ onMoveRightByOne " + " ✅");
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
