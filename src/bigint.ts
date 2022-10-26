import {rtti} from "./rtti";
import {FoundatsionError} from "./error";
import {ct_val} from "./type_traits";

export namespace bigint {
   export const name = "bigint";

   export function is(u: unknown): u is bigint {
      return typeof u === "bigint";
   }

   export function assert(u: unknown): asserts u is bigint {
      if (typeof u !== "bigint") {
         throw new FoundatsionError(
            "Tried asserting for bigint but failed.\n",
            `typeof value was "${typeof u}" when it should've been "bigint".`,
         );
      }
   }

   export const from = {
      number: BigInt,
      string: BigInt,
      boolean: BigInt,
   }
}

ct_val<rtti>(bigint);
