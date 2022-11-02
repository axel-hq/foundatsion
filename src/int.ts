import {real} from "./real";
import {rtti} from "./rtti";
import {text} from "./text";
import {number} from "./number";
import {newtype} from "./newtype";
import {unsound} from "./unsound";
import {FoundatsionError} from "./error";

export type int = real & newtype<"int">;
export namespace int {
   export const name = "int";
   export function is(u: unknown): u is int {
      return Number.isInteger(u);
   }
   export function assert(u: unknown): asserts u is real {
      if (is(u)) return;
      else throw new FoundatsionError(
         `Could not assert to int because Number.isInteger(${text.stringify})`,
         "returned false.",
      );
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
