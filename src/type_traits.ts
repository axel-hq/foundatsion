// pleas optimize uwu
export const identity = <t>(x: t): t => x;
export const unit = <t>(x: t) => {};

export type not_undefined<t> = t extends infer i | undefined ? i : t;

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
   & (rtti.has_is<t> | {is: never})
   & Partial<rtti.has_assert<t>>;
