import {rtti, unit} from "./type_traits";

export namespace unknown {
   export const name = "unknown";

   export function is(_: unknown): _ is unknown {
      return true;
   }

   export const assert: rtti.assert = unit;
}
