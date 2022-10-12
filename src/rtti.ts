export namespace rtti {
   export type has_name
      = {name: string};
   export type has_is<t>
      = {is: {(u: unknown): u is t}};
   export type has_assert<t>
      = {assert: {(u: unknown): asserts u is t}};
}
export type rtti<t = unknown> =
   & Partial<rtti.has_name>
   & Partial<rtti.has_is<t>>
   & Partial<rtti.has_assert<t>>;
