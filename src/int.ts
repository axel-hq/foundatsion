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
   export function assert(this: typeof int, u: unknown): asserts u is int {
      if (is(u)) return;
      else throw new FoundatsionError(
         `Tried asserting for ${this.name} but failed Number.isInteger(${text.show(u)})`,
         "returned false.",
      );
   }
   export function cast_from_string(this: typeof int, s: string): int {
      const i = Number(s);
      if (Number.isInteger(i)) return i as int;
      else throw new FoundatsionError(
         `Could not cast string to ${this.name} because Number.isInteger(${text.show(i)})`,
         "returned false."
      );
   }
   export function cast_from_bigint(this: typeof int, b: bigint): int {
      const n = Number(b);
      if (`${b}` !== `${n}`) {
         throw new FoundatsionError(
            `Loss of precision when converting from bigint to ${this.name}!\n`,
            `${b} !== ${n}`,
         );
      }
      return unsound.cast<int>(n);
   }
}

rtti.verify(int);
