import {rtti} from "./rtti";
import {ct_val} from "./type_traits";
import {FoundatsionError} from "./error";

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

   export function from(r: rtti<number> , n: number ): bigint;
   export function from(r: rtti<string> , s: string ): bigint;
   export function from(r: rtti<boolean>, b: boolean): bigint;
   export function from(_: any, u: number | string | boolean): bigint {
      return BigInt(u);
   }
}

ct_val<rtti>(bigint);
