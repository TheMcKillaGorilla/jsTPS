import Person from "../test/person/Person.js"
import ChangeName_Transaction from "../test/person/ChangeName_Transaction.js"
import IncrementAge_Transaction from "../test/person/IncrementAge_Transaction.js"
import { jsTPS } from "../index.js";
import readline from "node:readline";

const IO = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let tps = new jsTPS();
let person = new Person("No Name", 0);

function displayGreeting() {
    console.log("*** jsTPS Demo - Demonstrates use of the jsTPS Framework ***");
}

function displayMenu() {
    console.log('\n--- ' + person.toString() + ' ---');
    console.log('C: Change Person Name');
    console.log('I: Increment Person Age');
    if (tps.hasTransactionToUndo())
        console.log('U: Undo');
    if (tps.hasTransactionToDo())
        console.log('R: Redo');
    console.log('X: Exit Demo');

    IO.question('---', (selection) => {
        selection = selection.trim();
        if ((selection == 'C') || (selection == 'c')) {
            IO.question('Enter Name: ', (numInput) => {
                let newName = numInput.trim();
                let transaction = new ChangeName_Transaction(person, newName);
                tps.processTransaction(transaction);
                displayMenu();
            });
        }
        else if ((selection == 'I') || (selection == 'i')) {
            IO.question('Enter Age Increment: ', (userInput) => {
                let newAge = Number(userInput);
                if (isNaN(newAge))
                    IO.output.log(userInput + " is not a valid age increment");
                else {
                    let transaction = new IncrementAge_Transaction(person, newAge);
                    tps.processTransaction(transaction);
                }
                displayMenu();
            });
        }
        else if (((selection == 'U') || (selection == 'u')) 
            && tps.hasTransactionToUndo()) {
            tps.undoTransaction();
            displayMenu();
        }
        else if (((selection == 'R') || (selection == 'r')) 
            && tps.hasTransactionToDo()) {
            tps.doTransaction();
            displayMenu();
        }
        else if ((selection == 'X') || (selection == 'x')) {
            console.log("GOODBYE");
            IO.close();
        }
        else {
            console.log('❌ INVALID SELECTION\n');
            displayMenu();
        }
    });
}



displayGreeting();
displayMenu();


