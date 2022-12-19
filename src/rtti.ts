import {oo} from "./oo";
import {any_fn} from "./any_fn";
import {string} from "./string";
import {unsound} from "./unsound";
import {T, ignore} from "./type_traits";
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
      export type t<f extends {(u: unknown): void}> =
         f extends {(u: unknown): asserts u is infer r} ? r : unknown;
      declare const assert_function_s: unique symbol;
      export type assert_function<t> = {[assert_function_s]: t};
      export type force_t<wanted, r> =
         r extends {assert: assert}
            ? t<r["assert"]> extends wanted ? unknown : assert_function<wanted>
            : assert_function<wanted>;
   }

   type castish<t, r> =
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

   export const verify:
   {
      <wt extends T<unknown>, r>
         (wt: wt, r: r & well_formed<wt extends T<infer it> ? it : never, r>): void;
   }
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
