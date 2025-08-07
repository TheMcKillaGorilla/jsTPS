import { jsTPS_Transaction } from '../../index.js';

/**
 * IncrementAge_Transaction.js
 * 
 * This class is a transaction that can be executed and undone. It
 * can be stored in the jsTPS transaction stack and must be constructed
 * with all the data necessary to perform both do and undo.
 * 
 * @author THE McKilla Gorilla (accept no imposters)
 * @version 1.0
 */
export default class IncrementAge_Transaction extends jsTPS_Transaction {
    /**
     * Constructor for this transaction, it initializes this
     * object with all the data needed to both do and undo
     * the transaction.
     * 
     * @param initData
     */
    constructor(initPerson, initInc) {
        super();

        // THIS IS THE OBJECT IT WILL MANIPULATE
        this.person = initPerson;
        this.inc = initInc;
    }

    /**
     * This transaction simply adds the data to the transaction stack.
     */
    doTransaction() {
        this.person.age += this.inc;
    }

    /**
     * As the reverse of do, this method substracts from num.
     */
    undoTransaction() {
        this.person.age -= this.inc;
    }

    /**
     * Provides a textual summary of this transaction.
     * 
     * @return A string storing a textual summary of this object.
     */
    toString() {
        return  "IncrementAge_Transaction\n"
            +   "---redo increments Person age by to " + this.inc + "\n"
            +   "---undo decrements Person age by to " + this.inc + "\n";
    }
}