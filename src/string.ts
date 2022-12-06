import {FoundatsionError} from "./error";

export namespace string {
   export const name = "string";
   export function is(u: unknown): u is string {
      return typeof u === "string";
   }
   export function assert<u>(this: typeof string, u: u): asserts u is u & string {
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

// no verify because rtti depends on string
