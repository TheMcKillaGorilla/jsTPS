# jsTPS - A JavaScript Transaction Processing System

The jsTPS framework provides an easy to use transaction processing system
to assist in the creation of undo/redo systems for JavaScript. Note, the 
framework uses an ES Modules format.<br />
<br />

## Front-End Usage

Your application would generally only need one TPS. To start you'll need to create your jsTPS object, so 
depending on where you put it you'll need to first import it. For example, if for a Web page root you have a
js directory you might write:
```js
import { jsTPS } = './js/jstps/index.js'
let tps = new jsTPS();
```
You would then adjust that path relative to the file making use of it and where you choose to place it in
your own directory structure. 

## Node Installation

Note that this library can be used in any JavaScript context. To make use of the <strong>jsTPS</strong> framework in your <strong>Node</strong> application you should install it using:

```bash
npm install jstps
```
<br />

## Custom Transactions

Note that you will need to define your own transactions for whatever it is that your
application aims to do and undo. To do so, define a class that extends <code>jsTPS_Transaction</code>
and override the <code>executeDo</code> and <code>executeUndo</code> functions. Also note that this
library does not currently do anything to help coordinate anything asynchronous. So, if your transactions will
be executing asynchronous do or undo functionality you'll need to manage that yourself. As an example, if we 
assume that you have defined a class that represents a transaction called <code>MyTransaction</code>, which
will be updating the state of some object (we'll just call it <strong>itemToUpdate</strong>), we might say
that we have an event handler that listens for user interactions and when they occur gathers the data associated
with the event in <strong>changeData</strong> and send it to our transaction, which of course it will use
to update <strong>itemToUpdate</strong> when the <code>executeDo</code> is performed and undone when
<code>executeUndo</code> is performed. So use of these methods is as easy as:

```js
// IN AN EVENT HANDLER 
let transaction = new MyTransaction(itemToUpdate, changeData);
tps.processTransaction(transaction);
```
When the user presses an undo button, we might respond with:
```js
tps.undoTransaction();
```
When the user presses an redo button, we might respond with:

```js
tps.redoTransaction();
```
Also note that the principle of <strong>Foolproof Design</strong> says one should not tempt
the user with choices that are not selectable, so one should disable undo and redo buttons
when those functions are not usable as there are no transactions to do or undo. For this, we might
do something like:
```js
document.getElementById("undo-button").disabled = !tps.hasTransactionToUndo();
document.getElementById("redo-button").disabled = !tps.hasTransactionToRedo();
```
<br />

## Package Contents

Note that as a public repository, you are free to download and examine the <strong>jsTPS</strong> 
package, which really has three components:<br />
<br />
<ol>
 <li><strong>Framework Source Code</strong> - the <code>jsTPS</code> &amp; <code>jsTPS_Transaction</code> classes
 are the framework and are defined inside <strong>index.js</strong> in the package's root directory.<br /><br /></li>
 <li><strong>Demo</strong> - found in <code>./bin/demo.js</code>, this demonstrates use of the
 framework in a runnable example.<br /><br /></li>
 <li><strong>Tests</strong> - found in <code>./test/test.js</code>, this contains Vitest Unit tests
 that verify the framework is in proper working order.<br /><br /></li>
</ol>

## Running the Demo

Note that the <strong>jsTPS</strong> package contains a demo script that shows you how you
might define your own transactions for the purpose of undo/redo in a JavaScript application.
If you have installed the package for use in your program, you can run the demo using:
```bash
node .\node_modules\jstps\bin\demo.js
```
Or if you have forked the repository you can simply use the following from the root directory:
```bash
node .\\bin\demo.js
```
This will open a menu of choices where you can update an object which will be done using
transactions. You can then undo and redo those transactions and the menu employs foolproof
design such that undo and redo are only provided as options if they can be used.<br />
<br />

## Running Tests

Should you fork (or download) the <strong>jsTPS</strong> project you can also run tests that
ensure the API does everything it indends. To run these tests, make sure <a href='https://vitest.dev/'>Vitest</a> is installed and
then run the tests using:
```bash
npm test
```
<br />

## License

This project is licensed under the GNU General Public License v3.0.

You may copy, modify, and distribute this software under the terms of the GPL-3.0. Any derivative works must also be licensed under the GPL-3.0 and include source code when distributed.

See the full license text at [GNU GPL v3.0](https://www.gnu.org/licenses/gpl-3.0.en.html).