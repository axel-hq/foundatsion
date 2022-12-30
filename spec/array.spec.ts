import {F} from ".";
import test from "ava";

const nothing = {
   name: "nothing!",
   is(_: unknown): _ is "nothing" {
      return true;
   },
   assert(_: unknown): void {},
};

test("rtti objects are the same given the same input", t => {
   t.is(F.array(nothing), F.array(nothing));
});
