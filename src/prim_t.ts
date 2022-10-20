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

export function prim_t<v extends primitives>(v: v, name: string): rtti<v> {
   return {
      name,
      is(u: unknown): u is v {
         return v === u;
      },
      assert(u: unknown): asserts u is v {
         if (v !== u) {
            throw new FoundatsionError(
               ""
            );
         }
      }
   };
}
