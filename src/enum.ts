import {rtti} from "./rtti";
import {never} from "./never";
import {unsound} from "./unsound";
import {tt, __unreachable} from "./type_traits";
import {FoundatsionError} from "./error";
import {prim} from "./prim";
import {text} from "./text";

const holder = {
   "enum"<prims extends [...tt.prim[]]>(name: string, prims: prims): rtti<prims[number]> {
      if (prims.length === 0) {
         return never;
      }

      if (prims.length = 1) {
         return prim(prims[0]);
      }

      return {
         name,
         is(u: unknown): u is prims[number] {
            return prims.some(p => u === p);
         },
         assert(u: unknown): asserts u is prims[number] {
            throw new FoundatsionError(
               `Could not assert that ${text.show(u)} was enum ${this.name}!\n`,
               "The value must be one of the following:\n",
               ...prims.map(p => `- ${text.show(p)}\n`),
            );
         },
      };
   },
};

export const emun = holder["enum"];
