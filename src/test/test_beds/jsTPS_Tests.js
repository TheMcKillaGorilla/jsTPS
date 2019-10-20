import { jsTPS } from "../../jsTPS.js"
import { AddToNum_Transaction } from "../demo/AddToNum_Transaction.js"
import { AndMask_Transaction } from "../demo/AndMask_Transaction.js"
import { Num } from "../demo/Num.js"
import { OrMask_Transaction } from "../demo/OrMask_Transaction.js"

export class jsTPS_Tests {
    constructor(outputTextArea) {
        this.outputTextArea = document.getElementById(outputTextArea);
        this.numTests = 0;
        this.failedTests = 0;
        this.numMethodTests = 0;
        this.failedMethodTests = 0;
    }

    runTests() {
        this.runTest(this.testAdd);
        this.runTest(this.testAndMask);
        this.runTest(this.testOrMask);
        this.runTest(this.testUndo);
        this.runTest(this.testRedo);
        thiss.runTest(this.testClear);
    }

    runTest(testMethod) {
        this.startTestMethod(testMethod);
        testMethod.call(this);
        this.endTestMethod(testMethod);
    }

    assertEquals(expectedValue, actualValue) {
        this.numTests++;
        this.numMethodTests++;
        let outputText = "";
        if (expectedValue != actualValue) {
            this.failedTests++;
            this.failedMethodTests++;
            outputText =  "--<span style='color: red'>TEST FAILED: </span><br />"
            + "----Expected Value: " + expectedValue + ", Actual Value: " + actualValue + "<br />";
        } else {
            outputText = "--<span style='color: green'>TEST SUCCEEDED: </span><br />"
                        + "----Expected Value: " + expectedValue + ", Actual Value: " + actualValue + "<br />";
        }
        this.appendOutput(outputText);
    }

    assertTrue(actualValue) {
        this.numTests++;
        this.numMethodTests++;
        let outputText = "";
        if (!actualValue) {
            this.failedTests++;
            this.failedMethodTests++;
            outputText =  "--<span style='color: red'>TEST FAILED: </span><br />"
            + "----assertTrue failed<br />";
        } else {
            outputText = "--<span style='color: green'>TEST SUCCEEDED: </span><br />"
                        + "----assertTrue succeeded<br />";
        }
        this.appendOutput(outputText);
    }

    assertFalse(actualValue) {
        this.numTests++;
        this.numMethodTests++;
        let outputText = "";
        if (actualValue) {
            this.failedTests++;
            this.failedMethodTests++;
            outputText =  "--<span style='color: red'>TEST FAILED: </span><br />"
            + "----assertFalse failed<br />";
        } else {
            outputText = "--<span style='color: green'>TEST SUCCEEDED: </span><br />"
                        + "----assertFalse succeeded<br />";
        }
        this.appendOutput(outputText);
    }

    appendOutput(output) {
        this.outputTextArea.innerHTML += output;
    }

    startTestMethod(testMethod) {
        this.appendOutput("<strong>Running Tests in " + testMethod.name + "</strong><br />");
        this.numMethodTests = 0;
        this.failedMethodTests = 0;
    }

    endTestMethod(testMethod) {
        this.appendOutput("Completed all Tests for <strong>" + testMethod.name + "</strong>");
        this.appendOutput("---# of tests: " + this.numMethodTests);
        let successfulTests = this.numMethodTests-this.failedMethodTests;
        let successRate = this.toPercentage(successfulTests/this.numMethodTests, 1);;
        this.appendOutput("---Results: " + (successfulTests) + "/" + this.numMethodTests         
                                    + " (" + successRate + ")<br /><br />");
    }

    completeTesting() {
        let text = '<strong>Testing Complete</strong><br />'
                +   '--number of tests: ' + this.numTests + '<br />'
                +   '--test failures: ' + this.failedTests + "<br />";
        this.appendOutput(text);
    }

    toPercentage(value, decimalPlaces) {
        var percentage = parseFloat(value * 100).toFixed(decimalPlaces) + "%";
        return percentage;
    }
    
    testAdd() {
        // WE'LL JUST USE A SIMPLE NUM FOR TESTING
        this.tps = new jsTPS();
        this.num = new Num();
        this.assertEquals(0, this.num.getNum());
        
        // ADD 5 TRANSACTION
        this.tps.addTransaction(new AddToNum_Transaction(this.num, 5));
        this.assertEquals(5, this.num.getNum());
        this.assertEquals(1, this.tps.getSize());
        this.assertEquals(0, this.tps.getRedoSize());
        this.assertEquals(1, this.tps.getUndoSize());
        
        // ADD 10 TRANSACTION
        this.tps.addTransaction(new AddToNum_Transaction(this.num, 10));
        this.assertEquals(15, this.num.getNum());
        this.assertEquals(2, this.tps.getSize());
        this.assertEquals(0, this.tps.getRedoSize());
        this.assertEquals(2, this.tps.getUndoSize());
        
        // ADD 15 TRANSACTION
        this.tps.addTransaction(new AddToNum_Transaction(this.num, 20));
        this.assertEquals(35, this.num.getNum());
        this.assertEquals(3, this.tps.getSize());
        this.assertEquals(0, this.tps.getRedoSize());
        this.assertEquals(3, this.tps.getUndoSize());
    }
    
    testAndMask() {
        // WE'LL JUST USE A SIMPLE NUM FOR TESTING
        this.tps = new jsTPS();
        this.num = new Num();
        this.assertEquals(0, this.num.getNum());
        
        // ADD 2 TRANSACTIONS
        this.tps.addTransaction(new AddToNum_Transaction(this.num, 12));
        this.tps.addTransaction(new AndMask_Transaction(this.num, this.num.getNum(), 4));
        this.assertEquals(4, this.num.getNum());
        this.assertEquals(2, this.tps.getSize());
        
        this.tps.undoTransaction();
        this.assertEquals(12, this.num.getNum());
        this.assertEquals(2, this.tps.getSize());
        this.assertEquals(1, this.tps.getRedoSize());
        this.assertEquals(1, this.tps.getUndoSize());
    }
    
    testOrMask() {
        // WE'LL JUST USE A SIMPLE NUM FOR TESTING
        this.tps = new jsTPS();
        this.num = new Num();
        this.assertEquals(0, this.num.getNum());
        
        // ADD 2 TRANSACTIONS
        this.tps.addTransaction(new AddToNum_Transaction(this.num, 12));
        this.tps.addTransaction(new OrMask_Transaction(this.num, this.num.getNum(), 3));
        this.assertEquals(15, this.num.getNum());
        this.assertEquals(2, this.tps.getSize());
        
        this.tps.undoTransaction();
        this.assertEquals(12, this.num.getNum());
        this.assertEquals(2, this.tps.getSize());
        this.assertEquals(1, this.tps.getRedoSize());
        this.assertEquals(1, this.tps.getUndoSize());
    }

    testUndo() {
        // WE'LL JUST USE A SIMPLE NUM FOR TESTING
        this.tps = new jsTPS();
        this.num = new Num();
        this.assertEquals(this.num.getNum(), 0);
        this.assertFalse(this.tps.hasTransactionToUndo());
        this.assertFalse(this.tps.hasTransactionToRedo());
        
        // ADD 3 TRANSACTIONS (5, 10, and 15)
        this.tps.addTransaction(new AddToNum_Transaction(this.num, 5));
        this.tps.addTransaction(new AddToNum_Transaction(this.num, 10));
        this.tps.addTransaction(new AddToNum_Transaction(this.num, 20));
        this.assertTrue(this.tps.hasTransactionToUndo());
        this.assertFalse(this.tps.hasTransactionToRedo());
        this.assertEquals(35, this.num.getNum());
        this.assertTrue(this.tps.hasTransactionToUndo());
        this.assertEquals(3, this.tps.getSize());
        this.assertEquals(0, this.tps.getRedoSize());
        this.assertEquals(3, this.tps.getUndoSize());
        
        // UNDO A TRANSACTION
        this.tps.undoTransaction();
        this.assertTrue(this.tps.hasTransactionToUndo());
        this.assertTrue(this.tps.hasTransactionToRedo());
        this.assertEquals(15, this.num.getNum());
        this.assertEquals(3, this.tps.getSize());
        this.assertEquals(1, this.tps.getRedoSize());
        this.assertEquals(2, this.tps.getUndoSize());
        
        // UNDO ANOTHER
        this.tps.undoTransaction();
        this.assertTrue(this.tps.hasTransactionToUndo());
        this.assertTrue(this.tps.hasTransactionToRedo());
        this.assertEquals(5, this.num.getNum());
        this.assertEquals(3, this.tps.getSize());
        this.assertEquals(2, this.tps.getRedoSize());
        this.assertEquals(1, this.tps.getUndoSize());
        
        // AND ANOTHER
        this.tps.undoTransaction();
        this.assertFalse(this.tps.hasTransactionToUndo());
        this.assertTrue(this.tps.hasTransactionToRedo());
        this.assertEquals(0, this.num.getNum());
        this.assertEquals(3, this.tps.getSize());
        this.assertEquals(3, this.tps.getRedoSize());
        this.assertEquals(0, this.tps.getUndoSize());
        
        // WE HAVE NO MORE TO UNDO SO THIS SHOULD DO NOTHING
        this.tps.undoTransaction();
        this.assertFalse(this.tps.hasTransactionToUndo());
        this.assertTrue(this.tps.hasTransactionToRedo());
        this.assertEquals(0, this.num.getNum());
        this.assertEquals(3, this.tps.getSize());
        this.assertEquals(3, this.tps.getRedoSize());
        this.assertEquals(0, this.tps.getUndoSize());
    }
    
    testRedo() {
        // WE'LL JUST USE A SIMPLE NUM FOR TESTING
        this.tps = new jsTPS();
        this.num = new Num();
        this.assertEquals(this.num.getNum(), 0);
        
        // ADD 3 TRANSACTIONS (5, 10, and 15)
        this.tps.addTransaction(new AddToNum_Transaction(this.num, 5));
        this.tps.addTransaction(new AddToNum_Transaction(this.num, 10));
        this.tps.addTransaction(new AddToNum_Transaction(this.num, 20));
        this.assertTrue(this.tps.hasTransactionToUndo());
        this.assertFalse(this.tps.hasTransactionToRedo());
        this.assertEquals(35, this.num.getNum());
        this.assertEquals(3, this.tps.getSize());
        this.assertEquals(0, this.tps.getRedoSize());
        this.assertEquals(3, this.tps.getUndoSize());
        
        // UNDO A TRANSACTION AND THEN REDO IT
        this.tps.undoTransaction();
        this.tps.doTransaction();
        this.assertTrue(this.tps.hasTransactionToUndo());
        this.assertFalse(this.tps.hasTransactionToRedo());
        this.assertEquals(35, this.num.getNum());
        this.assertEquals(3, this.tps.getSize());
        this.assertEquals(0, this.tps.getRedoSize());
        this.assertEquals(3, this.tps.getUndoSize());
        
        // UNDO TWO TRANSACTIONS AND THEN REDO THEM
        this.tps.undoTransaction();
        this.tps.undoTransaction();
        this.tps.doTransaction();
        this.tps.doTransaction();
        this.assertTrue(this.tps.hasTransactionToUndo());
        this.assertFalse(this.tps.hasTransactionToRedo());
        this.assertEquals(35, this.num.getNum());
        this.assertEquals(3, this.tps.getSize());
        this.assertEquals(0, this.tps.getRedoSize());
        this.assertEquals(3, this.tps.getUndoSize());
        
        // UNDO ALL THREE TRANSACTIONS AND REDO THEM
        this.tps.undoTransaction();
        this.tps.undoTransaction();
        this.tps.undoTransaction();
        this.tps.doTransaction();
        this.tps.doTransaction();
        this.tps.doTransaction();
        this.assertTrue(this.tps.hasTransactionToUndo());
        this.assertFalse(this.tps.hasTransactionToRedo());
        this.assertEquals(35, this.num.getNum());
        this.assertEquals(3, this.tps.getSize());
        this.assertEquals(0, this.tps.getRedoSize());
        this.assertEquals(3, this.tps.getUndoSize());
        
        // UNDO THREE TRANSACTIONS AND REDO TWO
        this.tps.undoTransaction();
        this.tps.undoTransaction();
        this.tps.undoTransaction();
        this.tps.doTransaction();
        this.tps.doTransaction();
        this.assertTrue(this.tps.hasTransactionToUndo());
        this.assertTrue(this.tps.hasTransactionToRedo());
        this.assertEquals(15, this.num.getNum());
        this.assertEquals(3, this.tps.getSize());
        this.assertEquals(1, this.tps.getRedoSize());
        this.assertEquals(2, this.tps.getUndoSize());
        
        // UNDO ALL THREE TRANSACTIONS AND REDO FOUR, WHICH
        // SHOULD NOT PRODUCE AN ERROR BUT THE LAST
        // REDO SHOULD DO NOTHING
        this.tps.undoTransaction();
        this.tps.undoTransaction();
        this.tps.undoTransaction();
        this.tps.doTransaction();
        this.tps.doTransaction();
        this.tps.doTransaction();
        this.tps.doTransaction();
        this.assertTrue(this.tps.hasTransactionToUndo());
        this.assertFalse(this.tps.hasTransactionToRedo());
        this.assertEquals(35, this.num.getNum());
        this.assertEquals(3, this.tps.getSize());
        this.assertEquals(0, this.tps.getRedoSize());
        this.assertEquals(3, this.tps.getUndoSize());
    }    

    testClear() {
        // WE'LL JUST USE A SIMPLE NUM FOR TESTING
        this.ps = new jsTPS();
        this.num = new Num();
        this.assertEquals(this.num.getNum(), 0);
        
        // ADD 3 TRANSACTIONS (5, 10, and 15)
        this.tps.addTransaction(new AddToNum_Transaction(this.num, 5));
        this.tps.addTransaction(new AddToNum_Transaction(this.num, 10));
        this.tps.addTransaction(new AddToNum_Transaction(this.num, 20));
        this.assertEquals(35, this.num.getNum());
        this.assertEquals(3, this.tps.getSize());
        this.assertEquals(0, this.tps.getRedoSize());
        this.assertEquals(3, this.tps.getUndoSize());
                
        // CLEAR ALL THE TRANSACTIONS
        this.tps.clearAllTransactions();
        this.assertEquals(35, this.num.getNum());
        this.assertEquals(0, this.tps.getSize());
        this.assertEquals(0, this.tps.getRedoSize());
        this.assertEquals(0, this.tps.getUndoSize());
        
        // ADD 3 TRANSACTIONS (5, 10, and 15)
        this.tps.addTransaction(new AddToNum_Transaction(this.num, 5));
        this.tps.addTransaction(new AddToNum_Transaction(this.num, 10));
        this.tps.addTransaction(new AddToNum_Transaction(this.num, 20));
        this.assertEquals(70, this.num.getNum());
        this.assertEquals(3, this.tps.getSize());
        this.assertEquals(0, this.tps.getRedoSize());
        this.assertEquals(3, this.tps.getUndoSize());
                
        // CLEAR THEM ALL OUT AGAIN
        this.tps.clearAllTransactions();
        this.assertEquals(70, this.num.getNum());
        this.assertEquals(0, this.tps.getSize());
        this.assertEquals(0, this.tps.getRedoSize());
        this.assertEquals(0, this.tps.getUndoSize());
        
        // ADD 3 TRANSACTIONS (5, 10, and 15)
        this.tps.addTransaction(new AddToNum_Transaction(this.num, 5));
        this.tps.addTransaction(new AddToNum_Transaction(this.num, 10));
        this.tps.addTransaction(new AddToNum_Transaction(this.num, 20));
        this.assertEquals(105, this.num.getNum());
        this.assertEquals(3, this.tps.getSize());
        this.assertEquals(0, this.tps.getRedoSize());
        this.assertEquals(3, this.tps.getUndoSize());
    }
}