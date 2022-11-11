import {F} from "@axel-hq/foundatsion";
import {ubigint} from "./ubigint";

export type uint = F.unsigned & F.int;
export const uint = {
   ...F.inter(F.unsigned, F.int),
   from: {
      ubigint(u: ubigint): uint {
         return F.unsound.shut_up(F.int.from.bigint(u));
      },
   },
};
