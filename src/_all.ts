export {alias} from "./alias";
export {array} from "./array";
import {bigint as _bigint} from "./bigint";
export const bigint: typeof _bigint = _bigint;
import {boolean as _boolean} from "./boolean";
export const boolean: typeof _boolean = _boolean;
export {cast} from "./cast";
export {FoundatsionError as Error} from "./error";
import {never as _never} from "./never";
export const never: typeof _never = _never;
export {nt_s, newtype, unwrap} from "./newtype";
import {number as _number} from "./number";
export const number: typeof _number = _number;
import {oo as _oo} from "./oo";
export type oo = _oo;
export const oo: typeof _oo = _oo;
export {prim} from "./prim";
import {real as _real} from "./real";
export type real = _real;
export const real: typeof _real = _real;
import {rtti as _rtti} from "./rtti";
export type rtti = _rtti;
export const rtti: typeof _rtti = _rtti;
import {string as _string} from "./string";
export const string: typeof _string = _string;
import {symbol as _symbol} from "./symbol";
export const symbol: typeof _symbol = _symbol;
export {text} from "./text";
export {tuple} from "./tuple";
export {
   __unreachable,
   ignore,
   absurd,
   identity,
   ct_true,
   ct_val,
   tt,
} from "./type_traits";
export {union} from "./union";
import {unknown as _unknown} from "./unknown";
export const unknown: typeof _unknown = _unknown;
import {unsigned as _unsigned} from "./unsigned";
export type unsigned = _unsigned;
export const unsigned: typeof _unsigned = _unsigned;
import {unsound as _unsound} from "./unsound";
export const unsound: typeof _unsound = _unsound;
