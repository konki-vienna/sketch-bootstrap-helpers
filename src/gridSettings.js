/**
 * Copyright (c) 2019 *
 * Settings functionality to setup custom grids
 * @author Konstantin Demblin <konstantin.demblin@gmail.com> *
 */

 //Import helpers
 import { ShowMessage } from './helpers';
 import { debugMode } from './helpers';

 import BrowserWindow from 'sketch-module-web-view';

 const sketch = require('sketch');
 const util = require('util');
 const UI = require('sketch/ui');

 let browserWindow_gridSettings

const options = {
    identifier: 'data.gridSettings',
    width: 640,
    height: 840,
    x: 30,
    y: 200,
    minWidth: 320,
    minHeight: 576,
    resizable: false,
    alwaysOnTop: true,
    //backgroundColor: "#FF0000",
    //frame: false, // Specify false to create a Frameless Window
    show: false
}



export function onGridSettings() {
    browserWindow_gridSettings = new BrowserWindow(options)

    // only show the window when the page has loaded
    browserWindow_gridSettings.once('ready-to-show', () => {
        browserWindow_gridSettings.show()
    })
  
    const webContents = browserWindow_gridSettings.webContents
  
    // print a message when the page loads
    webContents.on('did-finish-load', () => {
      ShowMessage("info", "UI loaded")
      if (debugMode) {
        console.log("did-finish-load");
      }
      //Make call to Google Analytics
      //googleAnalytics("event", {ec: "Data", ea: "AmountSettings"})

      /*if (my_amount_settings.my_currency == undefined) {
        firstTimeSetup();
      }*/
      
      //POPULATE PLUGIN WITH PREVIOUS VALUES
      //console.log(my_amount_settings)
      //webContents.executeJavaScript(`setDefaultValues("${my_amount_settings.my_currency}", "${my_amount_settings.my_currency_prefix_radio}", "${my_amount_settings.my_currency_suffix_radio}", "${my_amount_settings.my_delimiter}", "${my_amount_settings.my_decimal}", "${my_amount_settings.my_decimal_precision}", "${my_amount_settings.my_min_value}", "${my_amount_settings.my_max_value}", "${my_amount_settings.my_apply_superscript}", "${my_amount_settings.my_positive_sign_radio}", "${my_amount_settings.my_negative_sign_radio}", "${my_amount_settings.my_negative_and_positive_sign_radio}")`)
    })

    browserWindow_gridSettings.loadURL(require('../resources/webview_gridSettings.html'))
}