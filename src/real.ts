import {text} from "./text";
import {rtti} from "./rtti";
import {number} from "./number";
import {newtype} from "./newtype";
import {unsound} from "./unsound";
import {FoundatsionError} from "./error";

export type real = number & newtype<"real">;
export namespace real {
   export const name = "real";
   export function is(u: unknown): u is real {
      return number.is(u) && (!Number.isNaN(u)) && Number.isFinite(u);
   }
   export function assert<u>(this: typeof real, u: u): asserts u is u & real {
      try {
         number.assert(u);
      } catch (e) {
         if (e instanceof Error) {
            throw new FoundatsionError(
               `Tried asserting for ${this.name} but failed asserting for number:`,
               e,
            );
         } else {
            throw e;
         }
      }
      if (Number.isNaN(u)) {
         throw new FoundatsionError(
            `Tried asserting for ${this.name} but failed because the value was NaN.`,
         );
      }
      if (!Number.isFinite(u)) {
         throw new FoundatsionError(
            `Tried asserting for ${this.name} but ${text.show(u)} is not finite.`,
         );
      }
   }
   export function cast_from_string(this: typeof real, s: string): real {
      try {
         var n = Number(s);
      } catch (e) {
         if (e instanceof Error) {
            throw new FoundatsionError(
               `Could not cast string to ${this.name} because the Number`,
               "constructor threw an error:",
               e,
            );
         } else {
            throw e;
         }
      }
      if (Number.isNaN(n)) {
         throw new FoundatsionError(
            `Could not cast string to ${this.name} because ${text.show(s)}`,
            "was parsed as NaN!",
         );
      }
      if (!Number.isFinite(n)) {
         throw new FoundatsionError(
            `Could not cast string (${text.show(s)}) to ${this.name} because`,
            `${text.show(n)} was not finite!`,
         );
      }
      return unsound.bless<real>(n);
   }
}

rtti.verify(real);
