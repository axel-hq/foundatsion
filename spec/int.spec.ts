import {F} from ".";
import test from "ava";

// @ts-expect-error
F.int(NaN);

// @ts-expect-error
F.int(Infinity);

// @ts-expect-error
F.int(-Infinity);

// @ts-expect-error
F.int(1 as number);

// @ts-expect-error because the type system doesn't do arithmetic
F.int(4 / 2);

// @ts-expect-error because it has decimal stuff
F.int(1.2);

const one = F.int(1.0);
one satisfies F.real & 1;

const two_or_three = F.int(Math.random() > .5 ? 2 : 3);
two_or_three satisfies F.real & (2 | 3);

test("invariant: NaN", t => {
   const v = NaN;
   t.false(F.int.is(v))
   t.throws(() => {
      F.int.assert(v);
   });
});

test("invariant: Infinity", t => {
   const v = Infinity;
   t.false(F.int.is(v))
   t.throws(() => {
      F.int.assert(v);
   });
});

test("invariant: -Infinity", t => {
   const v = -Infinity;
   t.false(F.int.is(v))
   t.throws(() => {
      F.int.assert(v);
   });
});

test("invariant: (.2 + .1) * 10", t => {
   let v = .2 + .1;
   v *= 10;
   t.false(F.int.is(v));
   t.throws(() => {
      F.int.assert(v);
   });
});

const r = Math.random() * 100 | 0;
test(`random: ${r} as i32 is integer`, t => {
   t.true(F.int.is(r));
   t.notThrows(() => { F.int.assert(r) });
})
