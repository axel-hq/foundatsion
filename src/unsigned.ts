import {union} from "./union";
import {bigint} from "./bigint";
import {number} from "./number";
import {newtype} from "./newtype";
import {FoundatsionError} from "./error";
import {rtti} from "./rtti";
import {T} from "./type_traits";

{
   const r = union(bigint, number);
   var bigint_or_number: typeof r = r;
}

export type unsigned = (bigint | number) & newtype<"unsigned">;
export namespace unsigned {
   export const name = "unsigned";

   export function is_from_bigint_or_number(b: bigint | number): b is unsigned {
      // NaN fails this as it should
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
         `Could not assert for unsigned because ${b} was not greater than or`,
         "equal to zero!",
      );
   }

   export const assert_from_bigint: {(b: bigint): asserts b is bigint & unsigned}
      = assert_from_bigint_or_number;
   export const assert_from_number: {(n: number): asserts n is number & unsigned}
      = assert_from_bigint_or_number;

   export function assert(u: unknown): asserts u is unsigned {
      try {
         bigint_or_number.assert(u);
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

rtti.verify(T<unsigned>, unsigned);
