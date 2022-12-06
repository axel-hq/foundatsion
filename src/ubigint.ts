import {rtti} from "./rtti";
import {inter} from "./inter";
import {bigint} from "./bigint";
import {unsound} from "./unsound";
import {unsigned} from "./unsigned";
import {FoundatsionError} from "./error";
import {T} from "./type_traits";

export type ubigint = unsigned & bigint;
export const ubigint = {
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
         throw new FoundatsionError(
            `Tried casting string to ${this.name} but failed since the BigInt`,
            "constructor threw an Error!",
            unsound.cast<Error>(e),
         );
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
};

rtti.verify(T<ubigint>, ubigint);
