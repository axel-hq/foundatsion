import {text} from "./text";
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
   export function assert(u: unknown): asserts u is real {
      try {
         number.assert(u);
      } catch (e) {
         if (e instanceof Error) {
            throw new FoundatsionError(
               "Tried asserting for real but failed asserting for number:",
               e,
            );
         } else {
            throw e;
         }
      }
      if (Number.isNaN(u)) {
         throw new FoundatsionError(
            "Tried asserting for number but failed because the value was NaN.",
         );
      }
      if (!Number.isFinite(u)) {
         throw new FoundatsionError(
            `Tried asserting for real but ${text.show(u)} is not finite.`,
         );
      }
   }
   export const from = {
      string(s: string): real {
         let n;
         try {
            n = Number(s);
         } catch (e) {
            if (e instanceof Error) {
               throw new FoundatsionError(
                  "Could not cast string to real because the Number constructor",
                  "threw an error:",
                  e,
               );
            } else {
               throw e;
            }
         }
         if (Number.isNaN(n)) {
            throw new FoundatsionError(
               `Could not cast string to real because ${text.show(s)} was parsed`,
               "as NaN!",
            );
         }
         if (!Number.isFinite(n)) {
            throw new FoundatsionError(
               `Could not cast string (${text.show(s)}) to real because`,
               `${text.show(n)} was not finite!`,
            );
         }
         return unsound.bless<real>(n);
      },
   };
}
