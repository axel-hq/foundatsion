import {rtti} from "./rtti";
import {text} from "./text";
import {any_fn} from "./any_fn";
import {unsound} from "./unsound";
import {id, ignore, tt} from "./type_traits";
import {FoundatsionError} from "./error";

/** Open Object */
export type oo = (object | any_fn) & {[k in string]: unknown};
export namespace oo {
   export const name = "open-object";
   export function is(u: unknown): u is oo {
      return (typeof u === "object" || typeof u === "function") && u !== null;
   }
   export function assert<u>(this: typeof oo, u: u): asserts u is u & oo {
      if (typeof u === "object" || typeof u === "function") {}
      else {
         throw new FoundatsionError(
            `Asserting for ${this.name} failed!\n`,
            `typeof value was "${typeof u}" when it should've been "object" | "function".`,
            `Instead, value was ${text.show(u)}`,
         );
      }
      if (u === null) {
         throw new FoundatsionError(
            `Asserting for ${this.name} failed because the value was null.`,
         );
      }
   }
   export const assert_from_record: {(o: {}): asserts o is oo} = ignore;
   export const cast_from_record: {(r: {}): oo} = id;
   export function field_is
      <t, k extends string, o extends oo>
         (o: o, k: k, t: rtti<t>):
            o is o & tt.merge<o & {[_ in k]: t}>
   {
      return t.is(o[k]);
   }
   /** Assert that an object has a property of type t. */
   export function assert_field_is
      <t, k extends string, o extends oo>
         (o: o, k: k, t: rtti<t>):
            asserts o is o & tt.merge<o & {[_ in k]: t}>
   {
      try {
         t.assert(o[k]);
      } catch (e) {
         if (e instanceof Error) {
            throw new FoundatsionError(
               // JSON.stringify(k) is used to escape quotes and other weird
               // characters within k.
               `While asserting for {[${text.show(k)}]: ${t.name}}`,
               "an error was thrown:",
               e,
            );
         } else {
            throw e;
         }
      }
   }
   export function freeze<t>(obj: t): asserts obj is Readonly<t> {
      Object.freeze(obj);
   }
   // it may be incorrect but I'm past caring
   export function keys<o extends {}>(o: o): (keyof o)[] {
      return unsound.shut_up(Object.keys(o));
   }
}

type z = keyof ({a: 1} | {b: 2});
