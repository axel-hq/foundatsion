// just want to make sure that we don't import the rtti value because that would
// make it a circular value dependency
import type {rtti} from "./rtti";
import {id, ignore, T} from "./type_traits";

export namespace unsound {
   /** Cast any value to type t. */
   export const cast: {<t>(val: any): t} = id;
   export const cast_to_not_undefined: {<t>(v: t): Exclude<t, undefined>}
      = id as never;
   /** `bless` is an alias for cast. Used for blessing newtypes only. */
   export const bless = cast;
   /** Changes the type of an identifier. */
   export const assert: {<t>(val: any): asserts val is t} = ignore;
   export function assert_and_return<t, v>(_: T<t>, v: v): t & v;
   export function assert_and_return<t, v>(_: rtti<t>, v: v): t & v;
   export function assert_and_return(_: any, v: any): any {
      return v;
   }
   export const assert_not_undefined: {<t>(v: t): asserts v is Exclude<t, undefined>}
      = ignore as never;
   export const assert_truthy: {(u: unknown): asserts u} = ignore;
   /**
    * Used for stubborn expressions. In general, you should use `unsound.cast`
    * but in a pinch, this will do. Usually this is used from the "insertion" or
    * "subtype" side of expressions.
    */
   export const shut_up: {(non_cubist: any): never} = id as never;
   /**
    * Similar to `unsound.shut_up` but for the receiving side of expressions.
    * Sometimes you're putting the right types into the "wrong" function.
    * Tell TypeScript to fuck off and let you use the function because *you*
    * know it's right. #informal-verification-winners.
    */
   export const fuck_off: {(stubborn: any): any} = id as never;
}
