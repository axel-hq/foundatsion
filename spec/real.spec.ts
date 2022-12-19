import {F} from ".";
import test from "ava";

// @ts-expect-error
F.real(NaN);

// @ts-expect-error
F.real(Infinity);

// @ts-expect-error
F.real(-Infinity);

// @ts-expect-error
F.real(1 as number);

// @ts-expect-error because the type system doesn't do arithmetic
F.real(4 / 2);

const one = F.real(1);
one satisfies 1;

const two_or_three = F.real(Math.random() > .5 ? 2 : 3);
two_or_three satisfies 2 | 3;

test("invariant: NaN", t => {
   const v = NaN;
   t.false(F.real.is(v))
   t.throws(() => {
      F.real.assert(v);
   });
});

test("invariant: Infinity", t => {
   const v = Infinity;
   t.false(F.real.is(v))
   t.throws(() => {
      F.real.assert(v);
   });
});

test("invariant: -Infinity", t => {
   const v = -Infinity;
   t.false(F.real.is(v))
   t.throws(() => {
      F.real.assert(v);
   });
});
