import {rtti} from "./rtti";
import {FoundatsionError} from "./error";

export namespace number {
   export const name = "number";
   export function is(u: unknown): u is number {
      return typeof u === "number";
   }
   export function assert(this: typeof number, u: unknown): asserts u is number {
      if (typeof u !== "number") {
         throw new FoundatsionError(
            `Tried asserting for ${this.name} but failed.\n`,
            `typeof value was "${typeof u}" but should've been "number".`,
         );
      }
   }

   export const cast_from: {(u: unknown): number} = Number;
   export const cast_from_string: {(s: string): number} = Number;
   export const cast_from_bigint: {(b: bigint): number} = Number;
}

rtti.verify(number);
