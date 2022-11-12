// tuple with .length = n
import {rtti} from "./rtti";
import {unsound} from "./unsound";
import {__unreachable} from "./type_traits";
import {FoundatsionError} from "./error";

type decant_tuple<rs extends readonly [...rtti[]]> =
   rs extends readonly [rtti<infer t>, ...infer tail extends [...rtti[]]]
      ? [t, ...decant_tuple<tail>]
      : [];

export function tuple<rs extends rtti[]>(...rs: readonly [...rs]): rtti<decant_tuple<rs>> {
   const name = `[${rs.map(r => r.name).join(", ")}]`;
   return {
      name,
      is(u: unknown): u is decant_tuple<rs> {
         if (!Array.isArray(u)) {
            return false;
         }
         unsound.assert<unknown[]>(u);
         if (u.length !== rs.length) {
            return false;
         }
         for (let i = 0; i < rs.length; i++) {
            const r = rs[i];
            if (r === undefined) {
               __unreachable();
            }
            if (!r.is(u[i])) {
               return false;
            }
         }
         return true;
      },
      assert(u: unknown): void {
         if (!Array.isArray(u)) {
            throw new FoundatsionError(
               `Since ${this.name} extends array<unknown>, tried asserting for`,
               "array<unknown> but failed since Array.isArray returned false.",
            );
         }
         unsound.assert<unknown[]>(u);
         if (u.length !== rs.length) {
            throw new FoundatsionError(
               `Tried asserting for ${this.name} but the lengths were`,
               "different.\n",
               `Wanted:   {length: ${rs.length}}\n`,
               `Received: {length: ${u.length}}\n`,
            );
         }
         for (let i = 0; i < rs.length; i++) {
            const maybe_r = rs[i];
            if (maybe_r === undefined) {
               __unreachable();
            }
            // picky typescript
            const r: typeof maybe_r = maybe_r;
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
         }
      },
   };
}
