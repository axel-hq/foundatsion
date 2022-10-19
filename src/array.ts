import {obj} from "./obj";
import {rtti} from "./type_traits";
import {any_fn} from "./any_fn";
import {unsound} from "./unsound";
import {FoundatsionError} from "./err";

export type array = unknown[];
export namespace array {
   export const name = "array";

   export function is(u: unknown): u is array {
      return Array.isArray(u);
   }

   export function assert(u: unknown): asserts u is array {
      if (!is(u)) {
         throw new FoundatsionError(
            "Tried asserting that value was array but failed!\n",
            `typeof value = "${typeof u}`,
            `value = ${u}`,
         );
      }
   }

   export type typed<r extends rtti> =
      & rtti.has_name
      & (r extends rtti.has_is<infer t> ? rtti.has_is<t[]> : {})
      & (r extends rtti.has_assert<infer t> ? rtti.has_assert<t[]> : {})

   export function typed<r extends rtti>(r: r): typed<r> {
      const name = {name: `${r.name} array`};

      let is = {};
      if (obj.field_is(r, "is", any_fn)) {
         is = {
            is(u: unknown): boolean {
               if (!array.is(u)) {
                  return false;
               }
               return u.every(elem => r.is(elem));
            }
         }
      }

      let assert = {};
      if (obj.field_is(r, "assert", any_fn)) {
         assert = {
            assert(u: unknown): void {
               array.assert(u);
               for (let i = 0; i < u.length; i++) {
                  try {
                     const elem = u[i];
                     unsound.fuck_off(r.assert)(elem);
                  } catch (e) {
                     if (e instanceof Error) {
                        throw new FoundatsionError(
                           "While asserting that array was homogeneous with type",
                           `${r.name}, an Error was thrown at index ${i}!`,
                           e,
                        );
                     } else {
                        throw e;
                     }
                  }
               }
            }
         }
      }

      return unsound.shut_up({...name, ...is, ...assert});
   }
}
