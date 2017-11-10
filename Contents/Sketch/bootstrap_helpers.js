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
var page;

var myDictionary = NSThread.mainThread().threadDictionary();


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

    if ([selection count] == 1) {
      master = setMaster([selection objectAtIndex: 0]);
      if ([selection objectAtIndex: 0].class() == "MSArtboardGroup") {
          myHasOuterGutter = true; //in case an Artboard is selected, there shall always be a gutter
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
          if (myHasOuterGutter) {
              master.width -= 2 * gridGutter;
          }

          gridTotalWidth = master.width;
          gridColumnWidth = (gridTotalWidth - (11 * (gridGutter * 2))) / 12;
          if (gridColumnWidth <= 1) {
            displayMessageToUser(context, "❌ Grid to small to make sense ❌");
            return;
          } else {
              drawGrid(master, false, myHasOuterGutter);
          }

      }
      displayMessageToUser(context, "GridWidth: " + gridTotalWidth + "px, ColumnWidth: " + gridColumnWidth + "px, gutterWidth: " + gridGutter + "px, hasOuterGutter: " + myHasOuterGutter);
    } else {
      displayMessageToUser(context, "❌ Please select a single element. ❌");
    }
}

function drawGrid(myMaster, myMasterIsArtboard, myHasOuterGutter) {
    //CREATE GRID
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
        myObj.height = myMaster.element.frame().height();
        tempRect = drawRect(myFillColor, myName, myObj, 0);
        layerGroup_array.push(tempRect);

        // Add created shape group to the current page.
        doc.currentPage().currentArtboard().addLayers([tempRect]);
    }

    groupLayers(layerGroup_array, gridGroupName, myMasterIsArtboard, myMaster);
}

function groupLayers(myLayer_array, myGroupName, myMasterIsArtboard, myMaster) {
    //CREATE GROUP
    var groupLayer = MSLayerGroup.new();
    groupLayer.name = myGroupName;
    if (myMasterIsArtboard) {
      var parent = myLayer_array[0].parentGroup();
    } else {
      var myRoot = myLayer_array[0].parentGroup();
      var parent = myMaster.element.parentGroup();
    }

    parent.addLayers([groupLayer]);

    var temp;
    for (var i = 0; i < myLayer_array.length; i++) {
        if (myMasterIsArtboard) {
          parent.removeLayer(myLayer_array[i]);
        } else {
            myRoot.removeLayer(myLayer_array[i]);
        }
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

//DECREASES SELECTION BY A COLUMN
function onDecreaseByOne(context) {
  changeWidthOfSelectedElement("decrease", context);
}

//INCREASES SELECTION BY A COLUMN
function onIncreaseByOne(context) {
  changeWidthOfSelectedElement("increase", context);
}

//MOVES SELECTION BY A COLUMN TO THE LEFT
function onMoveLeftByOne(context) {
    moveSelectedElements("left", context);
}

//MOVES SELECTION BY A COLUMN TO THE RIGHT
function onMoveRightByOne(context) {
    moveSelectedElements("right", context);
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
}

function onInitialize2(context) {
  var selection = context.selection;
  if ([selection count] == 0) {
    displayMessageToUser(context, "❌ Please select one or more elements ❌");
    return false;
  } else {
    //LOOK IF SOMETHING IS AN ARTBOARD OR AN B00T$TRAP-Grid
    for (var i = 0; i < selection.count(); i++) {
      if ([selection objectAtIndex: i].class() == "MSArtboardGroup" || [selection objectAtIndex: i].name() == "B00T$TRAP-Grid") {
          displayMessageToUser(context, "❌ Please do not select an artboard or a folder named B00T$TRAP-Grid. ❌");
          return false;
      }
    }


    return true;
  }
}

function onInitialize(context) {
    var selection = context.selection;

    if ([selection count] <= 1) {
        displayMessageToUser(context, "❌ Please select two elements - one of which a B00T$TRAP-Grid. ❌");
        return false;
    } else {
        var selection = context.selection;

        var hasBootstrapGrid = false;
        var temp_i = 0;
        for (var i = 0; i < selection.count(); i++) {
          if ([selection objectAtIndex: i].class() == "MSArtboardGroup") {
              displayMessageToUser(context, "❌ Please do not select an artboard. ❌");
              return false;
          }
          if ([selection objectAtIndex: i].name() == "B00T$TRAP-Grid") {
            hasBootstrapGrid = true;
            temp_i = i;
            break;
          }
        }
        if (!hasBootstrapGrid) {
          displayMessageToUser(context, "❌ Select a B00T$TRAP-Grid as a reference");
          return false;
        }

        master = setMaster([selection objectAtIndex: temp_i], temp_i);

        gridTotalWidth = master.width;
        gridColumnWidth = getColumnWidth([selection count]);

        //log(master.name + ", " + gridTotalWidth + ", " + gridColumnWidth);

        return true;
    }
}

function setMaster(myElement, myLayerNumber) {
  temp = new Object();
  temp.element = myElement;
  temp.name = temp.element.name();
  temp.width = temp.element.frame().width();
  temp.layerPosition = myLayerNumber;
  return temp;
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

function changeWidthOfSelectedElement(myValue, context) {
  if (onInitialize2(context)) {
    var selection = context.selection;
    var parent = [selection objectAtIndex: 0].parentGroup();

    var parentContainsBootstrapGrid = false;
    for (var i=0; i<= parent.treeAsDictionary().layers.length; i++) {
      if (parent.treeAsDictionary().layers[i].treeAsDictionary().name == "B00T$TRAP-Grid") {
        parentContainsBootstrapGrid = true;

        gridTotalWidth = parent.treeAsDictionary().layers[i].treeAsDictionary().frame.width;
        gridColumnWidth = getColumnWidth(0);
        break;
      }
    }
    if (parentContainsBootstrapGrid) {
      //MOVE ALL SELECTED OBJECTS
      log("Should scale now");
      for (var j = 0; j < selection.count(); j++) {
        if (myValue == "increase") {
            [selection objectAtIndex: j].frame().width = findColumnWidth(true, [selection objectAtIndex: j].frame().width(), gridColumnWidth, gridGutter);
        } else if (myValue == "decrease") {
            [selection objectAtIndex: j].frame().width = findColumnWidth(false, [selection objectAtIndex: j].frame().width(), gridColumnWidth, gridGutter);
        }
      }
    } else {
      displayMessageToUser(context, "❌ There has to be a B00T$TRAP-Grid Layer in the same folder as your selection. ❌");
    }
    displayMessageToUser(context, "✅ Selection " + myValue + "d by a single column (columnWidth: " + gridColumnWidth + ", gridGutter: " + gridGutter + " ✅) ");
  }

  /*if (onInitialize(context)) {
    var selection = context.selection;
    for (var i = 0; i < selection.count(); i++) {
      if (i != master.layerPosition) {
        if (myValue == "increase") {
          [selection objectAtIndex: i].frame().width = findColumnWidth(true, [selection objectAtIndex: i].frame().width(), gridColumnWidth, gridGutter);
        } else if (myValue == "decrease") {
          [selection objectAtIndex: i].frame().width = findColumnWidth(false, [selection objectAtIndex: i].frame().width(), gridColumnWidth, gridGutter);
        }
      }
    }
    displayMessageToUser(context, "✅ Selection " + myValue + "d by a single column (columnWidth: " + gridColumnWidth + ", gridGutter: " + gridGutter + " ✅) ");
  }*/
}

function moveSelectedElements(myDirection, context) {
  if (onInitialize2(context)) {
      var selection = context.selection;
      var parent = [selection objectAtIndex: 0].parentGroup();

      var parentContainsBootstrapGrid = false;
      for (var i=0; i<= parent.treeAsDictionary().layers.length; i++) {
        if (parent.treeAsDictionary().layers[i].treeAsDictionary().name == "B00T$TRAP-Grid") {
          parentContainsBootstrapGrid = true;

          gridTotalWidth = parent.treeAsDictionary().layers[i].treeAsDictionary().frame.width;
          gridColumnWidth = getColumnWidth(0);
          break;
        }
      }
      if (parentContainsBootstrapGrid) {
        //MOVE ALL SELECTED OBJECTS
        for (var j = 0; j < selection.count(); j++) {
          if (myDirection == "right") {
              [selection objectAtIndex: j].frame().x = [selection objectAtIndex: j].frame().x() + (gridColumnWidth + gridGutter * 2);
          } else if (myDirection == "left") {
              [selection objectAtIndex: j].frame().x = [selection objectAtIndex: j].frame().x() - (gridColumnWidth + gridGutter * 2);
          }
        }
      } else {
        displayMessageToUser(context, "❌ There has to be a B00T$TRAP-Grid Layer in the same folder as your selection. ❌");
      }
      displayMessageToUser(context, "✅ Selection moved " + myDirection + " by a single column (columnWidth: " + gridColumnWidth + ", gridGutter: " + gridGutter + ") ✅ ");
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
    console.log("width:" + temp);
    return temp;
}

/*-----------------------------------------------------------*/
//TOGGLE VISIBILITY OF ALL BOOTSTRAP GRIDS ON THAT PAGE - START
/*-----------------------------------------------------------*/
function onToggleVisibilityOfBootstrapGrids(context) {
    var subSetOfLayers_array = new Array();
    var selectLayersOfType_inContainer = function (layerType, containerLayer) {

        // Filter layers using NSPredicate
        var scope = (typeof containerLayer !== 'undefined') ? [containerLayer children] : [[doc currentPage] children],
            predicate = NSPredicate.predicateWithFormat("(className == %@)", layerType),
            layers = [scope filteredArrayUsingPredicate: predicate];

        // Deselect current selection
        //[[doc currentPage] deselectAllLayers]

        // Loop through filtered layers and select them
        var loop = [layers objectEnumerator]
        while (layer = [loop nextObject]) {
            if (layer.name() == gridGroupName) {
                subSetOfLayers_array.push(layer);
                [layer select: true byExpandingSelection: true];
            }
        }
        //log([layers count] + " " + layerType + "s found of which " + subSetOfLayers_array.length + " match");
    }

    // Select all MSLayerGroup in current page
    selectLayersOfType_inContainer("MSLayerGroup");


    if (myDictionary["bootstrapGridsAreVisible"] == true) {
      for (var i = 0; i < subSetOfLayers_array.length; i++) {
        subSetOfLayers_array[i].isVisible = false;
      }
      myDictionary["bootstrapGridsAreVisible"] = false;
    } else {
      for (var i = 0; i < subSetOfLayers_array.length; i++) {
        subSetOfLayers_array[i].isVisible = true;
        //displayMessageToUser(context, "Set visible");
      }
      myDictionary["bootstrapGridsAreVisible"] = true;
    }

}
/*-----------------------------------------------------------*/
//TOGGLE VISIBILITY OF ALL BOOTSTRAP GRIDS ON THAT PAGE - END
/*-----------------------------------------------------------*/

/*-----------------------------------
//HELPERS - START
-----------------------------------*/
//FIND LAYERS BY NAME
//function findLayersNamed_inContainer_filterByType(layerName, container, layerType) {
var findLayersNamed_inContainer_filterByType = function(layerName, container, layerType) {
    var predicate = (typeof layerType === 'undefined' || layerType == nil) ? NSPredicate.predicateWithFormat("name == %@", layerName) : NSPredicate.predicateWithFormat("name == %@ && class == %@", layerName, layerType)
    return findLayersMatchingPredicate_inContainer_filterByType(predicate, container)
}

var findLayersMatchingPredicate_inContainer_filterByType = function(predicate, container, layerType) {
    var scope;
    switch (layerType) {
        case MSPage :
            scope = doc.pages()
            return scope.filteredArrayUsingPredicate(predicate)
        break;

        case MSArtboardGroup :
            if(typeof container !== 'undefined' && container != nil) {
                if (container.className == "MSPage") {
                    scope = container.artboards()
                    return scope.filteredArrayUsingPredicate(predicate)
                }
            } else {
                // search all pages
                var filteredArray = NSArray.array()
                var loopPages = doc.pages().objectEnumerator(), page;
                while (page = loopPages.nextObject()) {
                    scope = page.artboards()
                    filteredArray = filteredArray.arrayByAddingObjectsFromArray(scope.filteredArrayUsingPredicate(predicate))
                }
                return filteredArray
            }
        break;

        default :
            if(typeof container !== 'undefined' && container != nil) {
                scope = container.children()
                return scope.filteredArrayUsingPredicate(predicate)
            } else {
                // search all pages
                var filteredArray = NSArray.array()
                var loopPages = doc.pages().objectEnumerator(), page;
                while (page = loopPages.nextObject()) {
                    scope = page.children()
                    filteredArray = filteredArray.arrayByAddingObjectsFromArray(scope.filteredArrayUsingPredicate(predicate))
                }
                return filteredArray
            }
    }
    return NSArray.array() // Return an empty array if no matches were found
}
/*-----------------------------------
//HELPERS - END
-----------------------------------*/
