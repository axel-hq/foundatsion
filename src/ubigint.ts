import {T} from "./type_traits";
import {rtti} from "./rtti";
import {inter} from "./inter";
import {any_fn} from "./any_fn";
import {bigint} from "./bigint";
import {unsound} from "./unsound";
import {unsigned} from "./unsigned";
import {FoundatsionError} from "./error";

type force_ubigint<b extends bigint> =
   `${bigint}` extends `${b}`
      ? ubigint
      : `${b}` extends `-${bigint}`
         ? ubigint
         : b;

export type ubigint = unsigned & bigint;
function ubigint_static<b extends bigint>(b: b & force_ubigint<b>): b & ubigint {
   unsound.assert<ubigint>(b);
   return b;
}
export const ubigint = any_fn.imbue(ubigint_static, {
   ...inter(unsigned, bigint),
   name: "ubigint",
   cast_from(u: unknown): ubigint {
      const b = bigint.cast_from(u);
      unsigned.assert(b);
      return b;
   },
   cast_from_string(s: string): ubigint {
      try {
         var b = BigInt(s);
      } catch (e) {
         if (e instanceof Error) {
            throw new FoundatsionError(
               `Tried casting string to ${this.name} but failed since the BigInt`,
               "constructor threw an Error!",
               e,
            );
         }
         throw e;
      }
      try {
         unsigned.assert_from_bigint(b);
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
      return b;
   },
   cast_from_number(n: number): ubigint {
      const b = bigint.cast_from_number(n);
      unsigned.assert_from_bigint(b);
      return b;
   },
});

rtti.verify(T<ubigint>, ubigint);
