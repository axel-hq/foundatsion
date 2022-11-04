import {rtti} from "./rtti";
import {never} from "./never";
import {unsound} from "./unsound";
import {__unreachable} from "./type_traits";
import {FoundatsionError} from "./error";

type union_decant<rs extends [...rtti[]]> =
   rs[number] extends rtti<infer ts> ? ts : never;

// I'm adding a little bit of extra type information that *technically*
// shouldn't exist on an rtti object but I'm not telling anyone, are you?
const union_rtti_ary: unique symbol = Symbol();
type union_rtti_object = rtti & {[union_rtti_ary]: rtti[]};
namespace union_rtti_object {
   export function is(u: unknown): u is union_rtti_object {
      // This is really not good enough to prove that u is union_rtti_object.
      // But if someone else gets a hold of that symbol, that's not really
      // something that I can prevent.
      return Object.hasOwnProperty.call(u, union_rtti_ary);
   }
}

export type union<rs extends [...rtti[]]> = rtti<union_decant<rs>>;
export function union<rs extends [...rtti[]]>(...rs: rs): union<rs> {
   if (rs.length === 0) {
      return never;
   }

   if (rs.length === 1) {
      return unsound.shut_up(rs[0]);
   }

   const non_union_rs: rtti[] = [];
   for (const r of rs) {
      if (union_rtti_object.is(r)) {
         // if it's another union object, we can unwrap the union into this one
         non_union_rs.push(...r[union_rtti_ary]);
      } else {
         non_union_rs.push(r);
      }
   }

   const new_rtti = {
      name: `${rs.map(r => r.name).join(" | ")}`,
      is(u: unknown): u is union_decant<rs> {
         for (const r of non_union_rs) {
            if (r.is(u)) {
               return true;
            }
         }
         return false;
      },
      assert(u: unknown): void {
         const errs: Error[] = [];
         for (const r of non_union_rs) {
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
            `While asserting that value was ${this.name} one or more errors were`,
            "thrown:",
            ...errs,
         );
      },
   };
   Object.defineProperty(new_rtti, union_rtti_ary, {
      configurable: false,
      enumerable: false,
      value: non_union_rs,
      writable: false,
   });
   return new_rtti;
}
