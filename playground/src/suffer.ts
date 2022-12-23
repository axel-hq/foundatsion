import {F} from "@axel-hq/foundatsion";

function untrusted(i: F.api_in<F.int>): number {
   F.number.assert(i);
   
}

type z = 1 & never;
