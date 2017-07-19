@import 'common.js'
var doc;
var selection;
var selectedElement;
var context;
var bootstrapSize;
var artboard;
var artboardName;
var artboardWith;
var artboardIndex;

function onPlayground(context) {
    checkArtboardSettings(context);
}

function onSetBootstrapGrid(context) {
    checkArtboardSettings(context);
    if (bootstrapSize == "xs") {
        selectedElement.frame().width = artboard.frame().width();
        selectedElement.frame().x = 0;
    } else if (bootstrapSize == "md") {
        selectedElement.frame().width = 720;
        selectedElement.frame().x = (artboard.frame().width() - selectedElement.frame().width()) * 0.5;
    } else if (bootstrapSize == "lg") {
        selectedElement.frame().width = 960;
        selectedElement.frame().x = (artboard.frame().width() - selectedElement.frame().width()) * 0.5;
    } else if (bootstrapSize == "xl") {
        selectedElement.frame().width = 1170;
        selectedElement.frame().x = (artboard.frame().width() - selectedElement.frame().width()) * 0.5;
    } else {
        displayMessageToUser(context, "❌ Something went wrong. ❌");
    }
    
}

function checkArtboardSettings (context) {
    selection = context.selection;
    selectedElement = nil;
    
    if ([selection count] == 0) {
        displayMessageToUser(context, "❌ Please select an element. ❌");
    } else {
        context = context;
        doc = NSDocumentController.sharedDocumentController().currentDocument();
        
        selectedElement = [selection objectAtIndex:0];
        
        if (selectedElement.class() == "MSArtboardGroup") {
            displayMessageToUser(context, "❌ Please select an element and not an artboard. ❌");
        } else {
            bootstrapSize;
            artboard = selectedElement.parentArtboard();
            artboardName = artboard.name();
            artboardWith = artboard.frame().width();
            pageName = artboard.parentPage().name();
            artboardIndex = artboard.parentPage().artboards().indexOf(artboard) + 1;

            //log(artboardName + ", " + artboard.frame().width() + ", " + artboard.frame().height());
            
            if (artboardWith > 0 && artboardWith <= 575) {
                bootstrapSize = "xs";
            } else if (artboardWith >= 576 && artboardWith <= 767) {
                bootstrapSize = "sm";                
            } else if (artboardWith >= 768 && artboardWith <= 991) {
                bootstrapSize = "md";                
            } else if (artboardWith >= 992 && artboardWith <= 1199) {
                bootstrapSize = "lg";                
            } else if (artboardWith >= 1200) {
                bootstrapSize = "xl";                
            } else {
                bootstrapSize = "unknown";
            }
            displayMessageToUser(context, "✅ bootstrapSize: " + bootstrapSize + " ✅")
        }
    }
}