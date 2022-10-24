import {FoundatsionError} from "./error";

export namespace boolean {
   export const name = "boolean";

   export function is(u: unknown): u is boolean {
      return typeof u === "boolean";
   }

   export function assert(u: unknown): asserts u is boolean {
      if (typeof u !== "boolean") {
         throw new FoundatsionError(
            "Tried asserting for boolean but failed.\n",
            `typeof value was "${typeof u}" when it should've been "boolean".`,
         );
      }
   }
}
