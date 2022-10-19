import {FoundatsionError} from "./err";

export namespace number {
   export const name = "number";
   export function is(u: unknown): u is number {
      return typeof u === "number" && !Number.isNaN(u);
   }
   export function assert(u: unknown): asserts u is number {
      if (typeof u !== "number") {
         throw new FoundatsionError(
            "Tried asserting that value was number but failed!\n",
            `typeof value was "${typeof u}" but should've been "number"!`,
         );
      }
      if (Number.isNaN(u)) {
         throw new FoundatsionError(
            "Tried asserting that value was number but failed",
            "because the value was NaN.",
         );
      }
   }
}
