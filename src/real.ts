import {rtti} from "./rtti";
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
            `Tried asserting for real but ${text.stringify(u)} is not finite.`,
         );
      }
   }

   export const from = {
      bigint(b: bigint): real {
         if (b > Number.MAX_SAFE_INTEGER) {
            throw new FoundatsionError(
               "Could not cast bigint to real because",
               `${b} > ${Number.MAX_SAFE_INTEGER}!`,
            );
         }
         if (b < Number.MIN_SAFE_INTEGER) {
            throw new FoundatsionError(
               "Could not cast bigint to real because",
               `${b} < ${Number.MIN_SAFE_INTEGER}`,
            );
         }

         return unsound.cast<real>(Number(b));
      },
   };
}

rtti.verify(real);
