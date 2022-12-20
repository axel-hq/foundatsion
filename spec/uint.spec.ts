import {F} from ".";
import test from "ava";

test("uint() works", t => {
   t.is(F.uint(9) as number, 9);
});

test("uint.assert is callable", t => {
   t.notThrows(() => {
      F.uint.assert(1);
   });
});
