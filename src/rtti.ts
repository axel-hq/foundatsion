import {unsound} from "./unsound";
import {ignore, is_prim_string, primitive_string} from "./type_traits";

export type rtti<t = unknown, name extends string = string> = {
   name: name;
   is: rtti.is<t>;
   assert: rtti.assert<t>;
};

export namespace rtti {
   /** Use this when accepting generic rtti objects
    * @example
    * function generic<t, name extends string>
    *    (r: rtti<t, name> & rtti.valid_name<name>);
    */
   export type valid_name<name extends string> = {
      name: is_prim_string<name> extends true ? name : primitive_string;
   }
   export type is<t = unknown> = {(u: unknown): u is t};
   export type assert<t = unknown> = {(u: unknown): asserts u is t};
   export const verify:
      {<t, name extends string>
         (r: rtti<t, name> & valid_name<name>): void}
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
