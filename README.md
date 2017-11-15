# Bootstrap helpers :gem:
A plugin to help working with bootstrap grids in Sketch

## Download
Download [here](https://github.com/konki-vienna/sketch-bootstrap-helpers/tree/master/versions), extract zip-file and double click on 'BootstrapHelpers.sketchplugin'

## Functionality

### 1. Draw a bootstrap grid
![Draw Grid](https://github.com/konki-vienna/sketch-bootstrap-helpers/raw/master/img/createGrid.gif "Draw Grid")
1. Select an artboard or layer
2. Select `Grid without outer gutter` (<kbd>CTRL</kbd> + <kbd>Shift</kbd>+ <kbd>0</kbd>) or `Grid with outer gutter` (<kbd>CTRL</kbd> + <kbd>Shift</kbd>+ <kbd>CMD</kbd> + <kbd>0</kbd>)  

### 2. Move and in-/decrease width of layers according to the bootstrap grid
General idea: when you want to move or de-/increase the size of one ore several selected objects according to a Bootstrap layer, you have to take into account that the selected layer(s) relate to a folder with a Bootstrap grid ("B00T$TRAP-Grid") that is a sibling of the selected layer(s).
![Move or de-/increase layer(s)](https://github.com/konki-vienna/sketch-bootstrap-helpers/raw/master/img/moveIncreaseElement.gif "Move or de-/increase layer(s)")
* Move selected layer(s) left (Shortcut: <kbd>CTRL</kbd> + <kbd>Shift</kbd>+ <kbd>←</kbd>)
* Move selected layer(s) right (<kbd>CTRL</kbd> + <kbd>Shift</kbd>+ <kbd>→</kbd>)
* Increase selected layer(s) in width (<kbd>CTRL</kbd> + <kbd>Shift</kbd>+ <kbd>+</kbd>)
* Decrease selected layer(s) in width (<kbd>CTRL</kbd> + <kbd>Shift</kbd>+ <kbd>-</kbd>)

### 3. Toggle visibility of the bootstrap grid(s)
* Un-/Hide (`CMD` + <kbd>Shift</kbd>+ <kbd>1</kbd>)

## Ideas for improvement
* Add UI to adjust
** Grid color/opacity
** Grid tiers
** Gutter width
** Amount of columns (?)
* Functionality to left/right align layer(s) to grid/to each other
* ...

## Compatibility
The plugin is compatible with Sketch 4+.

<a href="http://bit.ly/SketchRunnerWebsite">
    <img src="http://bit.ly/RunnerBadgeBlue">
</a>

## Donations
If this project helps you, you can invite me on a :coffee: ;) Or share it via social media.

Thank you!

[![paypal](https://www.paypalobjects.com/en_GB/i/btn/btn_donate_SM.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=L85KKXEFFH6HE)

## Contact
If you have any questions or troubles with our product, please feel free to open an issue [here](https://github.com/konki-vienna/sketch-bootstrap-helpers/issues).
But be aware that I have unfortunately very limited resources to work on that plugin.


# Licence
The MIT License (MIT)

Copyright 2017 Konstantin Demblin

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
