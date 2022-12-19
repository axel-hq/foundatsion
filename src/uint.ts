import {T} from "./type_traits";
import {int} from "./int";
import {rtti} from "./rtti";
import {inter} from "./inter";
import {any_fn} from "./any_fn";
import {ubigint} from "./ubigint";
import {unsound} from "./unsound";
import {unsigned} from "./unsigned";
import {FoundatsionError} from "./error";

type no_dot_rec<s extends string> =
   s extends `${infer head}${infer tail}`
      ? head extends "."
         ? uint
         : no_dot_rec<tail>
      : unknown;

type force_uint<n extends number> =
   `${number}` extends `${n}`
      ? uint
      : `${n}` extends `-${number}`
         ? uint
         : no_dot_rec<`${n}`>;

export type uint = unsigned & int;
function uint_static<n extends number>(n: n & force_uint<n>): n & uint {
   unsound.assert<uint>(n);
   return n;
}
export const uint = any_fn.imbue(uint_static, inter(unsigned, int), {
   name: "uint",
   cast_from_ubigint(u: ubigint): uint {
      return unsound.bless<uint>(int.cast_from_bigint(u));
   },
   cast_from_string(s: string): uint {
      try {
         const i = int.cast_from_string(s);
         unsigned.assert(i);
         return i;
      } catch (e) {
         if (e instanceof Error) {
            throw new FoundatsionError(
               `Tried casting string to ${this.name} but failed!`,
               e,
            );
         } else {
            throw e;
         }
      }
   },
});

rtti.verify(T<uint>, uint);
