export default class Person {
    constructor(initName, initAge) {
        this.name = initName;
        this.age = initAge;
    }

    getName() {
        return this.name;
    }

    getAge() {
        return this.age;
    }

    setName(initName) {
        this.name = initName;
    }

    setAge(initAge) {
        this.age = initAge;
    }

    equals(otherPerson) {
        return (this.name === otherPerson.name)
            && (this.age === otherPerson.age);
    }

    toString() {
        return this.name + " (Age " + this.age + ")";
    }
}