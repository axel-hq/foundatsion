import {rtti} from "./rtti";
import {FoundatsionError} from "./error";

export namespace bigint {
   export const name = "bigint";
   export function is(u: unknown): u is bigint {
      return typeof u === "bigint";
   }
   export function assert(this: typeof bigint, u: unknown): asserts u is bigint {
      if (typeof u !== "bigint") {
         throw new FoundatsionError(
            `Tried asserting for ${this.name} but failed.\n`,
            `typeof value was "${typeof u}" when it should've been "bigint".`,
         );
      }
   }
   export const cast_from = BigInt;
   export const cast_from_number = BigInt;
   export const cast_from_string = BigInt;
}

rtti.verify(bigint);
