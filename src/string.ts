import {FoundatsionError} from "./err";

export namespace string {
   export const name = "string";

   export function is(u: unknown): u is string {
      return typeof u === "string";
   }

   export function assert(u: unknown): asserts u is string {
      if (typeof u !== "string") {
         throw new FoundatsionError(
            "Tried asserting for string but failed.\n",
            `typeof value was "${typeof u}" but should've been "string".`,
         );
      }
   }
}