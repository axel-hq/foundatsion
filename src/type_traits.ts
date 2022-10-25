import {dyn_record} from "./dyn_record";
import {FoundatsionError} from "./error";
import {unknown} from "./unknown";

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

type _not_union<t1, t2> =
   t1 extends unknown
      ? t2 extends t1
         ? true
         : unknown
      : never;
/** Returns `true` if t is not a union, `unknown` otherwise */
export type not_union<t> = _not_union<t, t>;

/** Returns `true` on regular string and `false` on templated string */
export type not_templated_string<s extends string> =
   s extends ""
      ? true
      : s extends `${infer head}${infer tail}`
         ? string extends head
            ? false
            : `${string}` extends head
               ? false
               : `${number}` extends head
                  ? false
                  : `${bigint}` extends head
                     ? false
                     : `${boolean}` extends head
                        ? false
                        : not_templated_string<tail>
         : false;

/** Returns `true | false` */
export type is_prim_string<s extends string> =
   not_union<s> extends true
      ? not_templated_string<s>
      : false;

declare const primitive_string: unique symbol;
export type primitive_string = {[primitive_string]: void};

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

function cast<from, to, to_name extends string>(
   rtti_from: rtti<from> & {to: {[m in to_name]: {(from: from): to}}},
   rtti_to: rtti<to, to_name> & rtti.valid_name<to_name>,
   from: from,
): to;
function cast<from, to, from_name extends string>(
   rtti_from: rtti<from, from_name> & rtti.valid_name<from_name>,
   rtti_to: rtti<to> & {from: {[m in from_name]: {(from: from): to}}},
   from: from,
): to;
function cast<from, to>(
   rtti_from: rtti<from> & {to?: dyn_record},
   rtti_to: rtti<to> & {from?: dyn_record},
   from: from
): to {
   try {
      if (dyn_record.field_is(rtti_from, "to", dyn_record)) {
         const to = rtti_from.to;
         const name = rtti_to.name
         if (dyn_record.field_is(to, name, unknown)) {
            // this shouldn't work but it kinda does
            const cast_fn = to[name]!;
            return to[name](from);
         }
      }
   }
   if (dyn_record.field_is(rtti_from, `to_${rtti_to.name}`, unsound.any_fn)) {
      rtti_from.
   }
};
export {cast};
