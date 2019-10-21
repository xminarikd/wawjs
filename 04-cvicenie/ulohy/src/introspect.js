/*
Implementation of "better" introspection functions
Just as an excercise, 
some of them may be useful in real life as well
*/
module.exports = {
  allOwnKeys,
  allOwnValues,
  allOwnEntries,
  getProtoChain,
  allKeys,
  forIn,
  shallowClone,
  hasInheritedProperty,
  hasOverridenProperty
};
// Object.keys supporting Symbols and non-enumerables
function allOwnKeys(o) {
  let prop = Object.getOwnPropertyNames(o);
  let sym = Object.getOwnPropertySymbols(o);
  //console.log(prop.concat(sym));
  return prop.concat(sym);
}
// Object.values supporting Symbols and non-enumerables
function allOwnValues(o) {
  //console.log(allOwnKeys(o).map(key => o[key]));
  return allOwnKeys(o).map(key => o[key]);
}
// Object.entries supporting Symbols and non-enumerables
function allOwnEntries(o) {
  return allOwnKeys(o).map(key => [key, o[key]]);
}
// [obj,...protos] array of objects in proto chain
// starting with obj itself and up-the chain
function getProtoChain(obj) {
  let arr = [obj];
  while ((obj = Object.getPrototypeOf(obj))) {
    arr.push(obj);
  }
  return arr;
}
// Object.keys including, inherited, not-enumeble, symbols
function allKeys(obj) {}

// for..in loop supporting Symbols and non-enumerable
// for own and inherited properties
function forIn(obj, callback) {}
// create copy of object
// with same propereties,
// including symbols,
// same values
// and same property ownership
function shallowClone(obj) {
  return Object.create(
    Object.getPrototypeOf(obj),
    Object.getOwnPropertyDescriptors(obj)
  );
}

// if the property exists only in proto chain
// not on object
function hasInheritedProperty(obj, prop) {}

function hasOverridenProperty(obj, prop) {}
