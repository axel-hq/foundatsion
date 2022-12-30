export function __unreachable(): never {
   throw __unreachable;
}
// pleas optimize uwu
export const ignore = (..._: any[]): void => {};
export const absurd = <t>(_: never): t => __unreachable();

/** Explicit type parameter (invariant by default) */
export type T<t> = typeof T<t>;
export function T<t>(_do_not_call_this_function_or_you_will_be_fired: never): {(v: t): t} {
   __unreachable();
}
export namespace T {
   /** Covariant explicit type parameter */
   export type Co<t> = typeof Co<t>;
   export function Co<t>(_do_not_call_this_function_or_I_will_kill_you: never): {(v: t): any} {
      __unreachable();
   }
   /** Contravariant explicit type parameter */
   export type Contra<t> = typeof Contra<t>;
   export function Contra<t>(_do_not_call_this_function_or_you_will_be_flensed: never): {(v: any): t} {
      __unreachable();
   }
}

/**
 * λx.x
 *
 * Also functions as upcast.
 */
export const id = <t>(t: t): t => t;
/**
 * Sometimes, setting a value to a type dependent on that value will create a
 * circular type dependency.
 *
 * Use launder to break the dependency.
 */
export const launder = <t = never>(v: t): t => v;

/** Check that a type is true. Useful with conditional types. */
export const ct_true: {<_ extends true>(): void} = ignore;

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
         ? t1 extends t2
            ? never
            : true // union found
         : never;
   /** Returns `true` if t is a union */
   export type is_union<t> = _is_union<t, t> extends never ? false : true;

   /** Returns `true` on regular string and `false` on templated string */
   export type not_templated_string<s extends string> =
      s extends ""
         ? true
         : `${s}` extends `${infer head}${infer tail}`
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
   export type is_unit_string<s extends string> =
      is_union<s> extends true
         ? false
         : not_templated_string<s>;

   declare const unit_string: unique symbol;
   export type unit_string = {[unit_string]: void};

   // Internally, the typescript compiler has a flag called Unit.
   // That's basically what we're making here except on the typelevel.

   // Returns `true | false`
   export type is_unit<p extends prim> =
      is_union<p> extends true                                   // case: union
         ? false
      : p extends number                                         // case: number
         ? `${number}` extends `${p}`
            ? false
            : true
      : p extends bigint                                         // case: bigint
         ? `${bigint}` extends `${p}`
            ? false
            : true
      : p extends string                                         // case: string
         ? is_unit_string<p>
      : p extends symbol                                         // case: symbol
         ? false
      : true;

   declare const unit: unique symbol;
   /**
    * A unit is a type which is satisfied by a single known runtime value.
    * For instance, `1` is a unit but `1 | 2` is not.
    */
   export type unit = {[unit]: void};

   export type require_unit<t extends prim> =
      is_unit<t> extends true ? t : unit;

   export type require_unit_tpl<ts extends tt.prim[]> = {
      [k in (number & keyof ts)]:
         tt.is_unit<ts[k]> extends true
         ? ts[k]
         : tt.unit;
   };

   /**
    * If you're using this, you're probably doing something wrong.
    * Also sometimes it randomly doesn't work.
    */
   export type union_to_intersection<u> =
      (u extends any ? {(k: u): void} : never) extends {(k: infer t): void} ? t : never;

   export type is_sibling<a, b> =
      a extends b
         ? b extends a
            ? true
            : false
         : false;

   /**
    * @example
    * type a = {w: x} & {y: z};
    * type b = {w: x; y: z};
    *
    * // a has different behavior than b
    */
   export type merge<o extends {}> = {[k in keyof o]: o[k]};

   export type keyof_any<t> = t extends unknown ? keyof t : never;
}
