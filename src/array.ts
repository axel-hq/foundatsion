import {rtti} from "./rtti";
import {unsound} from "./unsound";
import {FoundatsionError} from "./error";

const cache = new WeakMap<rtti, rtti<unknown[]>>();

export function array<t>(r: rtti<t>): rtti<t[]> {
   if (cache.has(r)) {
      return unsound.shut_up(cache.get(r));
   }

   return {
      name: `array<${r.name}>`,
      is(u: unknown): u is t[] {
         return true
            && Array.isArray(u)
            && u.every(elem => r.is(elem));
      },
      assert(u: unknown): asserts u is t[] {
         if (!Array.isArray(u)) {
            throw new FoundatsionError(
               `Tried asserting for ${this.name} but failed since`,
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
                     `While asserting that value was ${this.name}, an Error was`,
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
