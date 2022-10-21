import {never} from "./never";
import {rtti, unsound} from "./type_traits";
import {FoundatsionError, unreachable} from "./err";

type union_rtti_tuple<rs extends [...rtti[]]> =
   rs[number] extends rtti<infer ts> ? ts : never;

export function union<rs extends [...rtti[]]>(...rs: rs): rtti<union_rtti_tuple<rs>> {
   if (rs.length === 0) {
      return never;
   }

   if (rs.length === 1) {
      const r0 = rs[0];
      if (r0 === undefined) {
         unreachable();
      } else {
         return unsound.shut_up(r0);
      }
   }

   const name = `${rs.map(r => r.name).join(" | ")}`;
   return {
      name,
      is(u: unknown): u is union_rtti_tuple<rs> {
         for (const r of rs) {
            if (r.is(u)) {
               return true;
            }
         }
         return false;
      },
      assert(u: unknown): void {
         const errs: Error[] = [];
         for (const r of rs) {
            try {
               r.assert(u);
               return;
            } catch (e) {
               if (e instanceof Error) {
                  errs.push(e);
               } else {
                  throw e;
               }
            }
         }
         throw new FoundatsionError(
            `While asserting that value was (${name}) one or more errors were`,
            "thrown:",
            ...errs,
         );
      },
   }
}
