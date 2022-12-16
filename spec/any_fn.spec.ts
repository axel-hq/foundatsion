import test from "ava";
import {F} from "../src";

test("invariant: object", t => {
   t.throws(() => F.any_fn.assert({}));
})

test("invariant: number", t => {
   t.throws(() => F.any_fn.assert(Math.random() * 3000));
});
