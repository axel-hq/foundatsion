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

/** obscure type traits that most people won't be using */
export namespace tt {
   export type prim =
      | null
      | undefined
      | boolean
      | number
      | bigint
      | string
      | symbol;

   type _is_union<t1, t2> =
      t2 extends unknown
         ? t2 extends t1
            ? unknown // it's not a union
            : true
         : never;
   /** Returns `true` if t is a union */
   export type is_union<t> = _is_union<t, t>;

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
   export type is_const_string<s extends string> =
      is_union<s> extends true
         ? not_templated_string<s>
         : false;

   declare const const_string: unique symbol;
   export type const_string = {[const_string]: void};

   // Returns `true | false`
   export type is_const_prim<p extends prim> =
      is_union<p> extends true                                   // case: union
         ? false
      : p extends number                                         // case: number
         ? number extends p
            ? false
            : true
      : p extends bigint                                         // case: bigint
         ? bigint extends p
            ? false
            : true
      : p extends string                                         // case: string
         ? is_const_string<p>
      : p extends symbol                                         // case: symbol
         ? symbol extends p
            ? false
            : true
      : true;
      
   /**
    * If you're using this, you're probably doing something wrong.
    * Also sometimes it randomly doesn't work.
    */
   export type union_to_intersection<u> =
      (u extends any ? {(k: u): void} : never) extends {(k: infer t): void} ? t : never;
}
