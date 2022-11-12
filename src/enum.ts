import {prim} from "./prim";
import {text} from "./text";
import {rtti} from "./rtti";
import {never} from "./never";
import {FoundatsionError} from "./error";
import {tt, __unreachable} from "./type_traits";

type require_const_prim_tpl<ts extends tt.prim[]> = {
   [k in (number & keyof ts)]: tt.is_const_prim<ts[k]> extends true ? ts[k] : tt.const_prim;
};

export function f_enum
   <prims extends tt.prim[]>
      (name: string, prims: readonly [...prims] & require_const_prim_tpl<prims>):
         rtti<prims[number]>;
export function f_enum(name: string, prims: readonly tt.prim[]): rtti {
   if (prims.length === 0) {
      return never;
   }

   if (prims.length === 1) {
      return prim(prims[0]);
   }

   return {
      name,
      is(u: unknown): u is unknown {
         return prims.some(p => p === u);
      },
      assert(u: unknown): asserts u is unknown {
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
