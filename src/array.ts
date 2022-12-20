import {oo} from "./oo";
import {rtti} from "./rtti";
import {text} from "./text";
import {unsound} from "./unsound";
import {unknown} from "./unknown";
import {FoundatsionError} from "./error";

const cache = new WeakMap<rtti, rtti<unknown[]>>();

export function array<t>(r: rtti<t>): rtti<t[]> {
   if (cache.has(r)) {
      return unsound.shut_up(cache.get(r));
   }

   const new_rtti = {
      name: `array<${r.name}>`,
      is(u: unknown): u is t[] {
         return true
            && array.is(u)
            && u.every(elem => r.is(elem));
      },
      assert<u>(u: u): asserts u is u & t[] {
         if (!array.is(u)) {
            throw new FoundatsionError(
               `Tried asserting for ${this.name} but failed since`,
               "array.is returned false.\n",
               `Instead, value was ${text.show(u)}`,
            );
         }

         for (let i = 0; i < u.length; i++) {
            try {
               const elem = u[i];
               r.assert(elem);
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

   oo.freeze(new_rtti);
   cache.set(r, new_rtti);

   return new_rtti;
}
export namespace array {
   // Bundlers could change the name of the function declared above.
   // Since we actually depend on this.name, let's explicitly set it.
   Object.defineProperty(array, "name", {value: "array"});
   export function is(u: unknown): u is unknown[] {
      return Array.isArray(u);
   }
   export function assert<u>(this: typeof array, u: u): asserts u is u & unknown[] {
      if (array.is(u)) return;
      throw new FoundatsionError(
         `Tried asserting for ${this.name} but failed since`,
         "array.is returned false.",
      );
   }
}
cache.set(unknown, array);
