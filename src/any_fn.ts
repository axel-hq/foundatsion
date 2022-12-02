import {FoundatsionError} from "./error";

export type any_fn = {(...args: any[]): unknown};
export namespace any_fn {
   export const name = "any function";

   export function is(u: unknown): u is any_fn {
      return typeof u === "function";
   }

   export function assert(u: unknown): asserts u is any_fn {
      if (typeof u !== "function") {
         throw new FoundatsionError(
            "Tried asserting for function but failed.\n",
            `typeof value was "${typeof u}" when it should've been "function".`,
         );
      }
   }
}
