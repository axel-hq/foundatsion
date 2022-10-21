import {FoundatsionError} from "./err";

// pleas optimize uwu
export const unit = <t>(_: t) => {};
export const identity = <t>(x: t): t => x;

declare const unsatisfiable: unique symbol;
// NOTE(Marcus): idk if the type here should be never, unknown, or any
export type assert_extends<child, parent> = child extends parent ? never : typeof unsatisfiable;

export namespace unsound {
   // When TypeScript is too stupid to figure out that something is definitely true
   export const is_now: {<t>(val: any): asserts val is t} = unit;
   export const cast: {<t>(val: any): t} = identity;
   // Blessing something makes it of that type by definition. Should really only
   // be used with newtypes.
   export const bless = cast;
   // When you need the type system to shut up and let you do what you want with
   // a value. Usually you want to use this one from the "insertion" side of
   // expressions.
   export const shut_up: {(non_cubist: any): never} = identity as never;
   // Same thing as above but for the "receiving" side of expressions. Arguments
   // have the right type but the function refuses em? fuck_off's your Go-To.
   export const fuck_off: {(stubborn: any): any} = identity as never;

   export type any_fn = {(...args: any[]): unknown};
   export namespace any_fn {
      export const name = "any function";

      export function is(u: unknown): u is any_fn {
         return typeof u === "function";
      }

      export function assert(u: unknown): asserts u is any_fn {
         if (typeof u !== "function") {
            throw new FoundatsionError(
               "Tried asserting for function but failed.",
               `typeof value was "${typeof u}" when it should've been "function".`,
            );
         }
      }
   }
}

export namespace rtti {
   export type has_name = {name: string};

   export type is<t = unknown> = {(u: unknown): u is t};
   export type has_is<t = unknown> = {is: is<t>};

   export type assert<t = unknown> = {(u: unknown): asserts u is t};
   export type has_assert<t = unknown> = {assert: assert<t>};

   export type some<t = unknown> = {
      name: string;
      is?: rtti.is<t>;
      assert?: rtti.assert<t>;
   };

   export function assert
      <r extends has_assert>
         (r: r, u: unknown):
            asserts u is r extends has_assert<infer t> ? t : never
   {
      r.assert(u);
   }

   export function is_from_assert(a: assert): is {
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
   & rtti.has_is<t>
   & rtti.has_assert<t>;
