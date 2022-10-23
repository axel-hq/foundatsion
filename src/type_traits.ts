import {FoundatsionError} from "./err";

export function __unreachable(): never {
   throw __unreachable;
}
// pleas optimize uwu
export const unit = <t>(_?: t) => {};
export const absurd = <t>(_: never): t => __unreachable();
export const identity = <t>(x: t): t => x;

export namespace unsound {
   /** Cast any value to type t. */
   export const cast: {<t>(val: any): t} = identity;
   /** `bless` is an alias for cast. Used for blessing newtypes only. */
   export const bless = cast;
   /** Changes the type of an identifier. */
   export const assert: {<t>(val: any): asserts val is t} = unit;
   /**
    * Used for stubborn expressions. In general, you should use `unsound.cast`
    * but in a pinch, this will do. Usually this is used from the "insertion" or
    * "subtype" side of expressions.
    */
   export const shut_up: {(non_cubist: any): never} = identity as never;
   /**
    * Similar to `unsound.shut_up` but for the receiving side of expressions.
    * Sometimes you're putting the right types into the "wrong" function.
    * Tell TypeScript to fuck off and let you use the function because *you*
    * know it's right. #informal-verification-winners.
    */
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
               "Tried asserting for function but failed.\n",
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

export const ct_check_extends: {<super_t>(sub: super_t): void} = unit;
export const ct_assert_t: {<_ extends true>(): void} = unit;
