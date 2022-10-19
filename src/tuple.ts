// tuple with length n
import {unsound} from "./unsound";
import {FoundatsionError, unreachable} from "./err";
import {identity, rtti} from "./type_traits";
import {array} from "./array";

export const typename = "tuple";

export namespace tuple {
   // export const to_array:
   //    {
   //       <tup extends tuple>(tup: tup):
   //          tup extends tuple<infer t> ? readonly t[] : never
   //    } = unsound.shut_up;

   // export function includes
   //    <t, tup extends tuple>
   //       (tup: tup, elem: t):
   //          elem is tup[number]
   // {
   //    return unsound.shut_up(tup.includes(elem));
   // }

   export function assert_in
   <tup extends tuple>
      (tup: tup, name: string, elem: tup[number]):
         asserts elem is tup[number]
   {
      if (tup.includes(elem)) {}
      else {
         throw new AxelTypeError(
            `Could not assert that input is a ${name}!`,
            `elem was ${debug.show(elem)} but should have been one of the following:`,
            ...tup.map(e => `- ${debug.show(e)}`),
         );
      }
   }

   type unwrap_rtti<rs extends [...unknown[]]> =
      rs extends [infer head, ...infer tail]
         ? head extends rtti.all<infer t>
            ? [t, ...unwrap_rtti<tail>]
            : never
         : [];

   export function typed<rs extends [...rtti.all[]]>(rs: rs): rtti.all<unwrap_rtti<rs>> {
      return {
         name: `[${rs.join(", ")}]`,
         is(u: unknown): u is unwrap_rtti<rs> {
            if (!array.is(u)) {
               return false;
            }
            return rs.every((r, i) => r.is(u[i]));
         },
         assert(u: unknown): asserts u is unwrap_rtti<rs> {
            try {
               array.assert(u);
            } catch (e) {
               if (e instanceof Error) {
                  throw new FoundatsionError();
               } else {
                  throw e;
               }
            }
            for (let i = 0; i < u.length; i++) {
               try {
                  const elem = u[i];
                  const rtti = rs[i];
                  if (rtti === undefined) {
                     unreachable();
                  }
                  unsound.fuck_off(rtti.assert)(elem);
               } catch (e) {
                  if (e instanceof Error) {
                     throw new FoundatsionError(
                        "While asserting that array was homogeneous with type",
                        `${r.name}, an Error was thrown at index ${i}!`,
                        e,
                     );
                  } else {
                     throw e;
                  }
               }
            }
         }
      };
      if (rs) {
         
      }
   }
}
