import {F} from ".";
import test from "ava";

test("ubigint works", t => {
   t.is(F.ubigint(9n) as bigint, 9n);
});
