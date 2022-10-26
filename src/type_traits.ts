export function __unreachable(): never {
   throw __unreachable;
}
// pleas optimize uwu
export const ignore = <t>(_?: t): void => {};
export const absurd = <t>(_: never): t => __unreachable();
export const identity = <t>(x: t): t => x;

/**
 * Check that a type is true. Useful with conditional types.
 */
export const ct_true: {<_ extends true>(): void} = ignore;
/**
 * Check that the type of a value extends `sup` at compile time.
 *
 * Don't use the second argument, it's only there to force you to use the first
 * one.
 */
export const ct_val: {<sup = never, sub extends sup = sup>(sub: sub): void} = ignore;

type _not_union<t1, t2> =
   t1 extends unknown
      ? t2 extends t1
         ? true
         : unknown
      : never;
/** Returns `true` if t is not a union, `unknown` otherwise */
export type not_union<t> = _not_union<t, t>;

/** Returns `true` on regular string and `false` on templated string */
export type not_templated_string<s extends string> =
   s extends ""
      ? true
      : s extends `${infer head}${infer tail}`
         ? string extends head
            ? false
            : `${number}` extends head
               ? false
               : `${bigint}` extends head
                  ? false
                  : `${boolean}` extends head
                     ? false
                     : not_templated_string<tail>
         : false;

/** Returns `true | false` */
export type is_prim_string<s extends string> =
   not_union<s> extends true
      ? not_templated_string<s>
      : false;

declare const primitive_string: unique symbol;
/**
 * A primitive string is a string that can only have one value.
 *
 * Things like "foo", "bar", and "baz" are primitive strings.
 *
 * `foo${string}`, string, `qux${number}` are not primitive strings.
 */
export type primitive_string = {[primitive_string]: void};
