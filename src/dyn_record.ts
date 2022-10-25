import {rtti} from "./rtti";
import {text} from "./text";
import {unsound} from "./unsound";
import {FoundatsionError} from "./error";
import {identity, ignore} from "./type_traits";

export type dyn_record = {[k in string]: unknown};

export const cast_record_to_dyn_record: {<o extends {}>(o: o): o & dyn_record}
   = unsound.shut_up(identity);

export namespace dyn_record {
   export const name = "dyn_record";

   export function is(u: unknown): u is dyn_record {
      return typeof u === "object" && u !== null;
   }

   export function assert(u: unknown): asserts u is dyn_record {
      if (typeof u !== "object") {
         throw new FoundatsionError(
            `Asserting for ${name} failed!\n`,
            `typeof value was "${typeof u}" when it should've been "object".`,
         );
      }
      if (u === null) {
         throw new FoundatsionError(
            `Asserting for ${name} failed because the value was null.`,
         );
      }
   }

   export const assert_from_record: {(o: {}): asserts o is dyn_record} = ignore;

   export function field_is
      <t, k extends string, o extends dyn_record>
         (o: o, k: k, t: rtti<t>):
            o is o & {[_ in k]: t}
   {
      return t.is(o[k]);
   }

   /** Assert that an object has a property of type t. */
   export function assert_field_is
      <t, k extends string, o extends dyn_record>
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
               `While asserting for {[${text.stringify(k)}]: ${t.name}}`,
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

   export function keys<o extends dyn_record>(o: o): (keyof o)[] {
      const ks = Object.keys(o);
      return unsound.shut_up(ks);
   }
}
