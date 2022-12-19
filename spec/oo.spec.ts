import {F} from ".";
import test from "ava";

test("properly asserts empty object", t => {
   t.notThrows(() => {
      const x = {} as unknown;
      F.oo.assert(x);
      x satisfies {};
   });
});

test("asserts function as oo", t => {
   t.notThrows(() => {
      F.oo.assert(t.notThrows);
   });
});

test("throws when asserting number as oo", t => {
   t.throws(() => {
      const y = 1;
      F.oo.assert(y);
   });
});
