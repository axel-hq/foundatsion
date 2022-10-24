// tuple with .length = n
import {FoundatsionError} from "./error";
import {rtti, unsound, __unreachable} from "./type_traits";

type unwrap_rtti_tuple<rs extends readonly [...any[]]> =
   rs extends readonly [infer head, ...infer tail]
   ? head extends rtti<infer t>
      ? [t, ...unwrap_rtti_tuple<tail>]
      : never
   : [];

export function tuple<rs extends readonly [...rtti[]]>(...rs: rs): rtti<unwrap_rtti_tuple<rs>> {
   const name = `tuple<${rs.map(r => r.name).join(", ")}>`
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
            const r = rs[i];
            if (r === undefined) {
               __unreachable();
            }
            try {
               rtti.assert(r, u[i]);
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
