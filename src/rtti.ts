export type has_typename
   = {typename: string};
export type has_is<O extends I, I = unknown>
   = {is: (u: I) => u is O};
export type has_assert<O extends I, I = unknown>
   = {assert: {(u: I): asserts u is O}};
export type has_from<O, I = unknown>
   = {from: (u: I) => O};
