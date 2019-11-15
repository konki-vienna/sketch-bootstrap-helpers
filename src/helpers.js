/**
 * Copyright (c) 2019 *
 * A collection of helper functions
 * @author Konstantin Demblin <konstantin.demblin@gmail.com> *
 */

 export let debugMode = true

const sketch = require('sketch')

export function ShowMessage(type, myMessage, autoClose) {
  var myEmoji = ""
  
  if (type == "success") {
    myEmoji = "🙌"
  } else if (type == "error") {
    myEmoji = "❌"
  } else if (type == "info") {
    myEmoji = "ℹ️"
  } else if (type == "warning") {
    myEmoji = "⚠️"
  }

  //TODO: Fix because as soon as I comment in the var "document" - the data plugin has an issue.
  autoClose = true

  if (autoClose == true || autoClose == undefined) {
    sketch.UI.message(myEmoji + " " + myMessage + " " + myEmoji)
  } else {
    //Display success message
    var temp_msg = (myEmoji + " " + myMessage + " " + myEmoji)//"🙌 " + layers.length + " icons have been exported to " + exportOptions.output + " as " + exportOptions.formats + ". 🙌"
    context.document.currentContentViewController().flashController().displayMessage_userClosable_helpBlock(temp_msg, true, nil)
  }  
}

// Write layer attributes to alert window
function logLayerAttributes(myLayer) {
    var layerClass = myLayer.class();
    var layerFrame = myLayer.frame();
    var layerStyle = myLayer.style();
    var layerName = myLayer.name();
    var layerIsVisible = myLayer.isVisible();
    var layerIsLocked = myLayer.isLocked();
    var layerIsFlippedHorizontal = myLayer.isFlippedHorizontal();
    var layerIsVertical = myLayer.isFlippedVertical();
    var layerRotation = myLayer.rotation();
    var layerParent = myLayer.parentGroup();
    var layerIsSelected = myLayer.isSelected();
    var layerAbsoluteRect = myLayer.absoluteRect();
    var layerUserInfo = myLayer.userInfo();
    var layerCSSAttributeString = myLayer.CSSAttributeString();
    var layerCSSAttributes = myLayer.CSSAttributes();    
    var layerRect = myLayer.absoluteRect();
    var layerXpos = String(layerRect.x());
    var layerYpos = String(layerRect.y());
    var layerHeight = String(layerRect.height());
    var layerWidth = String(layerRect.width());
    
    alert("LayerAttributes", "layerClass: " + layerClass +
                      "\r layerFrame: " + layerFrame +
                      "\r layerStyle: " + layerStyle +
                      "\r layerName: " + layerName +
                      "\r layerIsVisible: " + layerIsVisible +
                      "\r layerIsLocked: " + layerIsLocked +
                      "\r layerIsFlippedHorizontal: " + layerIsFlippedHorizontal +
                      "\r layerIsVertical: " + layerIsVertical +
                      "\r layerRotation: " + layerRotation +
                      "\r layerParent: " + layerParent +
                      "\r layerIsSelected: " + layerIsSelected +
                      "\r layerAbsoluteRect: " + layerAbsoluteRect +
                      "\r layerUserInfo: " + layerUserInfo +
                      "\r layerCSSAttributeString: " + layerCSSAttributeString +
                      "\r layerCSSAttributes: " + layerCSSAttributes +
                      "\r layerRect: " + layerRect +
                      "\r layerXpos: " + layerXpos +
                      "\r layerYpos: " + layerYpos +
                      "\r layerHeight: " + layerHeight +
                      "\r layerWidth: " + layerWidth);
}