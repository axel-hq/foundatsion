import {rtti} from "./rtti";
import {ignore, T} from "./type_traits";

export namespace unknown {
   export const name = "unknown";
   export function is(_: unknown): _ is unknown {
      return true;
   }
   export const assert: rtti.assert = ignore;
}

rtti.verify(T<unknown>, unknown);
