const {F} = require("../bin/cjs");

let a_is_b = {
   name: "a=b",
   assert(u) {
      F.oo.assert(u);
      F.oo.assert_field_is(u, "a", F.number);
      F.oo.assert_field_is(u, "b", F.number);
      if (u.a === u.b) {}
      else {
         throw new F.Error("a !== b");
      }
   },
};
a_is_b.is = F.rtti.is_from_assert(a_is_b.assert),

F.rtti.verify(F.T, a_is_b);

const ab = {
   a: 3,
   b: 3,
};
a_is_b.assert(ab);

(() => {
   try {
      const ba = {
         a: 2,
         b: 4,
      };
      a_is_b.assert(ba);
   } catch (e) {
      if (e instanceof Error) return;
      throw e;
   }
   throw new F.Error("Didn't error");
})();

console.log("Passed");
