import { jsTPS_Transaction } from '../../index.js';

/**
 * ChangeName_Transaction.js
 * 
 * This class is a transaction that can be executed and undone. It
 * can be stored in the jsTPS transaction stack and must be constructed
 * with all the data necessary to perform both do and undo.
 * 
 * @author THE McKilla Gorilla (accept no imposters)
 * @version 1.0
 */
export default class ChangeName_Transaction extends jsTPS_Transaction {
    /**
     * Constructor for this transaction, it initializes this
     * object with all the data needed to both do and undo
     * the transaction.
     * 
     * @param initData
     */
    constructor(initPerson, newName) {
        super();

        // THIS IS THE OBJECT IT WILL MANIPULATE
        this.person = initPerson;
        this.oldName = this.person.name;
        this.newName = newName;
    }

    /**
     * This transaction simply adds the data to the transaction stack.
     */
    doTransaction() {
        this.person.name = this.newName;
    }

    /**
     * As the reverse of do, this method substracts from num.
     */
    undoTransaction() {
        this.person.name = this.oldName;
    }

    /**
     * Provides a textual summary of this transaction.
     * 
     * @return A string storing a textual summary of this object.
     */
    toString() {
        return  "ChangeName_Transaction\n"
            +   "---redo updates Person to " + this.person.name + " (" + this.newAge + ")\n"
            +   "---undo updates Person to " + this.person.name + " (" + this.oldAge + ")"
    }
}