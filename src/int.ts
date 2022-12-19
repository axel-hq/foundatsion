import {T} from "./type_traits";
import {real} from "./real";
import {rtti} from "./rtti";
import {text} from "./text";
import {newtype} from "./newtype";
import {unsound} from "./unsound";
import {FoundatsionError} from "./error";

type no_dot_rec<s extends string> =
   s extends `${infer head}${infer tail}`
      ? head extends "."
         ? int
         : no_dot_rec<tail>
      : unknown;

type force_int<n extends number> =
   `${number}` extends `${n}` // †
      ? int
      : no_dot_rec<`${n}`>;
// †
// Even though n <: number, that does not ensure that n is a unit type
// number & {foo: "bar"} <: number, however we are still unable to determine
// "int-iness", for lack of a better word.
// We can, however, handle unions of unit types, as we can introspect upon those
// the union elements to determine if they satisfy int.

// Something of interest is that even though int(a as (1 | 2)) works perfectly
// well, doing the same thing (or what would appear to be the same thing) at the
// type level does not.

type unknown_for_some_reason = force_int<1 | 2>;

export type int = real & newtype<"int">;
export function int<n extends number>(n: n & force_int<n>): n & int {
   unsound.assert<int>(n);
   return n;
}
export namespace int {
   Object.defineProperty(int, "name", {value: "int"});
   export function is(u: unknown): u is int {
      return Number.isInteger(u);
   }
   export function assert<u>(this: typeof int, u: u): asserts u is u & int {
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

rtti.verify(T<int>, int);
