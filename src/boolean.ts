import {rtti} from "./rtti";
import {FoundatsionError} from "./error";

export namespace boolean {
   export const name = "boolean";
   export function is(u: unknown): u is boolean {
      return typeof u === "boolean";
   }
   export function assert<u>(this: typeof boolean, u: u): asserts u is u & boolean {
      if (typeof u !== "boolean") {
         throw new FoundatsionError(
            `Tried asserting for ${this.name} but failed.\n`,
            `typeof value was "${typeof u}" when it should've been "boolean".`,
         );
      }
   }
}

rtti.verify(boolean);
