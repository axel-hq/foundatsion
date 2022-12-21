import {iT} from "./type_traits";
import {rtti} from "./rtti";
import {text} from "./text";
import {union} from "./union";
import {bigint} from "./bigint";
import {number} from "./number";
import {newtype} from "./newtype";
import {FoundatsionError} from "./error";

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

   export function assert_from_bigint_or_number<b extends bigint | number>(b: b): asserts b is b & unsigned {
      if (is_from_bigint_or_number(b)) return;
      throw new FoundatsionError(
         `Could not assert for unsigned because ${text.show(b)} was not greater than or`,
         "equal to zero!",
      );
   }

   export const assert_from_bigint: {<b extends bigint>(b: b): asserts b is b & unsigned}
      = assert_from_bigint_or_number;
   export const assert_from_number: {<n extends number>(n: n): asserts n is n & unsigned}
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

rtti.verify(iT<unsigned>, unsigned);
