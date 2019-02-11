const sketch = require('sketch')

// Display Alert Window in Sketch
/*function alert(title, message){
  var app = [NSApplication sharedApplication];
  [app displayDialog:message withTitle:title];
}*/

// Display single line user feedback text at the bottom of sketch window
export function displayMessageToUser(context, message_str) {
    sketch.UI.message(message_str)
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