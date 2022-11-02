import {unsound} from "./unsound";
import {ignore, tt} from "./type_traits";

export type rtti<t = unknown, n extends string = string> = {
   name: n;
   is: rtti.is<t>;
   assert: rtti.assert<t>;
};

export namespace rtti {
   export type is<t = unknown> = {(u: unknown): u is t};
   export type assert<t = unknown> = {(u: unknown): asserts u is t};

   export type has_valid_name<n extends string> =
      tt.is_prim_string<n> extends true ? unknown : {name: tt.primitive_string};

   export const verify:
      {<t = unknown, n extends string = string>(r: rtti<t, n> & has_valid_name<n>): void}
         = ignore;

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
