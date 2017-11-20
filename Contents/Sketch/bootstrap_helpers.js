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

var myDictionary = NSThread.mainThread().threadDictionary();

function onPlayground(context) {
    //checkArtboardSettings(context);

    if (onInitialize2(context)) {
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
    displayMessageToUser(context, "❌ There is no folder named '" + gridGroupName + "' in this Artboard ❌");
  } else {
    var mySortedGrid_array = analyzeGrid(myGridFolder);

    for (var j = 0; j < selection.count(); j++) {
      //Align selected object(s) to column (if necessary)
      [selection objectAtIndex: j].frame().x = findNearestColumnXPosition([selection objectAtIndex: j].frame().x(), myGridFolder.frame.x, mySortedGrid_array);

      //Set new column width of selected object(s)
      [selection objectAtIndex: j].frame().width = findNewColumnWidth(myValue, [selection objectAtIndex: j].frame().width(), mySortedGrid_array);
    }
    displayMessageToUser(context, "✅ Object(s) " + myValue + "d by single column. ✅");
  }
}

function findNearestColumnXPosition(myElementXPosition, myGridFolderXPosition, mySortedGrid_array) {
  var index = mySortedGrid_array.length;
  while (index <= mySortedGrid_array.length) {
    if (myElementXPosition >= mySortedGrid_array[index-1][0]) {
      return (myGridFolderXPosition + mySortedGrid_array[index-1][0]);
    } else {
      if (index > 1) {
          index--;
      }
    }
  }
  return myElementXPosition;
}

function findNewColumnWidth(myValue, myElementWidth, mySortedGrid_array) {
  //var additionalSpace;
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
    displayMessageToUser(context, "❌ There is no folder named '" + gridGroupName + "' in this Artboard ❌");
  } else {
    var mySortedGrid_array = analyzeGrid(myGridFolder);

    for (var j = 0; j < selection.count(); j++) {
      //Set new column x-Position of selected object(s)
      [selection objectAtIndex: j].frame().x = findNewColumnPosition(myDirection, [selection objectAtIndex: j].frame().x(), myGridFolder.frame.x, mySortedGrid_array);
    }
    displayMessageToUser(context, "✅ Object(s) moved to the " + myDirection + " by single column. ✅");
  }
}

function findNewColumnPosition(myDirection, myElementXPosition, myGridFolderXPosition, mySortedGrid_array) {
  var possibleNewXPosition;
  var index;
  if (myDirection == "right") {
      index = 1;
      while(index < mySortedGrid_array.length && myElementXPosition >= myGridFolderXPosition + mySortedGrid_array[index-1][0]) {
        index++;
      }
      possibleNewWidth = myGridFolderXPosition + mySortedGrid_array[index-1][0];
  } else if (myDirection == "left") {
      index = mySortedGrid_array.length;
      while (index > 1 && myElementXPosition <= myGridFolderXPosition + mySortedGrid_array[index-1][0]) {
        if (index > 1) {
            index--;
        }
      }
      possibleNewWidth = (myGridFolderXPosition + mySortedGrid_array[index-1][0]);
  }
  return possibleNewWidth;
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
function onInitialize2(context) {
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
  for (var i=0; i<myGridFolder.layers.length; i++) {
    myGrid_array.push([myGridFolder.layers[i].frame.x, myGridFolder.layers[i].frame.width]);
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
  if (onInitialize2(context)) {
    var selection = context.selection;
    var parent = [selection objectAtIndex: 0].parentGroup();

    var parentContainsBootstrapGrid = false;
    do {
       for (var i=0; i<parent.treeAsDictionary().layers.length; i++) {
         //log(+ i + ", " + parent.class());
         if (parent.treeAsDictionary().layers[i].treeAsDictionary().name == gridGroupName) {
             // CONTAINS GRID
             parentContainsBootstrapGrid = true;
             gridTotalWidth = parent.treeAsDictionary().layers[i].treeAsDictionary().frame.width;
             gridColumnWidth = getColumnWidth(0);
             return parent.treeAsDictionary().layers[i];
         }
       }
       parent = parent.parentGroup();
    } while (parentContainsBootstrapGrid = false || parent.class() != "MSPage");

    return false;
  }
}
/*-----------------------------------
//HELPERS - END
-----------------------------------*/
