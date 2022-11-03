import {real} from "./real";
import {rtti} from "./rtti";
import {text} from "./text";
import {newtype} from "./newtype";
import {unsound} from "./unsound";
import {FoundatsionError} from "./error";

export type int = real & newtype<"int">;
export namespace int {
   export const name = "int";
   export function is(u: unknown): u is int {
      return Number.isInteger(u);
   }
   export function assert(u: unknown): asserts u is int {
      if (is(u)) return;
      else throw new FoundatsionError(
         `Could not assert to int because Number.isInteger(${text.show})`,
         "returned false.",
      );
   }
   export const from = {
      bigint(b: bigint): int {
         const n = Number(b);
         if (`${b}` !== `${n}`) {
            throw new FoundatsionError(
               "Loss of precision when converting from bigint to int!\n",
               `${b} !== ${n}`,
            );
         }
         return unsound.cast<int>(n);
      },
   };
}

rtti.verify(real);
