import {iT} from "./type_traits";
import {rtti} from "./rtti";
import {text} from "./text";
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
            `Instead, value was ${text.show(u)}`,
         );
      }
   }
}

rtti.verify(iT<boolean>, boolean);
