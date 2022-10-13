import {FoundatsionError} from "./err";
import {rtti} from "./rtti";
import {unsound} from "./unsound";

export namespace object {
   export const name = "non-null object";

   export function is(u: unknown): u is {} {
      return typeof u === "object" && u !== null;
   }

   export function assert(u: unknown): asserts u is {} {
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


   export function has_key
   <o extends {}, k extends string>
      (o: o, k: k):
         o is o & {[_ in k]: unknown}
   {
      return Object.hasOwnProperty.call(o, k);
   }

   export function assert_has_key
   <k extends string, o extends {}>(o: o, k: k):
      asserts o is o & {[_ in k]: unknown}
   {
      if (has_key(o, k)) {}
      else {
         throw new FoundatsionError(`Object did not have key "${k}"!`);
      }
   }

   export function has_t
   <t, k extends string, o extends {}>
      (o: o, k: k, t: rtti.has_is<t>):
         o is o & {[_ in k]: t}
   {
      return has_key(o, k) && t.is(o[k]);
   }

   /** Assert that an object has a property of type T. */
   export function assert_has_t
      <T, k extends string, o extends {}>
         (o: o, k: k, t: rtti.has_name & rtti.has_assert<T>):
            asserts o is o & {[_ in k]: T}
   {
      try {
         assert_has_key(o, k);
         t.assert(o[k])
      } catch (e) {
         if (e instanceof Error) {
            
         }
         throw new FoundatsionError(
            `While asserting that value was of type {["${k}"]: ${t.name}}`,
            "an error was thrown:",
            e,
         )
      }
   }

   export function freeze<T>(obj: T): asserts obj is Readonly<T> {
      Object.freeze(obj);
   }

   export function keys<o extends {}>(o: o): (keyof o)[] {
      const ks = Object.keys(o);
      return unsound.shut_up(ks);
   }
}

export function optional_t
   <T, k extends key, o extends {}>
      (o: o, k: k, is: is_obj<T>):
         o is o & {[_ in k]: T | undefined}
{
   if (has(o, k)) {
      if (is.is(o[k])) {
         return true;
      } else {
         return false;
      }
   } else {
      return true;
   }
}

export function assert_optional_t
   <T, k extends key, o extends {}>
      (o: o, k: k, assert: assert_obj<T>):
         asserts o is o & {[_ in k]: T | undefined}
{
   if (has(o, k)) {
      try {
         assert.assert(o[k]);
      } catch (e) {
         if (e instanceof AxelTypeError) {
            throw new AxelTypeError(
               `While asserting that object[${debug.show(k)}] has optional value of type ${assert.typename}`,
               "an error was thrown:",
               e,
            );
         }
      }
   }
}

// NOTE(Marcus): I don't know how to implement the general case for
// the function signature here.
export function assert_optional_ts
   <T1, T2, k extends key, o extends {}>
      (o: o, k: k, asserts: [assert_obj<T1>, assert_obj<T2>]):
         asserts o is o & {[_ in k]: T1 | T2 | undefined}
{
   const es = [];
   if (has(o, k)) {
      for (const assert of asserts) {
         try {
            assert.assert(o[k]);
            // Only one assert function needs to work for the union type to be satisfied
            return;
         } catch (e) {
            if (e instanceof AxelTypeError) {
               es.push(e);
               continue;
            } else {
               throw e;
            }
         }
      }
      throw new AxelTypeError(
         `While asserting that object[${debug.show(k)}] has optional value of type ${asserts.map(v => v.typename).join(" | ")}`,
         "these errors were thrown:",
         ...es
      );
   }
}

export function from_entries<k extends key, v>(entries: [k, v][]): {[_ in k]: v} {
   return unsound.shut_up(Object.fromEntries(entries));
}
