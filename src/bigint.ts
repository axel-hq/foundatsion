import {rtti} from "./rtti";
import {unsound} from "./unsound";
import {FoundatsionError} from "./error";

export namespace bigint {
   export const name = "bigint";
   export function is(u: unknown): u is bigint {
      return typeof u === "bigint";
   }
   export function assert<u>(this: typeof bigint, u: unknown): asserts u is u & bigint {
      if (typeof u !== "bigint") {
         throw new FoundatsionError(
            `Tried asserting for ${this.name} but failed.\n`,
            `typeof value was "${typeof u}" when it should've been "bigint".`,
         );
      }
   }
   export const cast_from: {(u: unknown): bigint} = unsound.shut_up(BigInt);
   export const cast_from_number: {(n: number): bigint} = BigInt;
   export const cast_from_string: {(s: string): bigint} = BigInt;
}

rtti.verify(bigint);
