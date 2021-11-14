class Person {
  id;
  name;
  age;
  constructor({ name, age, id }) {
    this.name = name;
    this.age = age;
    this.id = id;
  }
}

module.exports = {
  Person,
};
