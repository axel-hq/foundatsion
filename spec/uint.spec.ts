import {F} from ".";
import test from "ava";

test("uint works", t => {
   t.is(F.uint(9) as number, 9);
});
