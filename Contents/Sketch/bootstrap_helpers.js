@import 'common.js'
var doc = NSDocumentController.sharedDocumentController().currentDocument(); //context.document;
//var context;
var bootstrapSize;
var gridTotalWidth;
var gridColumnWidth;
var gridGutter = 15;
var gridGroupName = "CU$T0M-GR1D";
var myFillColor = "#FF33CC59"; //100% — FF, 95% — F2, 90% — E6, 85% — D9, 80% — CC, 75% — BF, 70% — B3, 65% — A6, 60% — 99, 55% — 8C, 50% — 80, 45% — 73, 40% — 66, 35% — 59, 30% — 4D, 25% — 40, 20% — 33, 15% — 26, 10% — 1A, 5% — 0D, 0% — 00
var master;

var myDictionary = NSThread.mainThread().threadDictionary();

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

function drawBootstrapGrid (context, myHasOuterGutter) {
    var selection = context.selection;

    if ([selection count] == 1) {
      log("selection count: " + [selection count]);
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
  // SKETCH 52.x OR LOWER
  if (typeof MSShapeGroup.shapeWithPath === "function") {
    var shapeGroup = MSShapeGroup.shapeWithPath(rectShape);
    var fill = shapeGroup.style().addStylePartOfType(0);
    fill.color = MSImmutableColor.colorWithSVGString(myFillColor);

    shapeGroup.frame().constrainProportions = false; // Set to `true` if you want shape to be constrained.
    shapeGroup.setName(myName);

    return shapeGroup;
  }
  //SKETCH 53 OR HIGHER
  else {
    var fill = rectShape.style().addStylePartOfType(0);
    fill.color = MSImmutableColor.colorWithSVGString(myFillColor);

    rectShape.frame().constrainProportions = false; // Set to `true` if you want shape to be constrained.
    rectShape.setName(myName);

    return rectShape;
  }
  return;
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

function setMaster(myElement, myLayerNumber) {
  temp = new Object();
  temp.element = myElement;
  temp.name = temp.element.name();
  temp.width = temp.element.frame().width();
  temp.layerPosition = myLayerNumber;
  return temp;
}
/*----------------------------------*/
//DRAWS A BOOTSTRAP GRID - END
/*----------------------------------*/

/*--------------------------------------------*/
//CHANGE WIDTH OF SELECTED ELEMENT(S) - START
/*--------------------------------------------*/
//INCREASES SELECTION BY A CUSTOM COLUMN
function onIncreaseCustomByOne(context) {
  changeWidthOfSelectedElementByCustomColumn("increase", context);
}

//DECREASES SELECTION BY A CUSTOM COLUMN
function onDecreaseCustomByOne(context) {
  changeWidthOfSelectedElementByCustomColumn("decrease", context);
}

function changeWidthOfSelectedElementByCustomColumn(myValue, context) {
  var selection = context.selection;
  var myGridFolder = findGridFolder(context);
  if (myGridFolder == false) {
    displayMessageToUser(context, "❌ There is no folder named '" + gridGroupName + "' as an ancestor of this selection. ❌");
  } else {
    var myMessageStatus = "okay";
    var mySortedGrid_array = analyzeGrid(myGridFolder);

    var myTemp_x;
    var myTemp_column;
    for (var j = 0; j < selection.count(); j++) {
      //Align selected object(s) to column (if necessary)
      var myFindNearestColumn = findNearestColumnXPosition([selection objectAtIndex: j], myGridFolder, mySortedGrid_array);
      myTemp_x = myFindNearestColumn[0];
      myTemp_column = myFindNearestColumn[1];
      [selection objectAtIndex: j].frame().x = myTemp_x;
      //RELOAD UI
      context.document.reloadInspector();
      //RESIZE ALL PARENT FOLDERS TO FIT
      resizeAllParentFoldersToFit(context);

      var myNumberOfCoveredColumns = getNumberOfCoveredColumns([selection objectAtIndex: j], myTemp_column, myGridFolder, mySortedGrid_array);
      if (myValue == "increase") {
        if ((myTemp_column - 1) + (myNumberOfCoveredColumns + 1) <= mySortedGrid_array.length) {
          //log("Currently cover " + myNumberOfCoveredColumns + " columns (starting at column " + myTemp_column + "), should cover " + (myNumberOfCoveredColumns + 1) + " columns");
          //Set new column width of selected object(s)
          [selection objectAtIndex: j].frame().width = getColumnWidthByStartAndNumberOfColumns(myTemp_column, myNumberOfCoveredColumns + 1, mySortedGrid_array);
        } else {
          myMessageStatus = "tooWide"
        }
      } else if (myValue == "decrease") {
        if ((myNumberOfCoveredColumns - 1) > 0) {
          //log("Currently cover " + myNumberOfCoveredColumns + " columns (starting at column " + myTemp_column + "), should cover " + (myNumberOfCoveredColumns - 1) + " columns");
          //Set new column width of selected object(s)
          [selection objectAtIndex: j].frame().width = getColumnWidthByStartAndNumberOfColumns(myTemp_column, myNumberOfCoveredColumns - 1, mySortedGrid_array);

        } else {
          myMessageStatus = "tooSmall";
        }
      }

      //Set new column width of selected object(s)
      [selection objectAtIndex: j].frame().width = getColumnWidthByStartAndNumberOfColumns

      //RELOAD UI
      context.document.reloadInspector();
      //RESIZE ALL PARENT FOLDERS TO FIT
      resizeAllParentFoldersToFit(context);
    }
    if (myMessageStatus == "okay") {
      displayMessageToUser(context, "✅ Object(s) " + myValue + "d by single column. ✅");
    } else if (myMessageStatus == "tooSmall") {
      displayMessageToUser(context, "❌ Your selection cannot get any smaller. ❌");
    } else if (myMessageStatus == "tooWide") {
      displayMessageToUser(context, "❌ Your selection cannot get any wider. ❌");
    }

  }
}

function getColumnWidthByStartAndNumberOfColumns(myStartColumn, myNumberOfColumns, mySortedGrid_array) {
  if (myStartColumn == 0)
  {
    myStartColumn = 1;
  }
  var myColumnWidths = mySortedGrid_array[myStartColumn-1 + myNumberOfColumns-1][0] + mySortedGrid_array[myStartColumn-1 + myNumberOfColumns-1][1] - mySortedGrid_array[myStartColumn-1][0];
  return myColumnWidths;
}

function getNumberOfCoveredColumns(myLayer, myStartColumn, myGridFolder, mySortedGrid_array) {
  if (myStartColumn == 0)
  {
    myStartColumn = 1;
  }
  var myColumnWidths;
  var myCoveredColumns = 0;
  for (var i = myStartColumn - 1; i<mySortedGrid_array.length; i++) {
    myColumnWidths = (mySortedGrid_array[i][0] + mySortedGrid_array[i][1] - mySortedGrid_array[myStartColumn - 1][0]);
    myCoveredColumns++;
    if (myLayer.frame().width() <= myColumnWidths) {
      return myCoveredColumns;
    }
  }
}

function findNearestColumnXPosition(myLayer, myGridFolder, mySortedGrid_array) {
  log("findNearestColumnXPosition");
  var myCurrentPosition = myLayer.frame().x();
  var myCurrentRelativePosition = getPositionRelativeToArtboard("x", myLayer);
  var myGridFolderRelativePosition = getPositionRelativeToArtboard("x", myGridFolder);
  var myLayersParentGroupRelativePosition;

  if (myLayer.parentGroup().className() != "MSArtboardGroup") {
    var myLayersParentGroupRelativePosition = getPositionRelativeToArtboard("x", myLayer.parentGroup());
  } else {
    myLayersParentGroupRelativePosition = 0;
  }

  var myColumnRelativePosition;
  var myNewPosition;
  for (var i=mySortedGrid_array.length; i>0; i--) {
    if (myCurrentRelativePosition == (myGridFolderRelativePosition + mySortedGrid_array[i-1][0])) {
      myNewPosition = myCurrentRelativePosition - myLayersParentGroupRelativePosition;
      //log("myNewPosition == " + myNewPosition);
      break;
    } else if (myCurrentRelativePosition > (myGridFolderRelativePosition + mySortedGrid_array[i-1][0])) {
      myColumnRelativePosition = getPositionRelativeToArtboard("x", myGridFolder.layers()[i-1]);
      //log("myColumnRelativePosition: " + myColumnRelativePosition);
      myNewPosition = myColumnRelativePosition - myLayersParentGroupRelativePosition;
      //log("myNewPosition > " + myNewPosition);
      break;
    } else {
      myColumnRelativePosition = getPositionRelativeToArtboard("x", myGridFolder.layers()[i-1]);
      //log("myColumnRelativePosition: " + myColumnRelativePosition);
      myNewPosition = myGridFolderRelativePosition - (myLayersParentGroupRelativePosition);
    }
  }
  return [myNewPosition, i];
}

function getPositionRelativeToArtboard(myValue, myLayer) {
  //myValue must be either "x" or "y"
  return myLayer.absoluteRect()[myValue]() - getElementsArtboard(myLayer).frame()[myValue]();
}

function getElementsArtboard(myLayer) {
  var myArtboard = myLayer;
  log(myLayer.name());
  do {
     myArtboard = myArtboard.parentGroup();
  } while (myArtboard.class() != "MSArtboardGroup");
  return myArtboard;
}

function findNewColumnWidth(myValue, myElementWidth, mySortedGrid_array) {
  var possibleNewWidth;
  var index;
  if (myValue == "increase") {
      index = 1;
      while(index < mySortedGrid_array.length && myElementWidth >= mySortedGrid_array[index-1][0] + mySortedGrid_array[index-1][1]) {
        index++;
      }
      possibleNewWidth = mySortedGrid_array[index-1][0] + mySortedGrid_array[index-1][1];
  } else if (myValue == "decrease") {
    index = mySortedGrid_array.length;
    while (index > 1 && myElementWidth <= mySortedGrid_array[index-1][0] + mySortedGrid_array[index-1][1]) {
      if (index > 1) {
          index--;
      }
    }
    possibleNewWidth = mySortedGrid_array[index-1][0] + mySortedGrid_array[index-1][1];
  }
  return possibleNewWidth;
}
/*--------------------------------------------*/
//CHANGE WIDTH OF SELECTED ELEMENT(S) - END
/*--------------------------------------------*/

/*----------------------------------*/
//MOVE SELECTED ELEMENT(S) - START
/*----------------------------------*/
function onMoveRightCustomByOne(context) {
  moveSelectedElementsByCustomColum("right", context);
}

function onMoveLeftCustomByOne(context) {
  moveSelectedElementsByCustomColum("left", context);
}

function moveSelectedElementsByCustomColum(myDirection, context) {
  var selection = context.selection;
  var myGridFolder = findGridFolder(context);
  if (myGridFolder == false) {
    displayMessageToUser(context, "❌ There is no folder named '" + gridGroupName + "' as an ancestor of this selection. ❌");
  } else {
    var mySortedGrid_array = analyzeGrid(myGridFolder);
    var myTemp_x;
    var myTemp_column;
    var myXPositionOffset;
    var myMessageStatus = "okay";

    for (var j = 0; j < selection.count(); j++) {
      var myFindNearestColumn = findNearestColumnXPosition([selection objectAtIndex: j], myGridFolder, mySortedGrid_array);
      myTemp_x = myFindNearestColumn[0];
      myTemp_column = myFindNearestColumn[1];
      [selection objectAtIndex: j].frame().x = myTemp_x;
      //RELOAD UI
      context.document.reloadInspector();
      //RESIZE ALL PARENT FOLDERS TO FIT
      resizeAllParentFoldersToFit(context);

      if (myDirection == "right") {
        if (myTemp_column != mySortedGrid_array.length) {
          myXPositionOffset = mySortedGrid_array[(myTemp_column)][0] - mySortedGrid_array[(myTemp_column - 1)][0];
          [selection objectAtIndex: j].frame().x = [selection objectAtIndex: j].frame().x() + myXPositionOffset;
        } else {
          var myMessageStatus = "tooFarRight";
        }
      } else if (myDirection == "left") {
        if (myTemp_column != 1) {
          myXPositionOffset = mySortedGrid_array[(myTemp_column-2)][0] - mySortedGrid_array[(myTemp_column - 1)][0];
          [selection objectAtIndex: j].frame().x = [selection objectAtIndex: j].frame().x() + myXPositionOffset;
        } else {
          var myMessageStatus = "tooFarLeft";
        }
      }

      //RELOAD UI
      context.document.reloadInspector();

      //RESIZE ALL PARENT FOLDERS TO FIT
      resizeAllParentFoldersToFit(context);
    }
    if (myMessageStatus == "okay") {
      displayMessageToUser(context, "✅ Object(s) moved to the " + myDirection + " by single column. ✅");
    } else if (myMessageStatus == "tooFarLeft") {
      displayMessageToUser(context, "❌ You cannot move your selection any further to the left. ❌");
    } else if (myMessageStatus == "tooFarRight") {
      displayMessageToUser(context, "❌ You cannot move your selection any further to the right. ❌");
    }
  }
}
/*----------------------------------*/
//MOVE SELECTED ELEMENT(S) - END
/*----------------------------------*/

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
function onInitialize(context) {
  var selection = context.selection;
  if ([selection count] == 0) {
    displayMessageToUser(context, "❌ Please select one or more elements ❌");
    return false;
  } else {
    //LOOK IF SOMETHING IS AN ARTBOARD OR AN B00T$TRAP-Grid
    for (var i = 0; i < selection.count(); i++) {
      if ([selection objectAtIndex: i].class() == "MSArtboardGroup" || [selection objectAtIndex: i].name() == gridGroupName) {
          displayMessageToUser(context, "❌ Please do not select an artboard or a folder named B00T$TRAP-Grid. ❌");
          return false;
      }
    }
    return true;
  }
}

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

//FOR MODIFICATION OF SELECTED ELEMENTS
function analyzeGrid(myGridFolder) {
  var myGrid_array = new Array();
  //Put Grid Data (x and width) in two dimensional array
  for (var i=0; i<myGridFolder.layers().length; i++) {
    myGrid_array.push([myGridFolder.layers()[i].frame().x(), myGridFolder.layers()[i].frame().width()]);
  }
  //Sort Grid Data (x positions) ascending
  myGrid_array.sort(sortFunction);
  function sortFunction(a, b) {
      if (a[0] === b[0]) {
          return 0;
      }
      else {
          return (a[0] < b[0]) ? -1 : 1;
      }
  }
  return myGrid_array;
}

function findGridFolder(context) {
  if (onInitialize(context)) {
    var selection = context.selection;
    var parent = [selection objectAtIndex: 0].parentGroup();

    var parentContainsBootstrapGrid = false;
    do {
       for (var i=0; i<parent.layers().length; i++) {
         if (parent.layers()[i].name() == gridGroupName) {
             // CONTAINS GRID
             parentContainsBootstrapGrid = true;
             gridTotalWidth = parent.layers()[i].frame().width();
             gridColumnWidth = getColumnWidth(0);
             return parent.layers()[i];
         }
       }
       parent = parent.parentGroup();
    } while (parentContainsBootstrapGrid = false || parent.class() != "MSPage");

    return false;
  }
}

function resizeAllParentFoldersToFit(context) {
  if (onInitialize(context)) {
    var selection = context.selection;
    var parent = [selection objectAtIndex: 0].parentGroup();
    //log(parent.frame().width());
    parent.resizeToFitChildrenWithOption(1);
    //log(parent.name());
    do {
       parent = parent.parentGroup();

       //log(parent.frame().width());
       parent.resizeToFitChildrenWithOption(1);
       //log(parent.frame().width());
    } while (parent.class() != "MSPage");
  }
}
/*-----------------------------------
//HELPERS - END
-----------------------------------*/
