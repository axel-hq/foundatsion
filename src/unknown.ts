import {rtti, unit} from "./type_traits";

export namespace unknown {
   export const name = "unknown";

   export function is(u: unknown): u is unknown {
      return true;
   }

   export const assert: rtti.assert = unit;
}
