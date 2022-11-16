import {rtti} from "./rtti";

export function assert<t>(r: rtti<t>, u: unknown): asserts u is t {
   r.assert(u);
}

export function assert_and_return<t, u>(r: rtti<t>, u: u): u & t {
   r.assert(u);
   return u;
}
