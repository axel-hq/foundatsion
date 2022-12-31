import {F} from ".";
import test from "ava";

test("invariant: object", t => {
   t.throws(() => { F.any_fn.assert({}) });
});

test("invariant: number", t => {
   t.throws(() => { F.any_fn.assert(Math.random() * 3000) });
});

test("imbue makes new function", t => {
   const new_id = F.any_fn.imbue(F.id, {});
   t.not(new_id, F.id);
});

test("imbue returns an identical function", t => {
   const new_id = F.any_fn.imbue(F.id, {});
   const rand = Math.random() * 300 | 0;
   t.is(new_id(rand), rand);
});

test("imbue does not modify original", t => {
   F.any_fn.imbue(F.any_fn.imbue, {key: "value"});
   // @ts-expect-error
   void F.any_fn.imbue.key;
   t.not((F.any_fn.imbue as any).key, "value");
});

test("imbue correctly collapses into new function", t => {
   const new_id = F.any_fn.imbue(F.id, {
      lorem: "ibsum",
      wait: "that was a typo",
   });

   t.is(new_id.lorem, "ibsum");
   t.is(new_id.wait, "that was a typo");
});
