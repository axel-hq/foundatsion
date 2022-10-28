import {text} from "./text";
import {number} from "./number";
import {newtype} from "./newtype";
import {FoundatsionError} from "./error";

declare function takes_number(n: number): void;
takes_number(1);
declare function takes_foo(foo: foo): void;
takes_foo(1);
declare const foo: foo;
takes_foo(foo);

export type real = newtype<"real", number | string>;
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
}
