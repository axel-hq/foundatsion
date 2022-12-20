import {T} from "./type_traits";
import {real} from "./real";
import {rtti} from "./rtti";
import {inter} from "./inter";
import {any_fn} from "./any_fn";
import {unsound} from "./unsound";
import {unsigned} from "./unsigned";
import {FoundatsionError} from "./error";

type force_ureal<n extends number> =
   `${number}` extends `${n}`
      ? ureal
      : `${n}` extends `-${number}`
         ? ureal
         : n;

export type ureal = unsigned & real;
function ureal_static<n extends number>(n: n & force_ureal<n>): n & ureal {
   unsound.assert<ureal>(n);
   return n;
}
export const ureal = any_fn.imbue(ureal_static, {
   ...inter(unsigned, real),
   name: "ureal",
   cast_from_string(s: string): ureal {
      try {
         const r = real.cast_from_string(s);
         unsigned.assert_from_number(r);
         return r;
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

rtti.verify(T<ureal>, ureal);
