import {real} from "./real";
import {bigint} from "./bigint";
import {newtype} from "./newtype";

export type unsigned = (bigint | real) & newtype<"unsigned">;
export namespace unsigned {
   export function is(u: unknown): u is unsigned {
      return (real.is(u) || bigint.is(u)) && u >= 0;
   }
   export function assert(u: unknown): asserts u is unsigned {
      if (real.is(u)) {
         
      }
      if (bigint.is())
   }
}
