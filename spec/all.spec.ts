import {F} from ".";
import test from "ava";

const fields = [
   "array", "any_fn", "assert", "assert_and_return", "auto", "bigint",
   "boolean", "enum", "Error", "int", "inter", "never", "unwrap", "number",
   "oo", "prim", "rtti", "string", "symbol", "text", "tuple", "__unreachable",
   "ignore", "absurd", "id", "ct_true", "T", "tt", "ubigint", "uint", "union",
   "unknown", "unsigned", "unsound", "ureal",
];

for (const field of fields) {
   test(`F.${field} is truthy`, t => {
      t.truthy((F as any)[field]);
   });
}
