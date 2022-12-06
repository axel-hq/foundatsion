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

   type isish<t> = {is: is<t>};
   type assertish<t> = {assert: assert<t>};
   type castish<t, r> =
      & {[k in keyof r as k extends "cast_from" ? k : never]: {(u: unknown): t}}
      & {[k in keyof r as k extends `cast_from_${string}` ? k : never]: {(a: any): t}}
      & {[k in keyof r as k extends `cast_to_${string}` ? k : never]: {(t: t): any}};

   type well_formed<t, r> = isish<t> & assertish<t> & castish<t, r>;

   export const verify: {<t, r>(t: T<t>, r: r & well_formed<t, r>): void} = ignore;

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

rtti.verify(T<string>, string); // CULTS
