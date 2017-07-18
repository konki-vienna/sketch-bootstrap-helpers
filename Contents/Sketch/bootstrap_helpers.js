@import 'common.js'
var doc;
var selection;
var context;

function onPlayground(context) {
    selection = context.selection;
    var selectedElement = nil;
    
    if ([selection count] == 0) {
        displayMessageToUser(context, "❌ Please select an element. ❌");
    } else {
        context = context;
        doc = NSDocumentController.sharedDocumentController().currentDocument();
        
        selectedElement = [selection objectAtIndex:0];
        
        if (selectedElement.class() == "MSArtboardGroup") {
            displayMessageToUser(context, "❌ Please select an element and not an artboard. ❌");
        } else {
            var artboard = selectedElement.parentArtboard();
            var artboardName = artboard.name();
            var pageName = artboard.parentPage().name();
            var artboardIndex = artboard.parentPage().artboards().indexOf(artboard) + 1;

            log(artboardName + ", " + artboard.frame().width() + ", " + artboard.frame().height());
            
            displayMessageToUser(context, "✅ \"" + artboardName  + "\" (" + artboard.frame().width() + "|" + artboard.frame().height() + ") ✅");
        
            //logLayerAttributes(selectedElement);
        }
    }
}