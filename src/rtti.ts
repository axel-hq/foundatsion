import {oo} from "./oo";
import {any_fn} from "./any_fn";
import {string} from "./string";
import {unsound} from "./unsound";
import {ignore, T} from "./type_traits";
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
   export namespace assert {
      // assert functions are really really annoying and don't properly work
      // within the type system.
      // (u => asserts u is x) is isometric to (u => void).
      // Why? Because MICROSOFT HATES YOU OK.
      // Fear not! Using conditional types with infer, we can smuggle the
      // asserted-to type out of the type predicate.
      // The downside is that we can't tell the difference between that and
      // asserting to unknown.
      // But asserting to unknown is like pretty stupid so if you're doing that
      // that's not really my fault.
      export type t<f extends {(u: unknown): void}> =
         f extends {(u: unknown): asserts u is infer r} ? r : unknown;
      // this here is just for nice error messages...
      // (u: unknown) => void is not assignable to assert_function<number>
      declare const assert_function_s: unique symbol;
      export type assert_function<t> = {[assert_function_s]: t};
      export type force_t<wanted, r> =
         r extends {assert: assert}
            ? t<r["assert"]> extends wanted ? unknown
            : assert_function<wanted>
            : assert_function<wanted>;
   }

   type castish<t, r> =
      // so why are we doing this mapped type nonsense right here?
      // well, one would assume that having an index signature with an optional
      // value would cover the cast_to and cast_from case like saying
      // "if you have cast_from I expect it to return t"
      // but no. typescript hates me and the feeling is mutual.
      // Instead, what we're gonna do is just check if every cast_to or
      // from function *that exists* on type r is the correct format.
      & {[k in keyof r as k extends "cast_from" ? k : never]: {(u: unknown): t}}
      & {[k in keyof r as k extends `cast_from_${string}` ? k : never]: {(a: any): t}}
      & {[k in keyof r as k extends `cast_to_${string}` ? k : never]: {(t: t): any}};

   type callish<t, r> =
      r extends any_fn ? {(...args: any[]): t} : unknown;

   type well_formed<t, r> =
      & {is: is<t>}
      & assert.force_t<t, r>
      & castish<t, r>
      & callish<t, r>;

   export const verify: {<t, r>(wt: T<t>, r: r & well_formed<t, r>): void}
      = ignore;

   /**
    * In general, you shouldn't be using this but it can be a nice for fast
    * development.
    */
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
         try {
            oo.assert(u);
            oo.assert_field_is(u, "name", string);
            oo.assert_field_is(u, "is", any_fn);
            oo.assert_field_is(u, "assert", any_fn);
         } catch (e) {
            if (e instanceof Error) {
               throw new FoundatsionError(
                  `While asserting for ${this.name},`,
                  "an error was thrown:",
                  e,
               );
            }
            throw e;
         }
      }
   }
}

// we have this verify here because otherwise we'd create a circular dependency
// between rtti and string.
rtti.verify(T<string>, string);
