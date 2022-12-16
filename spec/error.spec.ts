import test from "ava";
import {F} from "../src";

const passages = "passages";

test("e.passages is object", t => {
   const e = new F.Error("lorem ipsum");
   t.is(typeof e[passages], "object");
});

test("e.passages is array", t => {
   const e = new F.Error("lorem ipsum");
   t.true(Array.isArray(e.passages));
});

test("FoundatsionError adds spaces to input", t => {
   const e = new F.Error("foo", "bar", "baz");
   t.deepEqual(e.passages, ["foo bar baz"]);
});

test("FoundatsionError separates things into lines", t => {
   const e = new F.Error("foo\n", "bar", "\nbaz\n", "qux");
   t.deepEqual(e.passages, ["foo", "bar", "baz", "qux"]);
});

test("FoundatsionError deals with empty strings well", t => {
   const e = new F.Error(
      "", "", "oh no", "", "\n oh",
      "darn", "", "", "",
      "\noh gosh", "", "oh god", "\n",
      "frick", "", "oh geez\n",
      ""
   );
   t.deepEqual(e.passages, [
      "  oh no ",
      " oh darn   ",
      "oh gosh  oh god",
      "frick  oh geez",
      "",
   ]);
});

test("FoundatsionError handles complex input well", t => {
   const e = new F.Error(
      "When the sunlight strikes raindrops", "in the air,", "they act as a",
      "prism", "and form a rainbow",
      "\nThese take the shape of a long round arch, with its path high above.\n",
      "\nThere is, according to legend",
      "a boiling pot of gold at one end.\n",
      "",
      "\nWhen a man looks for something beyond his reach", "",
      "his friends say he's\nlooking for the pot of gold at the end of", "", "",
      "the rainbow", "", "", "\n",
   );
   const canonical = [
      "When the sunlight strikes raindrops in the air, they act as a prism and form a rainbow",
      "These take the shape of a long round arch, with its path high above.",
      "",
      "There is, according to legend a boiling pot of gold at one end.",
      "",
      "When a man looks for something beyond his reach  his friends say he's",
      "looking for the pot of gold at the end of   the rainbow  ",
   ];
   t.deepEqual(e.passages, canonical);
   const ee = new F.Error(e);
   t.deepEqual(ee.passages, [
      "FoundatsionError:",
      canonical,
   ]);
});
