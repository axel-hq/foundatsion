import {rtti} from "./rtti";
import {unsound} from "./unsound";
import {unknown} from "./unknown";
import {FoundatsionError} from "./error";

type inter_decant<rs> =
   rs extends [rtti<infer t>, ...infer tail]
      ? t & inter_decant<tail>
      : unknown;

export function inter<rs extends [...rtti[]]>(...rs: rs): rtti<inter_decant<rs>> {
   if (rs.length === 0) {
      return unsound.shut_up(unknown);
   }

   if (rs.length === 1) {
      return unsound.shut_up(rs[0]);
   }

   return {
      name: `(${rs.map(r => r.name).join(" & ")})`,
      is(u: unknown): u is inter_decant<rs> {
         return rs.every(r => r.is(u));
      },
      assert(u: unknown): asserts u is inter_decant<rs> {
         try {
            for (const r of rs) {
               r.assert(u);
            }
         } catch (e) {
            if (e instanceof Error) {
               throw new FoundatsionError(
                  `While asserting for ${this.name}, an error was thrown:`,
                  e,
                  "The value must satisfy the following:\n",
                  ...rs.map(r => `- ${r.name}\n`)
               );
            } else {
               throw e;
            }
         }
      },
   };
}
