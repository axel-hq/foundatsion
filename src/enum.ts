import {prim} from "./prim";
import {text} from "./text";
import {rtti} from "./rtti";
import {never} from "./never";
import {FoundatsionError} from "./error";
import {tt, __unreachable} from "./type_traits";

export function f_enum
   <prims extends tt.prim[]>
      (name: string, prims: readonly [...prims] & tt.require_unit_tpl<prims>):
         rtti<prims[number]>
{
   if (prims.length === 0) {
      return never;
   }

   if (prims.length === 1) {
      return {...prim(prims[0]), name};
   }

   return {
      name,
      is(u: unknown): u is prims[number] {
         return prims.some(p => p === u);
      },
      assert<u>(u: u): asserts u is u & unknown {
         if (this.is(u)) {
            return;
         } else {
            throw new FoundatsionError(
               `Could not assert that ${text.show(u)} was enum ${this.name}!\n`,
               "The value must be one of the following:\n",
               ...prims.map(p => `- ${text.show(p)}\n`),
            );
         }
      },
   };
}
