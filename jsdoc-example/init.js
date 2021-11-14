// IMPORT TYPE DEFINITION EXAMPLE
/** @typedef {import("./type_person").Person} Person */

// TYPE DEFINITION
/**
 * @typedef {{
 *  id:number;
 *  name?:string;
 *  surname?:string;
 *  birthDate: Date;
 * }} PersonLocal
 */


/** @type {number} */
let age = 25;
/** @type {Person} */
let person = { id: 1, birthDate: new Date() };

//FUNCTION TYPE EXAMPLE
/** @type {(person: Person) => Promise<number>} */
async function getPersonId(person) {
  return person.id;
}
let personId = getPersonId(person);

// TYPE CAST EXAMPLE
/** @type {number | string} */
let stringOrNumber = Math.random() > 0.5 ? "hello" : 1;
// WAY 1
let thisNumber = /** @type {number} */ (stringOrNumber);
//WAY 2
if(typeof stringOrNumber === "string") {
  stringOrNumber;
}
