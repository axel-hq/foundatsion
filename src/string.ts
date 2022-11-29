import {rtti} from "./rtti";
import {FoundatsionError} from "./error";

export namespace string {
   export const name = "string";
   export function is(u: unknown): u is string {
      return typeof u === "string";
   }
   export function assert(this: typeof string, u: unknown): asserts u is string {
      if (typeof u !== "string") {
         throw new FoundatsionError(
            `Tried asserting for ${this.name} but failed.\n`,
            `typeof value was "${typeof u}" but should've been "string".`,
         );
      }
   }
   export const cast_from = String;
   export const cast_from_bigint = String;
   export const cast_from_number = String;
}
