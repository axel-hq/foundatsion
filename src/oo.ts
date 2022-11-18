import {rtti} from "./rtti";
import {text} from "./text";
import {unsound} from "./unsound";
import {FoundatsionError} from "./error";
import {id, ignore} from "./type_traits";

/** Open Object */
export type oo = object & {[k in string]: unknown};
export namespace oo {
   export const name = "open-object";
   export function is(u: unknown): u is oo {
      return typeof u === "object" && u !== null;
   }
   export function assert(this: typeof oo, u: unknown): asserts u is oo {
      if (typeof u !== "object") {
         throw new FoundatsionError(
            `Asserting for ${this.name} failed!\n`,
            `typeof value was "${typeof u}" when it should've been "object".`,
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
            o is o & {[_ in k]: t}
   {
      return t.is(o[k]);
   }
   /** Assert that an object has a property of type t. */
   export function assert_field_is
      <t, k extends string, o extends oo>
         (o: o, k: k, t: rtti<t>):
            asserts o is o & {[_ in k]: t}
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
