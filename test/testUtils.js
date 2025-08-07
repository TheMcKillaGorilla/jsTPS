const { Person } = require('./person/Person');
const { IncrementAge_Transaction } = require('./person/IncrementAge_Transaction');
const { ChangeName_Transaction } = require('./person/ChangeName_Transaction');

TestUtils = {
    makeIncrementAgeTransaction(inc) {
        return new IncrementAge_Transaction(this.actualPerson, inc);
    },

    makeNameTransaction(newName) {
        return new ChangeName_Transaction(this.actualPerson, newName);
    },

    resetPersonTest(tps, initName, initAge) {
        // THIS WILL BE USED FOR ALL TESTS
        this.actualPerson = new Person(initName, initAge);

        // FIRST CHECK TO MAKE SURE OUR CONTROL TYPES MATCH
        this.testActualPerson(initName, initAge);
        
        // MAKE SURE THE TPS STARTS OFF CLEARED
        this.testCleared(tps);     
    },

    testActualPerson(expectedName, expectedAge) {
        let expectedPerson = new Person(expectedName, expectedAge);
        expect(this.actualPerson).toStrictEqual(expectedPerson);
    },

    testCleared: function (tps) {
        expect(this.testStack(tps, 0, 0, 0, false, false));
        expect(tps.getSize()).toBe(0);
    },

    testIncrementAgeTransaction: function(transaction, inc) {
        expect(transaction.inc).toBe(inc);
    },

    testNameTransaction: function(transaction, name) {
        expect(transaction.newName).toBe(name);
    },

    testStack: function (tps, size, doSize, undoSize, canDo, canUndo) {
        expect(Array.isArray(tps.transactions)).toBe(true);
        expect(tps.getSize()).toBe(size);
        expect(tps.getDoSize()).toBe(doSize);
        expect(tps.getUndoSize()).toBe(undoSize);
        expect(tps.hasTransactionToDo()).toBe(canDo);
        expect(tps.hasTransactionToUndo()).toBe(canUndo);
    }
}

module.exports = { TestUtils };