import {text} from "./text";
import {rtti} from "./rtti";
import {tt} from "./type_traits";
import {FoundatsionError} from "./error";

export function prim<v extends tt.prim>(v: v): rtti<v> {
   const name = text.show(v);
   return {
      name,
      is(u: unknown): u is v {
         return v === u;
      },
      assert(u: unknown): asserts u is v {
         if (v !== u) {
            throw new FoundatsionError(
               `Tried asserting for ${this.name} but the value did not match.\n`,
               `Instead, received ${text.show(u)}.`
            );
         }
      },
   };
}
