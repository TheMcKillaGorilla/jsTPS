import { beforeAll, beforeEach, afterEach, afterAll, expect, test } from 'vitest';
import { jsTPS } from '../index.js';
import { TestUtils } from "./testUtils.js"
let tps;

/**
 * Vitest test script for the jsTPS framework. Testing will verify that the transaction processing
 * system is properly updated as transactions are processed (i.e. adding plus doing), undone, and redone
 * in various combinations.
 *  
 * Scenarios we will test:
 *  1) Instantiating the TPS
 *  2) brand new empty stack, then processTransaction
 *  3) process three transactions, then undo three transaction, then process a new transaction
 *  4) process three transactions, then undo three transaction, then redo two transactions, then process a new transaction
 *  5) process three transactions, then undo three transaction, then redo three transactions, then process a new transaction
 *  6) process three transactions, then undo three transactions, then redo one transaction, then process two new transactions
 *  7) process five transactions, then undo three transactions, then redo one transaction, then undo two transactions
 *  8) process five transactions, then undo two transactions, then process two transactions, then undo three transactions 
 *  9) process five transactions, then undo four transactions, then redo two transactions
 *  10) undoing a transaction on an empty stack, should throw an exception
 *  11) undoing a transaction when there are none to undo, should throw an exception
 *  12) redoing a transaction on an empty stack, should throw an exception
 *  13) redoing a transaction when there are none to redo, should throw an exception
 *  14) peeking at a transaction when there is only one in the stack
 *  15) peeking at a transaction at the top of a stack after multiple undos and redos
 *  16) peeking at a transaction in the middle of a stack after multiple undos and redos
 *  17) peeking at a transaction at the bottom of a stack after multiple undos and redos
 */

/**
 * Executed once before all tests are performed.
 */
beforeAll(() => {
    // INSTANTIATE THE TPS JUST ONCE
    tps = new jsTPS();
});

/**
 * Executed before each test is performed.
 */
beforeEach(() => {
    // RESET THE ENTIRE TPS BEFORE EACH TEST
    tps.clearAllTransactions();
});

/**
 * Executed after each test is performed.
 */
afterEach(() => {
});

/**
 * Executed once after all tests are performed.
 */
afterAll(() => {
});

/**
 * Vitest test to make sure constructor creates an instance of jsTPS.
 */
test('Test #1) should create an instance of jsTPS', () => {
    const instance = new jsTPS();
    expect(instance).toBeInstanceOf(jsTPS);
});

/**
 * Vitest test for a brand new empty stack, then processTransaction
 */
test('Test #2) brand new empty stack, then processTransaction', () => {
    // REBUILD THE PERSON TEST DATA
    TestUtils.resetPersonTest(tps, "Vito", 65);

    // PROCESS THE FIRST ONE, NOTE BOTH ADDS IT AND ALSO EXECUTES THE TRANSACTION
    let transaction1 = TestUtils.makeNameTransaction("Sonny");
    tps.processTransaction(transaction1);
    TestUtils.testStack(tps, 1, 0, 1, false, true);
    TestUtils.testActualPerson("Sonny", 65);

    // PROCESS THE SECOND ONE, NOTE BOTH ADDS IT AND ALSO EXECUTES THE TRANSACTION
    let transaction2 = TestUtils.makeIncrementAgeTransaction(-35);
    tps.processTransaction(transaction2);
    TestUtils.testStack(tps, 2, 0, 2, false, true);
    TestUtils.testActualPerson("Sonny", 30);

    // PROCESS THE THIRD ONE, NOTE BOTH ADDS IT AND ALSO EXECUTES THE TRANSACTION
    let transaction3 = TestUtils.makeNameTransaction("Fredo");
    tps.processTransaction(transaction3);
    TestUtils.testStack(tps, 3, 0, 3, false, true);
    TestUtils.testActualPerson("Fredo", 30);
});

/**
 * Vitest test for process three transactions, then undo three transaction, then process a new transaction
 */
test('Test #3) process three transactions, then undo three transaction, then process a new transaction', () => {
    // REBUILD THE PERSON TEST DATA
    TestUtils.resetPersonTest(tps, "Vito", 65);

    let transaction1 = TestUtils.makeNameTransaction("Sonny");
    tps.processTransaction(transaction1);
    let transaction2 = TestUtils.makeIncrementAgeTransaction(-35);
    tps.processTransaction(transaction2);
    let transaction3 = TestUtils.makeNameTransaction("Fredo");
    tps.processTransaction(transaction3);
    tps.undoTransaction();
    tps.undoTransaction();
    tps.undoTransaction();

    // PROCESS THE FIRST ONE, NOTE BOTH ADDS IT AND ALSO EXECUTES THE TRANSACTION
    let transaction4 = TestUtils.makeIncrementAgeTransaction(-5);
    tps.processTransaction(transaction4);
    TestUtils.testStack(tps, 1, 0, 1, false, true);
    TestUtils.testActualPerson("Vito", 60);

    // PROCESS THE SECOND ONE, NOTE BOTH ADDS IT AND ALSO EXECUTES THE TRANSACTION
    let transaction5 = TestUtils.makeNameTransaction("Michael");
    tps.processTransaction(transaction5);
    TestUtils.testStack(tps, 2, 0, 2, false, true);
    TestUtils.testActualPerson("Michael", 60);

    // PROCESS THE THIRD ONE, NOTE BOTH ADDS IT AND ALSO EXECUTES THE TRANSACTION
    let transaction6 = TestUtils.makeNameTransaction("Luca");
    tps.processTransaction(transaction6);
    TestUtils.testStack(tps, 3, 0, 3, false, true);
    TestUtils.testActualPerson("Luca", 60);
});

/**
 * Vitest test for process three transactions, then undo three transaction, then redo two transactions, then process a new transaction
 */
test('Test #4) process three transactions, then undo three transaction, then redo two transactions, then process a new transaction', () => {
    // REBUILD THE PERSON TEST DATA
    TestUtils.resetPersonTest(tps, "Vito", 65);

    let transaction1 = TestUtils.makeNameTransaction("Sonny");
    tps.processTransaction(transaction1);
    let transaction2 = TestUtils.makeIncrementAgeTransaction(-35);
    tps.processTransaction(transaction2);
    let transaction3 = TestUtils.makeNameTransaction("Fredo");
    tps.processTransaction(transaction3);
    tps.undoTransaction();
    tps.undoTransaction();
    tps.undoTransaction();
    tps.doTransaction();

    // PROCESS THE FIRST ONE, NOTE BOTH ADDS IT AND ALSO EXECUTES THE TRANSACTION
    let transaction4 = TestUtils.makeIncrementAgeTransaction(-45);
    tps.processTransaction(transaction4);
    TestUtils.testStack(tps, 2, 0, 2, false, true);
    TestUtils.testActualPerson("Sonny", 20);
});

/**
 * Vitest test for process three transactions, then undo three transaction, then redo three transactions, then process a new transaction
 */
test('Test #5) process three transactions, then undo three transaction, then redo three transactions, then process a new transaction', () => {
    // REBUILD THE PERSON TEST DATA
    TestUtils.resetPersonTest(tps, "Vito", 65);

    let transaction1 = TestUtils.makeNameTransaction("Sonny");
    tps.processTransaction(transaction1);
    let transaction2 = TestUtils.makeIncrementAgeTransaction(-35);
    tps.processTransaction(transaction2);
    let transaction3 = TestUtils.makeNameTransaction("Fredo");
    tps.processTransaction(transaction3);
    tps.undoTransaction();
    tps.undoTransaction();
    tps.undoTransaction();
    tps.doTransaction();
    tps.doTransaction();
    tps.doTransaction();

    // PROCESS THE FIRST ONE, NOTE BOTH ADDS IT AND ALSO EXECUTES THE TRANSACTION
    let transaction4 = TestUtils.makeIncrementAgeTransaction(-5);
    tps.processTransaction(transaction4);
    TestUtils.testStack(tps, 4, 0, 4, false, true);
    TestUtils.testActualPerson("Fredo", 25);
});

/**
 * Vitest test for process three transactions, then undo three transactions, then redo one transaction, then process two new transactions
 */
test('Test #6) process three transactions, then undo three transactions, then redo one transaction, then process two new transactions', () => {
    // REBUILD THE PERSON TEST DATA
    TestUtils.resetPersonTest(tps, "Vito", 65);

    let transaction1 = TestUtils.makeNameTransaction("Sonny");
    tps.processTransaction(transaction1);
    let transaction2 = TestUtils.makeIncrementAgeTransaction(-35);
    tps.processTransaction(transaction2);
    let transaction3 = TestUtils.makeNameTransaction("Fredo");
    tps.processTransaction(transaction3);
    tps.undoTransaction();
    tps.undoTransaction();
    tps.undoTransaction();
    tps.doTransaction();

    // PROCESS THE FIRST ONE, NOTE BOTH ADDS IT AND ALSO EXECUTES THE TRANSACTION
    let transaction4 = TestUtils.makeIncrementAgeTransaction(-45);
    tps.processTransaction(transaction4);
    let transaction5 = TestUtils.makeNameTransaction("Michael");
    tps.processTransaction(transaction5);
    TestUtils.testStack(tps, 3, 0, 3, false, true);
    TestUtils.testActualPerson("Michael", 20);
});

/**
 * Vitest test for process five transactions, then undo three transactions, then redo one transaction, then undo two transactions
 */
test('Test #7) process five transactions, then undo three transactions, then redo one transaction, then undo two transactions', () => {
    // REBUILD THE PERSON TEST DATA
    TestUtils.resetPersonTest(tps, "Vito", 65);

    let transaction1 = TestUtils.makeNameTransaction("Sonny");
    tps.processTransaction(transaction1);
    let transaction2 = TestUtils.makeIncrementAgeTransaction(-35);
    tps.processTransaction(transaction2);
    let transaction3 = TestUtils.makeNameTransaction("Fredo");
    tps.processTransaction(transaction3);
    let transaction4 = TestUtils.makeIncrementAgeTransaction(-5);
    tps.processTransaction(transaction4);
    let transaction5 = TestUtils.makeNameTransaction("Michael");
    tps.processTransaction(transaction5);
    tps.undoTransaction();
    tps.undoTransaction();
    tps.undoTransaction();
    tps.doTransaction();
    tps.undoTransaction();
    tps.undoTransaction();

    // PROCESS THE FIRST ONE, NOTE BOTH ADDS IT AND ALSO EXECUTES THE TRANSACTION
    let transaction6 = TestUtils.makeNameTransaction("Hyman");
    tps.processTransaction(transaction6);
    TestUtils.testStack(tps, 2, 0, 2, false, true);
    TestUtils.testActualPerson("Hyman", 65);
});

/**
 * Vitest test for process five transactions, then undo two transactions, then process two transactions, then undo three transactions
 */
test('Test #8) process five transactions, then undo three transactions, then process two transactions, then undo three transactions', () => {
    // REBUILD THE PERSON TEST DATA
    TestUtils.resetPersonTest(tps, "Vito", 65);

    let transaction1 = TestUtils.makeNameTransaction("Sonny");
    tps.processTransaction(transaction1);
    let transaction2 = TestUtils.makeIncrementAgeTransaction(-35);
    tps.processTransaction(transaction2);
    let transaction3 = TestUtils.makeNameTransaction("Fredo");
    tps.processTransaction(transaction3);
    let transaction4 = TestUtils.makeIncrementAgeTransaction(-5);
    tps.processTransaction(transaction4);
    let transaction5 = TestUtils.makeNameTransaction("Michael");
    tps.processTransaction(transaction5);
    tps.undoTransaction();
    tps.undoTransaction();
    tps.undoTransaction();
    tps.doTransaction();
    tps.doTransaction();
    tps.undoTransaction();
    tps.undoTransaction();
    tps.undoTransaction();

    // PROCESS THE FIRST ONE, NOTE BOTH ADDS IT AND ALSO EXECUTES THE TRANSACTION
    TestUtils.testStack(tps, 5, 4, 1, true, true);
    TestUtils.testActualPerson("Sonny", 65);
});

/**
 * Vitest test for process five transactions, then undo four transactions, then redo two transactions
 */
test('Test #9) process five transactions, then undo four transactions, then redo two transactions', () => {
    // REBUILD THE PERSON TEST DATA
    TestUtils.resetPersonTest(tps, "Vito", 65);

    let transaction1 = TestUtils.makeNameTransaction("Sonny");
    tps.processTransaction(transaction1);
    let transaction2 = TestUtils.makeIncrementAgeTransaction(-35);
    tps.processTransaction(transaction2);
    let transaction3 = TestUtils.makeNameTransaction("Fredo");
    tps.processTransaction(transaction3);
    let transaction4 = TestUtils.makeIncrementAgeTransaction(-5);
    tps.processTransaction(transaction4);
    let transaction5 = TestUtils.makeNameTransaction("Michael");
    tps.processTransaction(transaction5);
    tps.undoTransaction();
    tps.undoTransaction();
    tps.undoTransaction();
    tps.undoTransaction();
    tps.doTransaction();
    tps.doTransaction();
    tps.undoTransaction();
    tps.undoTransaction();
    tps.undoTransaction();

    // PROCESS THE FIRST ONE, NOTE BOTH ADDS IT AND ALSO EXECUTES THE TRANSACTION
    TestUtils.testStack(tps, 5, 5, 0, true, false);
    TestUtils.testActualPerson("Vito", 65);
});

/**
 * Vitest test for undoing a transaction on an empty stack, should throw an exception
 */
test('Test #10) undoing a transaction on an empty stack, should throw an exception', () => {
    // REBUILD THE PERSON TEST DATA
    TestUtils.resetPersonTest(tps, "Vito", 65);

    expect(() => tps.undoTransaction()).toThrow(tps.TRANSACTION_STACK_EXCEPTION);

    // PROCESS THE FIRST ONE, NOTE BOTH ADDS IT AND ALSO EXECUTES THE TRANSACTION
    TestUtils.testStack(tps, 0, 0, 0, false, false);
    TestUtils.testActualPerson("Vito", 65);
});

/**
 * Vitest test for undoing a transaction when there are none to undo, should throw an exception
 */
test('Test #11) undoing a transaction when there are none to undo, should throw an exception', () => {
    // REBUILD THE PERSON TEST DATA
    TestUtils.resetPersonTest(tps, "Vito", 65);

    let transaction1 = TestUtils.makeNameTransaction("Sonny");
    tps.processTransaction(transaction1);
    let transaction2 = TestUtils.makeIncrementAgeTransaction(-35);
    tps.processTransaction(transaction2);
    let transaction3 = TestUtils.makeNameTransaction("Fredo");
    tps.processTransaction(transaction3);
    let transaction4 = TestUtils.makeIncrementAgeTransaction(-5);
    tps.processTransaction(transaction4);
    let transaction5 = TestUtils.makeNameTransaction("Michael");
    tps.processTransaction(transaction5);
    tps.undoTransaction();
    tps.undoTransaction();
    tps.doTransaction();
    tps.undoTransaction();
    tps.doTransaction();
    tps.undoTransaction();
    tps.undoTransaction();
    tps.undoTransaction();
    tps.undoTransaction();

    expect(() => tps.undoTransaction()).toThrow(tps.TRANSACTION_STACK_EXCEPTION);

    // PROCESS THE FIRST ONE, NOTE BOTH ADDS IT AND ALSO EXECUTES THE TRANSACTION
    TestUtils.testStack(tps, 5, 5, 0, true, false);
    TestUtils.testActualPerson("Vito", 65);
});

/**
 * Vitest test for redoing a transaction on an empty stack, should throw an exception
 */
test('Test #12) redoing a transaction on an empty stack, should throw an exception', () => {
    // REBUILD THE PERSON TEST DATA
    TestUtils.resetPersonTest(tps, "Vito", 65);

    expect(() => tps.doTransaction()).toThrow(tps.TRANSACTION_STACK_EXCEPTION);

    // PROCESS THE FIRST ONE, NOTE BOTH ADDS IT AND ALSO EXECUTES THE TRANSACTION
    TestUtils.testStack(tps, 0, 0, 0, false, false);
    TestUtils.testActualPerson("Vito", 65);
});

/**
 * Vitest test for redoing a transaction when there are none to redo, should throw an exception
 */
test('Test #13) redoing a transaction when there are none to redo, should throw an exception', () => {
    // REBUILD THE PERSON TEST DATA
    TestUtils.resetPersonTest(tps, "Vito", 65);

    let transaction1 = TestUtils.makeNameTransaction("Sonny");
    tps.processTransaction(transaction1);
    let transaction2 = TestUtils.makeIncrementAgeTransaction(-35);
    tps.processTransaction(transaction2);
    let transaction3 = TestUtils.makeNameTransaction("Fredo");
    tps.processTransaction(transaction3);
    let transaction4 = TestUtils.makeIncrementAgeTransaction(-5);
    tps.processTransaction(transaction4);
    let transaction5 = TestUtils.makeNameTransaction("Michael");
    tps.processTransaction(transaction5);
    tps.undoTransaction();
    tps.undoTransaction();
    tps.doTransaction();
    tps.doTransaction();

    expect(() => tps.doTransaction()).toThrow(tps.TRANSACTION_STACK_EXCEPTION);

    // PROCESS THE FIRST ONE, NOTE BOTH ADDS IT AND ALSO EXECUTES THE TRANSACTION
    TestUtils.testStack(tps, 5, 0, 5, false, true);
    TestUtils.testActualPerson("Michael", 25);
});

/**
 * Vitest test for peeking at a transaction when there is only one in the stack
 */
test('Test #14) peeking at a transaction when there is only one in the stack', () => {
    // REBUILD THE PERSON TEST DATA
    TestUtils.resetPersonTest(tps, "Vito", 65);

    let transaction1 = TestUtils.makeNameTransaction("Sonny");
    tps.processTransaction(transaction1);
    let transaction2 = TestUtils.makeIncrementAgeTransaction(-35);
    tps.processTransaction(transaction2);
    let transaction3 = TestUtils.makeNameTransaction("Fredo");
    tps.processTransaction(transaction3);
    tps.undoTransaction();
    tps.undoTransaction();
    tps.undoTransaction();

    // THIS WILL BRANCH THE STACK
    let transaction4 = TestUtils.makeIncrementAgeTransaction(-5);
    tps.processTransaction(transaction4);

    let transaction = tps.peekTransaction(0);
    TestUtils.testIncrementAgeTransaction(transaction, -5);

    // PROCESS THE FIRST ONE, NOTE BOTH ADDS IT AND ALSO EXECUTES THE TRANSACTION
    TestUtils.testStack(tps, 1, 0, 1, false, true);
    TestUtils.testActualPerson("Vito", 60);
});

/**
 * Vitest test for peeking at a transaction at the top of a stack after multiple undos and redos
 */
test('Test #15) peeking at a transaction at the top of a stack after multiple undos and redos', () => {
    // REBUILD THE PERSON TEST DATA
    TestUtils.resetPersonTest(tps, "Vito", 65);

    let transaction1 = TestUtils.makeNameTransaction("Sonny");
    tps.processTransaction(transaction1);
    let transaction2 = TestUtils.makeIncrementAgeTransaction(-35);
    tps.processTransaction(transaction2);
    let transaction3 = TestUtils.makeNameTransaction("Fredo");
    tps.processTransaction(transaction3);
    let transaction4 = TestUtils.makeIncrementAgeTransaction(-5);
    tps.processTransaction(transaction4);
    tps.undoTransaction();
    tps.undoTransaction();
    tps.undoTransaction();
    tps.doTransaction();
    tps.doTransaction();
    tps.doTransaction();

    let transaction = tps.peekTransaction(3);
    TestUtils.testIncrementAgeTransaction(transaction, -5);

    // PROCESS THE FIRST ONE, NOTE BOTH ADDS IT AND ALSO EXECUTES THE TRANSACTION
    TestUtils.testStack(tps, 4, 0, 4, false, true);
    TestUtils.testActualPerson("Fredo", 25);
});

/**
 * Vitest test for peeking at a transaction in the middle of a stack after multiple undos and redos
 */
test('Test #16) peeking at a transaction in the middle of a stack after multiple undos and redos', () => {
    // REBUILD THE PERSON TEST DATA
    TestUtils.resetPersonTest(tps, "Vito", 65);

    let transaction1 = TestUtils.makeNameTransaction("Sonny");
    tps.processTransaction(transaction1);
    let transaction2 = TestUtils.makeIncrementAgeTransaction(-35);
    tps.processTransaction(transaction2);
    let transaction3 = TestUtils.makeNameTransaction("Fredo");
    tps.processTransaction(transaction3);
    let transaction4 = TestUtils.makeIncrementAgeTransaction(-5);
    tps.processTransaction(transaction4);
    tps.undoTransaction();
    tps.undoTransaction();
    tps.undoTransaction();
    tps.doTransaction();

    let transaction = tps.peekTransaction(2);
    TestUtils.testNameTransaction(transaction, "Fredo");

    // PROCESS THE FIRST ONE, NOTE BOTH ADDS IT AND ALSO EXECUTES THE TRANSACTION
    TestUtils.testStack(tps, 4, 2, 2, true, true);
    TestUtils.testActualPerson("Sonny", 30);
});

/**
 * Vitest test for peeking at a transaction at the bottom of a stack after multiple undos and redos
 */
test('Test #17) peeking at a transaction at the bottom of a stack after multiple undos and redos', () => {
    // REBUILD THE PERSON TEST DATA
    TestUtils.resetPersonTest(tps, "Vito", 65);

    let transaction1 = TestUtils.makeNameTransaction("Sonny");
    tps.processTransaction(transaction1);
    let transaction2 = TestUtils.makeIncrementAgeTransaction(-35);
    tps.processTransaction(transaction2);
    let transaction3 = TestUtils.makeNameTransaction("Fredo");
    tps.processTransaction(transaction3);
    let transaction4 = TestUtils.makeIncrementAgeTransaction(-5);
    tps.processTransaction(transaction4);
    tps.undoTransaction();
    tps.undoTransaction();
    tps.undoTransaction();
    tps.doTransaction();

    let transaction = tps.peekTransaction(0);
    TestUtils.testNameTransaction(transaction, "Sonny");

    // PROCESS THE FIRST ONE, NOTE BOTH ADDS IT AND ALSO EXECUTES THE TRANSACTION
    TestUtils.testStack(tps, 4, 2, 2, true, true);
    TestUtils.testActualPerson("Sonny", 30);
});