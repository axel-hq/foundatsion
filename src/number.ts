import {FoundatsionError} from "./error";

export namespace number {
   export const name = "number";

   export function is(u: unknown): u is number {
      return typeof u === "number";
   }

   export function assert(u: unknown): asserts u is number {
      if (typeof u !== "number") {
         throw new FoundatsionError(
            "Tried asserting for number but failed.\n",
            `typeof value was "${typeof u}" but should've been "number".`,
         );
      }
   }
}
