import {oo} from "./oo";
import {any_fn} from "./any_fn";
import {string} from "./string";
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

   declare const dummy: unique symbol;
   type dummy = typeof dummy;

   type verify_implicit<r extends rtti> =
      r extends isish<infer is_t> & assertish<infer assert_t>
         ? (is_t | assert_t) extends (is_t & assert_t)
            ? castish<is_t>
            : ["Type mismatch between return type of is and assert:", is_t, "is not equal to", assert_t]
         : never;

   // prevent user from putting explicit type parameters
   export function verify
      <no_explicit_type_parameters extends dummy = dummy, r extends rtti = rtti>
         (_: r & verify_implicit<r>):
            void & no_explicit_type_parameters
   {}

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
      export const name = "rtti object";
      export function is(u: unknown): u is rtti {
         return true
            && oo.is(u)
            && oo.field_is(u, "name", string)
            && oo.field_is(u, "is", any_fn)
            && oo.field_is(u, "assert", any_fn);
      }
      export function assert<u>(this: typeof meta, u: u): asserts u is u & rtti {
         if (!is(u)) {
            throw new FoundatsionError(
               `Value was ${this.name}!`,
            );
         }
      }
   }
}

rtti.verify(string); // CULTS
