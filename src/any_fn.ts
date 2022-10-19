import {FoundatsionError} from "./err";

export type any_fn = (...args: any[]) => any;
export namespace any_fn {
   export const name = "any function";

   export function is(u: unknown): u is any_fn {
      return typeof u === "function";
   }

   export function assert(u: unknown): asserts u is any_fn {
      if (typeof u !== "function") {
         throw new FoundatsionError(
            "Tried asserting that value was a function but failed because",
            `typeof value was "${typeof u}" instead of "function"!`,
         );
      }
   }
}
