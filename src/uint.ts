import {int} from "./int";
import {inter} from "./inter";
import {ubigint} from "./ubigint";
import {unsigned} from "./unsigned";
import {unsound} from "./unsound";

export type uint = unsigned & int;
export const uint = {
   ...inter(unsigned, int),
   from: {
      ubigint(u: ubigint): uint {
         return unsound.shut_up(int.from.bigint(u));
      },
   },
};
