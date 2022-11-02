// tuple with .length = n
import {rtti} from "./rtti";
import {unsound} from "./unsound";
import {__unreachable} from "./type_traits";
import {FoundatsionError} from "./error";

type unwrap_rtti_tuple<rs extends readonly [...any[]]> =
   rs extends readonly [infer head, ...infer tail]
   ? head extends rtti<infer t>
      ? [t, ...unwrap_rtti_tuple<tail>]
      : never
   : [];

export function tuple<rs extends readonly [...rtti[]]>(...rs: rs): rtti<unwrap_rtti_tuple<rs>> {
   const name = `[${rs.map(r => r.name).join(", ")}]`;
   return {
      name,
      is(u: unknown): u is unwrap_rtti_tuple<rs> {
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
               `Since ${name} extends array<unknown>, tried asserting for`,
               "array<unknown> but failed since Array.isArray returned false.",
            );
         }
         unsound.assert<unknown[]>(u);
         if (u.length !== rs.length) {
            throw new FoundatsionError(
               `Tried asserting for ${name} but the lengths were`,
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
                     `While asserting for ${name}, an error was`,
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
