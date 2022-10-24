import {FoundatsionError} from "./error";

export function __unreachable(): never {
   throw __unreachable;
}
// pleas optimize uwu
export const ignore = <t>(_?: t) => {};
export const absurd = <t>(_: never): t => __unreachable();
export const identity = <t>(x: t): t => x;

/** Check that a type is true. Useful with predicates */
export const ct_true: {<_ extends true>(): void} = ignore;
/** Check that the type of a value extends `super_t` */
export const vt_extends: {<super_t>(sub: super_t): void} = ignore;

export namespace unsound {
   /** Cast any value to type t. */
   export const cast: {<t>(val: any): t} = identity;
   /** `bless` is an alias for cast. Used for blessing newtypes only. */
   export const bless = cast;
   /** Changes the type of an identifier. */
   export const assert: {<t>(val: any): asserts val is t} = ignore;
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

declare const nt_s: unique symbol;
export type unwrap<t> =
   t extends {[nt_s]: {unwraps_to: infer inner}} ? inner : t;
export const unwrap: {<n>(n: n): unwrap<n>} = unsound.shut_up(identity);
export type newtype<uniq_name extends string, of> =
   of & {[nt_s]: {types: {[key in uniq_name]: void}; unwraps_to: unwrap<of>}};

export namespace rtti {
   export type tof<r extends rtti> = r extends rtti<infer t> ? t : never;
   export type has_name = {name: string};

   export type is<t = unknown> = {(u: unknown): u is t};
   export type has_is<t = unknown> = {is: is<t>};

   export type assert<t = unknown> = {(u: unknown): asserts u is t};
   export type has_assert<t = unknown> = {assert: assert<t>};

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

function cast<from, to, rtti_to extends rtti>(
   rtti_from: rtti.some<from> & {[m in `to_${rtti_to["name"]}`]: {(from: from): to}},
   rtti_to: rtti<to> & rtti_to,
   from: from
): to;
// function cast<from, to, rtti_from extends rtti.some<from>>(
//    rtti_from: rtti_from,
//    rtti_to: rtti.some<to> & {[m in `from_${rtti_from["name"]}`]: {(from: from): to}},
//    from: from,
// ): to;
function cast(rtti_from: rtti, b: any, c: any): any {};
