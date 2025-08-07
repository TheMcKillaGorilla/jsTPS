const { jsTPS, jsTPSTransaction } = require('../index');
const { TestUtils } = require('./testUtils');
let tps;

/**
 * Jest test script for the jsTPS framework. Testing will verify that the transaction processing
 * system is properly updated as transactions are processed (i.e. adding plus doing), undone, and redone
 * in various combinations.
 *  
 * Scenarios we will test:
 *  a) Instantiating the TPS
 *  b) brand new empty stack, then processTransaction
 *  c) process three transactions, then undo three transaction, then process a new transaction
 *  d) process three transactions, then undo three transaction, then redo two transactions, then process a new transaction
 *  e) process three transactions, then undo three transaction, then redo three transactions, then process a new transaction
 *  f) process three transactions, then undo three transactions, then redo one transaction, then process two new transactions
 *  g) process five transactions, then undo three transactions, then redo one transaction, then undo two transactions
 *  h) process five transactions, then undo two transactions, then process two transactions, then undo three transactions 
 *  i) process five transactions, then undo four transactions, then redo two transactions
 *  j) undoing a transaction on an empty stack, should throw an exception
 *  k) undoing a transaction when there are none to undo, should throw an exception
 *  l) redoing a transaction on an empty stack, should throw an exception
 *  m) redoing a transaction when there are none to redo, should throw an exception
 *  n) peeking at a transaction when there is only one in the stack
 *  o) peeking at a transaction at the top of a stack after multiple undos and redos
 *  p) peeking at a transaction in the middle of a stack after multiple undos and redos
 *  q) peeking at a transaction at the bottom of a stack after multiple undos and redos
 */

/**
 * Executed once before all tests are performed.
 */
beforeAll(() => {
    // INSTANTIATE THE TPS JUST ONCE
    tps = new jsTPS();
});

/**
 * Executed once after all tests are performed.
 */
afterAll(() => {
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
 * Jest test to make sure constructor creates an instance of jsTPS.
 */
test('a) should create an instance of jsTPS', () => {
    const instance = new jsTPS();
    expect(instance).toBeInstanceOf(jsTPS);
});

/**
 * Jest test for a brand new empty stack, then processTransaction
 */
test('b) brand new empty stack, then processTransaction', () => {
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
 * Jest test for process three transactions, then undo three transaction, then process a new transaction
 */
test('c) process three transactions, then undo three transaction, then process a new transaction', () => {
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
 * Jest test for process three transactions, then undo three transaction, then redo two transactions, then process a new transaction
 */
test('d) process three transactions, then undo three transaction, then redo two transactions, then process a new transaction', () => {
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
 * Jest test for process three transactions, then undo three transaction, then redo three transactions, then process a new transaction
 */
test('e) process three transactions, then undo three transaction, then redo three transactions, then process a new transaction', () => {
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
 * Jest test for process three transactions, then undo three transactions, then redo one transaction, then process two new transactions
 */
test('f) process three transactions, then undo three transactions, then redo one transaction, then process two new transactions', () => {
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
 * Jest test for process five transactions, then undo three transactions, then redo one transaction, then undo two transactions
 */
test('g) process five transactions, then undo three transactions, then redo one transaction, then undo two transactions', () => {
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
 * Jest test for process five transactions, then undo two transactions, then process two transactions, then undo three transactions
 */
test('h) process five transactions, then undo three transactions, then process two transactions, then undo three transactions', () => {
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
 * Jest test for process five transactions, then undo four transactions, then redo two transactions
 */
test('i) process five transactions, then undo four transactions, then redo two transactions', () => {
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
 * Jest test for undoing a transaction on an empty stack, should throw an exception
 */
test('j) undoing a transaction on an empty stack, should throw an exception', () => {
    // REBUILD THE PERSON TEST DATA
    TestUtils.resetPersonTest(tps, "Vito", 65);

    expect(() => tps.undoTransaction()).toThrow(tps.TRANSACTION_STACK_EXCEPTION);

    // PROCESS THE FIRST ONE, NOTE BOTH ADDS IT AND ALSO EXECUTES THE TRANSACTION
    TestUtils.testStack(tps, 0, 0, 0, false, false);
    TestUtils.testActualPerson("Vito", 65);
});

/**
 * Jest test for undoing a transaction when there are none to undo, should throw an exception
 */
test('k) undoing a transaction when there are none to undo, should throw an exception', () => {
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
 * Jest test for redoing a transaction on an empty stack, should throw an exception
 */
test('l) redoing a transaction on an empty stack, should throw an exception', () => {
    // REBUILD THE PERSON TEST DATA
    TestUtils.resetPersonTest(tps, "Vito", 65);

    expect(() => tps.doTransaction()).toThrow(tps.TRANSACTION_STACK_EXCEPTION);

    // PROCESS THE FIRST ONE, NOTE BOTH ADDS IT AND ALSO EXECUTES THE TRANSACTION
    TestUtils.testStack(tps, 0, 0, 0, false, false);
    TestUtils.testActualPerson("Vito", 65);
});

/**
 * Jest test for redoing a transaction when there are none to redo, should throw an exception
 */
test('m) redoing a transaction when there are none to redo, should throw an exception', () => {
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
 * Jest test for peeking at a transaction when there is only one in the stack
 */
test('n) peeking at a transaction when there is only one in the stack', () => {
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
 * Jest test for peeking at a transaction at the top of a stack after multiple undos and redos
 */
test('o) peeking at a transaction at the top of a stack after multiple undos and redos', () => {
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
 * Jest test for peeking at a transaction in the middle of a stack after multiple undos and redos
 */
test('p) peeking at a transaction in the middle of a stack after multiple undos and redos', () => {
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
 * Jest test for peeking at a transaction at the bottom of a stack after multiple undos and redos
 */
test('q) peeking at a transaction at the bottom of a stack after multiple undos and redos', () => {
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