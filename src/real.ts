import {text} from "./text";
import {number} from "./number";
import {newtype} from "./newtype";
import {FoundatsionError} from "./err";

export type real = newtype<"real", number>;
export namespace real {
   export const name = "real";

   export function is(u: unknown): u is real {
      return number.is(u) && Number.isFinite(u);
   }

   export function assert(u: unknown): asserts u is real {
      try {
         number.assert(u)
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
      if (!Number.isFinite(u)) {
         throw new FoundatsionError(
            `Tried asserting for real but the ${text.stringify(u)} is not finite.`,
         );
      }
   }
}
