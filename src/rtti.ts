import {oo} from "./oo";
import {string} from "./string";
import {ignore} from "./type_traits";
import {unsound} from "./unsound";
import {FoundatsionError} from "./error";

export type rtti<t = unknown> = {
   name: string;
   is: rtti.is<t>;
   assert: rtti.assert<t>;
};

export namespace rtti {
   export type t<r extends rtti> = r extends rtti<infer t> ? t : never;

   export type is<t = unknown> = {(u: unknown): u is t};
   export type assert<t = unknown> = {(u: unknown): asserts u is t};

   type isish<t> = {is: is<t>};
   type assertish<t> = {assert: assert<t>};
   type castish<t = unknown> =
      & {[k in `cast_from_${string}`]: {(a: any): t}}
      & {[k in `cast_to_${string}`]: {(t: t): any}};

   type verify<r extends rtti> =
      r extends isish<infer is_t> & assertish<infer assert_t>
         ? isish<assert_t> & assertish<is_t> & castish<is_t & assert_t>
         : never;

   export const verify:
      {<t, r extends rtti = rtti<t>>(r: r & verify<r>): void}
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

   export namespace meta {
      export const name = "rtti";
      export function is(u: unknown): u is rtti {
         return true
            && oo.is(u)
            && oo.field_is(u, "name", string)
            && oo.field_is(u, "is", unsound.any_fn)
            && oo.field_is(u, "assert", unsound.any_fn);
      }
      export function assert(u: unknown): asserts u is rtti {
         if (!is(u)) {
            throw new FoundatsionError(
               "Value was not an rtti!",
            );
         }
      }
   }
}
