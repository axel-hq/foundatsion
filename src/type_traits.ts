import {FoundatsionError} from "./err";
import {unsound} from "./unsound";

// pleas optimize uwu
export const identity = <t>(x: t): t => x;
export const unit = <t>(x: t) => {};

export type not_undefined<t> = t extends infer i | undefined ? i : t;

export namespace rtti {
   export type has_name
      = {name: string};
   export type has_is<t = unknown>
      = {is: {(u: unknown): u is t}};
   export type has_assert<t = unknown>
      = {assert: {(u: unknown): asserts u is t}};
   export type all<t = unknown> = has_name & has_is<t> & has_assert<t>;
   export function assert
      <r extends has_assert>
         (r: r, u: unknown):
            asserts u is r extends has_assert<infer t> ? t : never
   {
      r.assert(u);
   }

   export function is_from_assert
      <a extends has_assert["assert"]>(a: a): has_is["is"]
   {
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
export type rtti<t = unknown> =
   & rtti.has_name
   & Partial<rtti.has_is<t>>
   & Partial<rtti.has_assert<t>>;
