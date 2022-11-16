import {FoundatsionError} from "./error";
import {int} from "./int";
import {inter} from "./inter";
import {rtti} from "./rtti";
import {ubigint} from "./ubigint";
import {unsigned} from "./unsigned";
import {unsound} from "./unsound";

export type uint = unsigned & int;
export const uint = {
   ...inter(unsigned, int),
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
};

rtti.verify(uint);
