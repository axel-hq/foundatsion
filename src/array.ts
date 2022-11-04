import {oo} from "./oo";
import {rtti} from "./rtti";
import {unsound} from "./unsound";
import {FoundatsionError} from "./error";

const cache = new WeakMap<rtti, rtti<unknown[]>>();

export function array<t>(r: rtti<t>): rtti<t[]> {
   if (cache.has(r)) {
      return unsound.shut_up(cache.get(r));
   }

   const name = `array<${r.name}>` as const;

   let is = {};
   if (oo.field_is(r, "is", unsound.any_fn)) {
      is = {
         is(u: unknown): boolean {
            return true
               && Array.isArray(u)
               && u.every(elem => r.is(elem));
         },
      };
   }

   let assert = {};
   if (oo.field_is(r, "assert", unsound.any_fn)) {
      assert = {
         assert(u: unknown): void {
            if (!Array.isArray(u)) {
               throw new FoundatsionError(
                  `Tried asserting for ${name} but failed since`,
                  "Array.isArray returned false.",
               );
            }
            unsound.assert<unknown[]>(u);

            for (let i = 0; i < u.length; i++) {
               try {
                  const elem = u[i];
                  unsound.fuck_off(r.assert)(elem);
               } catch (e) {
                  if (e instanceof Error) {
                     throw new FoundatsionError(
                        `While asserting that value was ${name}, an Error was`,
                        `thrown at index ${i}:`,
                        e,
                     );
                  } else {
                     throw e;
                  }
               }
            }
         },
      };
   }

   const artti = unsound.shut_up({...{name}, ...is, ...assert});
   cache.set(r, artti);
   return artti;
}
