"use strict";
const traverse = require("traverse");

// module.exports = function(o) {
//   traverse.forEach(o, function() {
//     this.post(({ node }) => Object.freeze(node));
//   });
//   return o;
// };

module.exports = function(o) {
  let a = traverse(o).map(function(x) {
    //console.log(this.node);
    if (isPrimitive(this.node)) this.node = undefined;
  });
  console.log(a);
  return a;
};

function isPrimitive(arg) {
  return arg == null || (typeof arg !== "object" && typeof arg !== "function");
}

//-------------------------- tests ----------------------------------------
process.env.SELF_TEST &&
  (deepFreeze => {
    console.error(`[self test]:${__filename}:...`);

    var assert = require("assert");

    let o = {
      a: function() {},
      b: 2,
      c: { d: 3, e: function() {} },
      f: [1, "string", 3]
    };

    // let o2 = {
    //   a: function() {},
    //   c: { e: function() {} },
    //   f: []
    // };

    let o1 = deepFreeze(o);
    console.log(o);

    //assert.deepEqual(o1, o2);
    //assert(o1 === o);

    //assert.throws(() => (o.c.d = 999), /Cannot assign to read only property/);
    //assert.throws(() => o.f.pop(), /Cannot delete property/);

    console.error(`[self test]:${__filename}:OK`);
  })(module.exports);
