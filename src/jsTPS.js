export class jsTPS_Transaction {
    /**
     * This method is called by jTPS when a transaction is executed.
     */
    doTransaction() {
        console.log("doTransaction - MISSING IMPLEMENTATION");
    }
    
    /**
     * This method is called by jTPS when a transaction is undone.
     */
    undoTransaction() {
        console.log("undoTransaction - MISSING IMPLEMENTATION");
    }
}

export class jsTPS {
    constructor() {
        this.transactions = new Array();
        this.numTransactions = 0;
        this.mostRecentTransaction = -1;
        this.performingDo = false;
        this.performingUndo = false;
    }

    isPerformingDo() {
        return this.performingDo;
    }

    isPerformingUndo() {
        return this.performingUndo;
    }

    hasTransactionToRedo() {
        return (this.mostRecentTransaction+1) < this.numTransactions;
    }

    hasTransactionToUndo() {
        return this.mostRecentTransaction >= 0;
    }

    addTransaction(transaction) {
        // ARE WE BRANCHING?
        if ((this.mostRecentTransaction < 0) 
            || (this.mostRecentTransaction < (this.transactions.length - 1))) {
                for (let i = this.transactions.length - 1; i > this.mostRecentTransaction; i--) {
                    this.transactions.splice(i, 1);
                }
                this.numTransactions = this.mostRecentTransaction + 2;
        }
        else {
            this.numTransactions++;
        }

        // ADD THE TRANSACTION
        this.transactions[this.mostRecentTransaction+1] = transaction;

        // AND EXECUTE IT
        this.doTransaction();
    }

    doTransaction() {
        if (this.hasTransactionToRedo()) {
            this.performingDo = true;
            let transaction = this.transactions[this.mostRecentTransaction+1];
            transaction.doTransaction();
            this.mostRecentTransaction++;
            this.performingDo = false;
        }
    }

    /**
     * This function gets the most recently executed transaction on the 
     * TPS stack and undoes it, moving the TPS counter accordingly.
     */
    undoTransaction() {
        if (this.hasTransactionToUndo()) {
            this.performingUndo = true;
            let transaction = this.transactions[this.mostRecentTransaction];
            transaction.undoTransaction();
            this.mostRecentTransaction--;
            this.performingUndo = false;
        }
    }

    clearAllTransactions() {
        // REMOVE ALL THE TRANSACTIONS
        this.transactions = new Array();
        
        // MAKE SURE TO RESET THE LOCATION OF THE
        // TOP OF THE TPS STACK TOO
        this.mostRecentTransaction = -1;      
        this.numTransactions = 0; 
    }

    getSize() {
        return this.transactions.length;
    }

    getRedoSize() {
        return this.getSize() - this.mostRecentTransaction - 1;
    }

    getUndoSize() {
        return this.mostRecentTransaction + 1;
    }

    toString() {        
        let text = "--Number of Transactions: " + this.numTransactions + "\n";
        text += "--Current Index on Stack: " + this.mostRecentTransaction + "\n";
        text += "--Current Transaction Stack:\n";
        for (let i = 0; i <= this.mostRecentTransaction; i++) {
            let jT = this.transactions[i];
            text += "----" + jT.toString() + "\n";
        }
        return text;        
    }
}