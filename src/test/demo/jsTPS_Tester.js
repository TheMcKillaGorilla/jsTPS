import { jsTPS } from "../../jsTPS.js"
import { Num } from "./Num.js"
import { AddToNum_Transaction } from "./AddToNum_Transaction.js"

var InputState = {
    MENU_SELECTION: "MENU_SELECTION",
    ADD_AMOUNT: "ADD_AMOUNT"
}

/**
 * This driver demonstrates simple usage of the jTPS API.
 * 
 * @author THE McKilla Gorilla (accept no imposters)
 * @version 2.0
 */
export default class jsTPS_Tester {
    constructor() {
        // HERE'S OUR TRANSACTION PROCESSING SYSTEM
        this.tps = new jsTPS();

        // HERE'S THE DATA WE'RE MANIPULATING IN THIS DEMO
        this.num = new Num();

        // WE START OFF WAITING FOR A MENU SELECTION
        this.inputState = InputState.MENU_SELECTION;

        // THESE ARE THE ELEMENTS WE'LL NEED TO CHANGE
        this.menuHeader = document.getElementById('menu_header');
        this.menuPrompt = document.getElementById('menu_prompt');
        this.inputTextField = document.getElementById('input_text_field');
        this.outputTextArea = document.getElementById('output_textarea');

        // SETUP THE TEXT FIELD EVENT HANDLER
        this.inputTextField.onkeyup = this.processKeyPress.bind(this);
    }

    processKeyPress(event) {
        // ONLY RESPOND WHEN THE USER PRESSES ENTER, WHICH IS 13
        if (event.keyCode === 13) {
            // THIS IS THE ONLY PLACE THAT SHOULD RESPOND
            event.preventDefault();

            // PROCESS THE INPUT IN ANOTHER METHOD
            if (this.inputState === InputState.MENU_SELECTION)
                this.processMenuChoice();
            else {
                this.processAddAmount();
            }
        }
    }

    processAddAmount() {
        // GET THE TEXT FIELD INPUT
        let input = this.inputTextField.value;

        // CLEAR THE TEXT FIELD
        this.inputTextField.value = "";

        let amountToAdd = Number.parseInt(input);
        if (!Number.isNaN(amountToAdd)) {
            let transaction = new AddToNum_Transaction(this.num, amountToAdd);
            this.tps.addTransaction(transaction);
            this.menuPrompt.innerHTML = "Selection:";
            this.inputState = InputState.MENU_SELECTION;

            // DISPLAY THE RESULTS
            this.appendCurrentStateDisplay();
        }
    }

    processMenuChoice() {
        // GET THE TEXT FIELD INPUT
        let input = this.inputTextField.value;

        // CLEAR THE TEXT FIELD
        this.inputTextField.value = "";

        // ADD AND EXECUTE A TRANSACTION
        if (input == "1") {
            this.menuPrompt.innerHTML = "Enter an amount to add: ";
            this.inputState = InputState.ADD_AMOUNT;
            return;
        }
        // UNDO A TRANSACTION
        else if (input == "2") {
            this.tps.undoTransaction();
        }
        // REDO A TRANSACTION
        else if (input == "3") {
            this.tps.doTransaction();
        }
        // CLEAR ALL TRANSACTIONS
        else if (input == "4") {
            this.tps.clearAllTransactions();
        }
        // CLEAR ALL TRANSACTIONS AND RESET NUM TO 0
        else if (input == "5") {
            this.tps.clearAllTransactions();
            this.num.setNum(0);
        }
        // QUIT
        else  {
            console.log("INPUT NOT RECOGNIZED");
            return;
        }

        this.appendCurrentStateDisplay();
    }

    appendCurrentStateDisplay() {
        // DISPLAY THE CURRENT TPS
        let currentTPSText = "CURRENT jsTPS:\n"
            + this.tps.toString() + "\n";
        this.outputTextArea.value += currentTPSText;

        // DISPLAY NUM
        this.outputTextArea.value += "num is " + this.num.getNum() + "\n\n";

        this.outputTextArea.scrollTop = this.outputTextArea.scrollHeight;
    }
}