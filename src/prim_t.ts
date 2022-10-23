import {text} from "./text";
import {rtti} from "./type_traits";
import {FoundatsionError} from "./err";

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
               `Tried asserting for ${name} but they were not equal.\n`,
               `Instead, received ${text.stringify(v)}.`,
            );
         }
      }
   };
}
