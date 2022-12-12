import {T} from "./type_traits";
import {rtti} from "./rtti";
import {FoundatsionError} from "./error";
import {text} from "./text";

export namespace number {
   export const name = "number";
   export function is(u: unknown): u is number {
      return typeof u === "number";
   }
   export function assert<u>(this: typeof number, u: u): asserts u is u & number {
      if (typeof u !== "number") {
         throw new FoundatsionError(
            `Tried asserting for ${this.name} but failed.\n`,
            `typeof value was "${typeof u}" but should've been "number".`,
            `Instead, value was ${text.show(u)}`,
         );
      }
   }

   export const cast_from: {(u: unknown): number} = Number;
   export const cast_from_string: {(s: string): number} = Number;
   export const cast_from_bigint: {(b: bigint): number} = Number;
}

rtti.verify(T<number>, number);
