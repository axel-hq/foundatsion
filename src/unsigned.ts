import {rtti} from "./rtti";
import {union} from "./union";
import {bigint} from "./bigint";
import {number} from "./number";
import {newtype} from "./newtype";
import {FoundatsionError} from "./error";

const bigint_or_number = union(bigint, number);
export type unsigned = (bigint | number) & newtype<"unsigned">;
export namespace unsigned {
   export function is_from_bigint_or_number(b: bigint | number): b is unsigned {
      return b >= 0;
   }
   export const is_from_bigint = is_from_bigint_or_number;
   export const is_from_number = is_from_bigint_or_number;

   export function is(u: unknown): u is unsigned {
      return bigint_or_number.is(u) && is_from_bigint_or_number(u);
   }

   export function assert_from_bigint_or_number(b: bigint | number): asserts b is unsigned {
      if (is_from_bigint_or_number(b)) return;
      throw new FoundatsionError(
         "While asserting for unsigned ",
         `${b} was not greater than or equal to zero!`,
      );
   }
   export const assert_from_bigint = assert_from_bigint_or_number;
   export const assert_from_number = assert_from_bigint_or_number;
   export function assert(u: unknown): asserts u is unsigned {
      try {
         rtti.assert(bigint_or_number, u);
         assert_from_bigint_or_number(u);
      } catch (e) {
         if (e instanceof Error) {
            throw new FoundatsionError(
               "While asserting for unsigned an error was thrown:",
               e,
            );
         } else {
            throw e;
         }
      }
   }
}
