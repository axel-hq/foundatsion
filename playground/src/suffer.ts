import {F} from "@axel-hq/foundatsion";

function untrusted(i: F.api_in<F.int>): number {
   F.number.assert(i);
   return i;
}

type z = 1 & never;

type x = readonly ["hello", ...number[], "goodbye"];

const x: x = ["hello", 0, 1, 2, "goodbye"] as const;
