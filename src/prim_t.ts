import {text} from "./text";
import {rtti} from "./rtti";
import {FoundatsionError} from "./error";

type primitives =
   | null
   | undefined
   | boolean
   | number
   | bigint
   | string
   | symbol;

export function prim_t<v extends primitives>(v: v): rtti<v> {
   const name = text.stringify(v);
   return {
      name,
      is(u: unknown): u is v {
         return v === u;
      },
      assert(u: unknown): asserts u is v {
         if (v !== u) {
            throw new FoundatsionError(
               `Tried asserting for ${name} but the value did not match.\n`,
               `Instead, received ${text.stringify(v)}.`
            );
         }
      },
   };
}
