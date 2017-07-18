@import 'common.js'
var doc;
var selection;
var context;

function onPlayground(context) {
    log("onPlayground");
    selection = context.selection;
    var selectedElement = nil;
    
    if ([selection count] == 0) {
        displayMessageToUser(context, "❌ Please select an element. ❌");
    } else {
        context = context;
        doc = NSDocumentController.sharedDocumentController().currentDocument();
        
        selectedElement = [selection objectAtIndex:0];
        /*var pageName = artboard.parentPage().name();
        var artboardIndex = artboard.parentPage().artboards().indexOf(artboard) + 1;
        var artboardName = artboard.name();*/
        log(selectedElement.parent);
        displayMessageToUser(context, "✅ Selected element " + selectedElement + " ✅");
    }
}