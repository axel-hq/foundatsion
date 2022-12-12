// tuple with .length = n
import {rtti} from "./rtti";
import {array} from "./array";
import {unsound} from "./unsound";
import {__unreachable} from "./type_traits";
import {FoundatsionError} from "./error";
import {text} from "./text";

type decant_tuple<rs extends readonly [...rtti[]]> =
   rs extends readonly [rtti<infer t>, ...infer tail extends [...rtti[]]]
      ? [t, ...decant_tuple<tail>]
      : [];

export function tuple<rs extends rtti[]>(...rs: readonly [...rs]): rtti<decant_tuple<rs>> {
   const name = `[${rs.map(r => r.name).join(", ")}]`;
   return {
      name,
      is(u: unknown): u is decant_tuple<rs> {
         if (!array.is(u)) {
            return false;
         }
         if (u.length !== rs.length) {
            return false;
         }

         return rs.every((r, i) => r.is(u[i]));
      },
      assert(u: unknown): void {
         if (!array.is(u)) {
            throw new FoundatsionError(
               `Since ${this.name} extends array<unknown>, tried asserting for`,
               "array<unknown> but failed since array.is returned false.",
               `Instead, value was ${text.show(u)}`,
            );
         }
         if (u.length !== rs.length) {
            throw new FoundatsionError(
               `Tried asserting for ${this.name} but the lengths were`,
               "different.\n",
               `Wanted:   {length: ${rs.length}}\n`,
               `Received: {length: ${u.length}}\n`,
            );
         }

         rs.forEach((_r, i) => {
            const r: typeof _r = _r;
            try {
               r.assert(u[i]);
            } catch (e) {
               if (e instanceof Error) {
                  throw new FoundatsionError(
                     `While asserting for ${this.name}, an error was`,
                     `thrown at index ${i}:`,
                     e,
                  );
               } else {
                  throw e;
               }
            }
         });
      },
   };
}
