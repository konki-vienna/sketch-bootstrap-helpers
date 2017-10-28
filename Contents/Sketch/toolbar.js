@import "MochaJSDelegate.js";

/*-------------------------------------------------*/
//OPENS TOOLBAR WINDOW - END
/*-------------------------------------------------*/
function onToolbar(context) {
  var panelWidth = 80;
  var panelHeight = 240;

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
  panel.standardWindowButton(NSWindowMiniaturizeButton).setHidden(true);
  panel.standardWindowButton(NSWindowZoomButton).setHidden(true);

  // Create the blurred background
  var vibrancy = NSVisualEffectView.alloc().initWithFrame(NSMakeRect(0, 0, panelWidth, panelHeight));
  vibrancy.setAppearance(NSAppearance.appearanceNamed(NSAppearanceNameVibrantLight));
  vibrancy.setBlendingMode(NSVisualEffectBlendingModeBehindWindow);

  // Create the WebView with a request to a Web page in Contents/Resources/
  var webView = WebView.alloc().initWithFrame(NSMakeRect(0, 0, panelWidth, panelHeight - 44));
  var request = NSURLRequest.requestWithURL(context.plugin.urlForResourceNamed("webView.html"));
  webView.mainFrame().loadRequest(request);
  webView.setDrawsBackground(false);

  // Access the Web page's JavaScript environment
  var windowObject = webView.windowScriptObject();

  // Create the delegate
  var delegate = new MochaJSDelegate({

    // Listen to the page loading state
    "webView:didFinishLoadForFrame:": (function(webView, webFrame) {

      // Get the current selection
      var selection = context.selection;

      if (selection.length == 1) {

        // Send the CSS attributes as a string to the Web page
        windowObject.evaluateWebScript("updatePreview('" + selection[0].CSSAttributes().join(" ") + "')");
      } else {

        // Or send an empty string to the Web page
        windowObject.evaluateWebScript("updatePreview(' ')");
      }
    }),

    // Listen to URL changes
    "webView:didChangeLocationWithinPageForFrame:": (function(webView, webFrame) {

      // Extract the URL hash (without #) by executing JavaScript in the Web page
      var hash = windowObject.evaluateWebScript("window.location.hash.substring(1)");

      // Parse the hash's JSON content
      var data = JSON.parse(hash);

      // Launch a Sketch action and focus the main window
      context.document.actionsController().actionForID(data.action).doPerformAction(null);
      NSApp.mainWindow().makeKeyAndOrderFront(null);
    })
  })

  // Set the delegate on the WebView
  webView.setFrameLoadDelegate_(delegate.getClassInstance());

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

var onSelectionChanged = function(context) {
  var threadDictionary = NSThread.mainThread().threadDictionary();
  var identifier = "co.awkward.floatingexample";

  // Check if there's a panel opened or not
  if (threadDictionary[identifier]) {
    var panel = threadDictionary[identifier];

    // Access the panel from the reference and the WebView
    var webView = panel.contentView().subviews()[1];
    var windowObject = webView.windowScriptObject();

    // Get the current selection and update the CSS preview accordingly
    var selection = context.actionContext.document.selectedLayers().layers();
    if (selection.length == 1) {
      windowObject.evaluateWebScript("updatePreview('" + selection[0].CSSAttributes().join(" ") + "')");
    } else {
      windowObject.evaluateWebScript("updatePreview(' ')");
    }
  }
};
/*-------------------------------------------------*/
//OPENS TOOLBAR WINDOW - END
/*-------------------------------------------------*/
