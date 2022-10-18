import {rtti} from "./type_traits";
import {unsound} from "./unsound";
import {FoundatsionError} from "./err";

export type obj = {[k in string]: unknown};
export namespace obj {
   export const name = "non-null obj";

   export function is(u: unknown): u is obj {
      return typeof u === "object" && u !== null;
   }

   export function assert(u: unknown): asserts u is obj {
      if (typeof u !== "object") {
         throw new FoundatsionError(
            "Asserting that value was non-null object failed!\n",
            `typeof value was "${typeof u}" when it should've been "object"`
         );
      }
      if (u === null) {
         throw new FoundatsionError(
            "Asserting that value was non-null object failed",
            "because the value was null!",
         );
      }
   }

   export function field_is
      <t, k extends string, o extends obj>
         (o: o, k: k, t: rtti.has_is<t>):
            o is o & {[_ in k]: t}
   {
      return t.is(o[k]);
   }

   /** Assert that an object has a property of type t. */
   export function assert_field_is
      <k extends string, o extends obj, t>
         (o: o, k: k, t: rtti.has_name & rtti.has_assert<t>):
            asserts o is o & {[_ in k]: t}
   {
      try {
         t.assert(o[k]);
      } catch (e) {
         if (e instanceof Error) {
            throw new FoundatsionError(
               // JSON.stringify(k) is used to escape quotes and other weird
               // characters within k.
               `While asserting that value was of type {[${JSON.stringify(k)}]: ${t.name}}`,
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

   export function keys<o extends obj>(o: o): (keyof o)[] {
      const ks = Object.keys(o);
      return unsound.shut_up(ks);
   }
}
