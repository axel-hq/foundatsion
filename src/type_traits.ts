// pleas optimize uwu
export const identity = <t>(x: t): t => x;
export const unit = <t>(x: t) => {};

export type not_undefined<t> = t extends infer i | undefined ? i : t;

export namespace unsound {
   // When TypeScript is too stupid to figure out that something is definitely true
   export function is_now<t>(val: any): asserts val is t { void val }
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
   export const fuck_off: {(fookin_knacker: any): any} = identity as never;
}

export namespace rtti {
   export type has_name
      = {name: string};
   export type has_is<t = unknown>
      = {is: {(u: unknown): u is t}};
   export type has_assert<t = unknown>
      = {assert: {(u: unknown): asserts u is t}};
   export type all<t = unknown> = has_name & has_is<t> & has_assert<t>;
   export function assert
      <r extends has_assert>
         (r: r, u: unknown):
            asserts u is r extends has_assert<infer t> ? t : never
   {
      r.assert(u);
   }

   export function is_from_assert
      <a extends has_assert["assert"]>(a: a): has_is["is"]
   {
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
   & Partial<rtti.has_is<t>>
   & Partial<rtti.has_assert<t>>;

// useful with satisfiable
export type $extends<parent, child> = child extends parent ? true : false;

/* BEGIN UNSATISFIABLE ********************************************************/
// With advanced types, we can perform crazy amounts of computation on the type
// system, after all, typescript's types are a typed lambda calculus.
// With our types, we can perform our own typechecking. But wait. How do we
// halt compilation to let the programmer know that something is wrong?
// For that, we need to generate some sort of compile time error.
// This is where unsatisfiable comes in.
// Casting null to satisfies<true> works just fine but not satisfies<false>.
// null as unsatisfiable generates a compile time error.

// I use this extensively in protocols.ts
// See action_class_matches and the void(null as action_class_matches...)

declare const unsatisfiable: unique symbol;
type unsatisfiable = typeof unsatisfiable;

export type satisfies<cond extends boolean>
   = cond extends true ? never : unsatisfiable;
/* END UNSATISFIABLE **********************************************************/
