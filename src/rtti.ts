import {unsound} from "./unsound";
import {ignore, is_prim_string, primitive_string} from "./type_traits";

export type rtti<t = unknown, n extends string = string> = {
   name: n;
   is: rtti.is<t>;
   assert: rtti.assert<t>;
};

export namespace rtti {
   export type is<t = unknown> = {(u: unknown): u is t};
   export type assert<t = unknown> = {(u: unknown): asserts u is t};

   export type has_valid_name<n extends string> =
      is_prim_string<n> extends true ? unknown : {name: primitive_string};
   export const verify:
      {<n extends string>(r: rtti<unknown, n> & has_valid_name<n>): void}
         = ignore;

   export function assert<t, u>(r: rtti<t>, u: u): asserts u is u & t {
      r.assert(u);
   }

   export function is_from_assert<t>(a: assert<t>): is<t> {
      function is(u: unknown): boolean {
         try {
            a(u);
            return true;
         } catch (e) {
            if (e instanceof Error) {
               return false;
            } else {
               throw e;
            }
         }
      }
      return unsound.shut_up(is);
   }
}
