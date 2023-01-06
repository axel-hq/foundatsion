import {F} from "./index";
import test from "ava";

const _never = F.enum("empty enum", [] as const);
const never: typeof _never = _never;

// NOTE(Marcus): Currently, an empty enum will not pass the supplied name
// though I am willing to be convinced that the name should be preserved
test("empty enum is the same object as F.never", t => {
   t.is(never, F.never);
});

const _fizzbuzz = F.enum("fizzbuzz outputs", ["fizz", "buzz", "fizzbuzz"] as const);
const fizzbuzz: typeof _fizzbuzz = _fizzbuzz;

test("enum preserves name", t => {
   t.is(fizzbuzz.name, "fizzbuzz outputs");
});

test("enum asserts all members", t => {
   t.notThrows(() => { fizzbuzz.assert("fizz") });
   t.notThrows(() => { fizzbuzz.assert("buzz") });
   t.notThrows(() => { fizzbuzz.assert("fizzbuzz") });
});

test("enum accepts all members", t => {
   t.true(fizzbuzz.is("fizz"));
   t.true(fizzbuzz.is("buzz"));
   t.true(fizzbuzz.is("fizzbuzz"));
});

test("enum rejects non-members", t => {
   t.throws(() => { fizzbuzz.assert("buzzfizz") });
   t.false(fizzbuzz.is("buzzfizz"));
});
