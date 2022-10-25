import {rtti} from "./rtti";
import {unsound} from "./unsound";
import {dyn_record} from "./dyn_record";
import {FoundatsionError} from "./error";

export function array
   <t, name extends string>
      (r: rtti<t, name> & rtti.valid_name<name>):
         rtti<t[], `array<${name}>`>
{
   const name = `array<${r.name}>`;

   let is = {};
   if (dyn_record.field_is(r, "is", unsound.any_fn)) {
      is = {
         is(u: unknown): boolean {
            return true
               && Array.isArray(u)
               && u.every(elem => r.is(elem));
         }
      }
   }

   let assert = {};
   if (dyn_record.field_is(r, "assert", unsound.any_fn)) {
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
         }
      }
   }

   return unsound.shut_up({...{name}, ...is, ...assert});
}
