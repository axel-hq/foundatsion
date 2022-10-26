import {rtti} from "./rtti";
import {ct_val} from "./type_traits";
import {FoundatsionError} from "./error";

export namespace never {
   export const name = "never";

   export function is(_: unknown): _ is never {
      return false;
   }

   export function assert(_: unknown): _ is never {
      throw new FoundatsionError(
         "Tried asserting for never but that's absurd!",
      );
   }
}

ct_val<rtti>(never);
