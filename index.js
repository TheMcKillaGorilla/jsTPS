/**
 * A jsTPS_Transaction represents a single atomic transaction to be managed
 * by the jsTPS class in a transaction stack. Each transaction can be done
 * and the undone, which should restore the state of the application employing
 * this framework.
 * 
 * @author TheMcKillaGorilla
 * @version 2.0
 */
export class jsTPS_Transaction {
    /**
     * This method is called by jsTPS when a transaction is executed.
     */
    executeDo() {
        console.log("doTransaction - MISSING IMPLEMENTATION");
    }

    /**
     * This method is called by jsTPS when a transaction is undone.
     */
    executeUndo() {
        console.log("undoTransaction - MISSING IMPLEMENTATION");
    }
}

/**
 * jsTPS serves as a transaction processing system employing a transaction
 * stack such that one can use this framework to implement undo/redo in
 * an application.
 * 
 * @author TheMcKillaGorilla
 * @version 2.0
 */
export class jsTPS {
    /**
     * Thrown when one tries to undo, or redo a transaction when
     * none is available for such an operation.
     */
    TRANSACTION_STACK_EXCEPTION = "TRANSACTION_STACK_EXCEPTION";

    /**
     * A Transaction Processing System to be used for implementing
     * undo/redo in a JavaScript application. Note that the transaction
     * stack will start out empty, with no transactions to do or undo.
     * @constructor
     */
     constructor() {
        // THE TRANSACTION STACK, MEANING TRANSACTIONS THAT HAVE BEEN
        // EXECUTED THAT WE CAN UNDO AND THEN REDO
        this.transactions = [];

        // THE TOTAL NUMBER OF VALID TRANSACTIONS IN THE STACK, INCLUDING THOSE 
        // THAT WE MIGHT REDO, BUT NOT INCLUDING TRANSACTIONS THAT ARE LOST WHEN 
        // BRANCHING OCCURS, MEANING WHEN WE HAVE UNDONE TRANSACTIONS AND THEN
        // ADD A NEW ONE, WHICH ELIMINATES THOSE ABOVE IT IN THE STACK. NOTE THAT
        // THIS NUMBER ONLY CHANGES WHEN WE ADD A TRANSACTION.
        this.size = 0;

        // THE INDEX WHERE A NEW TRANSACTION WOULD BE ADDED ONTO THE STACK
        // SHOULD processTransaction BE CALLED, WHICH ADDES AND EXECUTES A
        // TRANSACTION. NOTE THAT FOLLOWING COMBINATIONS OF UNDO AND REDO 
        // THIS INDEX WILL BE ONE MORE THAN THE INDEX OF THE MOST RECENTLY
        // DONE TRANSACTION.
        this.topIndex = 0;
    }

    /**
     * Completely resets the transaction stack, assigning it a new, empty array and
     * resetting the top index and size to reflect an empty stack.
     */
    clearAllTransactions() {
        // REMOVE ALL THE TRANSACTIONS
        this.transactions = [];
        
        // RESET THE OTHER VARIABLES TOO
        this.topIndex = 0;      
        this.size = 0; 
    }

    /**
     * Executes the transaction in the stack where our index is and advances the index such
     * that it could then be undone if necessary. Note, this does not change what
     * transactions are on the stack, just the index counter that keeps track of
     * what has been done and undone.
     * 
     * @throws {TRANSACTION_STACK_EXCEPTION} thrown if there is no transaction on the
     * stack to do.
     */
    doTransaction() {
        if (this.hasTransactionToDo()) {
            let transaction = this.transactions[this.topIndex];
            transaction.doTransaction();
            this.topIndex++;
        }
        else {
            throw this.TRANSACTION_STACK_EXCEPTION;
        }
    }

    /**
     * Accessor method for the number of transactions that can currently be done.
     * 
     * @returns {Number} The number of transactions in the stack that can be done.
     */
    getDoSize() {
        return this.getSize() - this.getUndoSize();
    }

    /**
     * Accessor method for the total number of transactions in the current stack which
     * includes those that can be done and undone.
     * 
     * @returns {Number} The number of transactions in total in the stack.
     */
    getSize() {
        return this.size;
    }

    /**
     * Accessor method for the number of transactions that can currently be undone.
     * 
     * @returns {Number} The number of transactions in the stack that can be undone.
     */
    getUndoSize() {
        return this.topIndex;
    }

    /**
     * Used to check if there is an doable transaction in the stack or not, like
     * to redo a transaction, which might be useful for an application for enabling
     * a redo button.
     * 
     * @returns true if there is a transaction in the stack that can be done,
     * false othewise.
     */
    hasTransactionToDo() {
        return (this.getDoSize() > 0);
    }

    /**
     * Used to check if there is an undoable transaction in the stack or not, like
     * to undo a transaction, which might be useful for an application for enabling
     * an undo button.
     * 
     * @returns true if there is a transaction in the stack that can be undone,
     * false otherwise.
     */
    hasTransactionToUndo() {
        return (this.getUndoSize() > 0);
    }

    /**
     * Gets a transaction in the stack at a provided index without executing the transaction
     * or changing the stack.
     * 
     * @param {Number} index = The index of the transaction in the stack to get, which can
     * be used to get any transaction, even those that have been undone if they are still
     * in the stack.
     * 
     * @returns {jsTPS_Transaction} The transaction to retrieve at index in the stack, if
     * an invalid index is provided, null is returned.
     */
    peekTransaction(index) {
        if ((index >= 0) && (index < this.getSize())) {
            return this.transactions[index];
        }
        return null;
    }

    /**
     * This function takes the transaction argument and both pushes it to the top of the
     * transaction stack and executes it. After this method executes one can undo it, but
     * there should be no transaction to redo as this one will have been executed.
     * @param {jsTPS_Transaction} transaction - The transaction to add to the stack and execute.
     */
    processTransaction(transaction) {
        // FIRST ADD THE TRANSACTION TO THE STACK
        this.transactions[this.topIndex] = transaction;

        // NOW WE NEED TO UPDATE THE SIZE OF THE STACK, WHICH AFTER A TRANSACTION
        // IS PUSHED ONTO THE TOP, WILL ALWAYS BE TWO MORE THAN topIndex, SINCE
        // THE TRANSACTION HAS NOT YET BEEN EXECUTED.
        this.size = this.topIndex + 1;

        // AND THEN EXECUTE IT, WHICH WILL ALSO MOVE THE TOP INDEX
        this.doTransaction();
    }

    /**
     * Pushes a transaction onto the top of the transaction stack, but does not execute (do)
     * the transaction. Note, if there are transactions that can be redone when this
     * is executed they will be lost.
     * 
     * @param {jsTPS_Transaction} transaction - The transaction object to be put at the
     * top of the stack. Note, this function does not execute the transaction and thus
     * it does not update the index of the top of the stack.
     */
    pushTransaction(transaction) {
        // FIRST ADD THE TRANSACTION TO THE TOP OF THE STACK
        this.transactions[this.topIndex] = transaction;

        // NOW WE NEED TO UPDATE THE SIZE OF THE STACK, WHICH AFTER A TRANSACTION
        // IS PUSHED ONTO THE TOP, WILL ALWAYS BE TWO MORE THAN topIndex, SINCE
        // THE TRANSACTION HAS NOT YET BEEN EXECUTED.
        this.size = this.topIndex + 1;
    }

    /**
     * Builds and returns a textual representation of the transaction processing
     * system, which summarizes the contents of the transaction stack.
     * 
     * @returns {String} A textual representation of the transaction stack.
     */
    toString() {        
        let text = "--Number of Transactions: " + this.size + "\n";
        text += "--Top Index: " + this.topIndex + "\n";
        text += "--Current Transaction Stack:\n";
        for (let i = 0; i <= this.topIndex; i++) {
            let jT = this.transactions[i];
            text += "----" + jT.toString() + "\n";
        }
        return text;        
    }

    /**
     * Undoes the transaction at the top of the stack and decrements the index such
     * that it could then be redone if necessary. Note, this does not change what
     * transactions are on the stack, just the index counter that keeps track of
     * the top of the stack, and thus which transactions would be executed for do
     * and undo operations.
     * 
     * @throws {TRANSACTION_STACK_EXCEPTION} thrown if there is no transaction on the
     * stack to undo.
     */
    undoTransaction() {
        if (this.hasTransactionToUndo()) {
            let transaction = this.transactions[this.topIndex-1];
            transaction.undoTransaction();
            this.topIndex--;
        }
        else {
            throw this.TRANSACTION_STACK_EXCEPTION;
        }
    }
}