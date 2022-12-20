import {F} from ".";
import test from "ava";

test("ureal() works", t => {
   t.is(F.ureal(9) as number, 9);
});

test("ureal.assert is callable", t => {
   t.notThrows(() => {
      F.ureal.assert(F.ureal(1));
   });
});
