import {unsound} from "./unsound";
import {FoundatsionError} from "./error";

export type any_fn = {(...args: any[]): unknown};
export namespace any_fn {
   export const name = "any function";

   export function is(u: unknown): u is any_fn {
      return typeof u === "function";
   }

   export function assert<u>(u: u): asserts u is u & any_fn {
      if (typeof u !== "function") {
         throw new FoundatsionError(
            "Tried asserting for function but failed.\n",
            `typeof value was "${typeof u}" when it should've been "function".`,
         );
      }
   }

   /** Add fields to a function. */
   export function imbue
      <fn extends any_fn, fields extends object>
         (fn: fn, fields: fields):
            fn & fields
   {
      const new_fn = fn.bind(fields);
      for (const [key, value] of Object.entries(fields)) {
         Object.defineProperty(new_fn, key, {value});
      }
      return unsound.shut_up(new_fn);
   }
}
