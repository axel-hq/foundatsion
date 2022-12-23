import {F, $} from ".";

$.true$<F.tt.is_union<1 | 2>>;
$.true$<F.tt.is_union<boolean>>;
$.false$<F.tt.is_union<1>>;
type oh_no = {oh: "no"};
$.false$<F.tt.is_unit<boolean & oh_no>>;
$.false$<F.tt.is_unit<number & oh_no>>;
$.false$<F.tt.is_unit<bigint & oh_no>>;
$.false$<F.tt.is_unit<string & oh_no>>;
$.false$<F.tt.is_unit<symbol & oh_no>>;

/** `F.T<a> => t := a` */
function invariant<t>(_: F.T<t>, __: t): void {}
/** `F.T<a> => t <: a` */
function covariant<t>(_: F.T.Co<t>, __: t): void {}
/** `F.T.Contra<a> => t :> a` */
function contravariant<t>(_: F.T.Contra<t>, __: t): void {}

type top = unknown;
type middle1 = {};
type middle2 = null | undefined;
type bottom = {never_say: never};

const top: top = null;
const middle1: middle1 = {};
const middle2: middle2 = null;
const bottom: bottom = {never_say: "SODA!" as never};

type take<t> = {(_: t): void};
function take<t>(_: t): void {}
namespace take {
   export const top = take<top>;
   export const middle1 = take<middle1>;
   export const middle2 = take<middle2>;
   export const bottom = take<bottom>;

   export function invariant<t>(_: F.T<t>, __: take<t>): void {}
   export function covariant<t>(_: F.T.Co<t>, __: take<t>): void {}
   export function contravariant<t>(_: F.T.Contra<t>, __: take<t>): void {}
}

{
   // t := top
   invariant(F.T<top>, top);
   invariant(F.T<top>, middle1);
   invariant(F.T<top>, middle2);
   invariant(F.T<top>, bottom);
   take.invariant(F.T<top>, take.top);
   // @ts-expect-error
   take.invariant(F.T<top>, take.middle1);
   // @ts-expect-error
   take.invariant(F.T<top>, take.middle2);
   // @ts-expect-error
   take.invariant(F.T<top>, take.bottom);

   // t := middle1
   // @ts-expect-error
   invariant(F.T<middle1>, top);
   invariant(F.T<middle1>, middle1);
   // @ts-expect-error
   invariant(F.T<middle1>, middle2);
   invariant(F.T<middle1>, bottom);
   take.invariant(F.T<middle1>, take.top);
   take.invariant(F.T<middle1>, take.middle1);
   // @ts-expect-error
   take.invariant(F.T<middle1>, take.middle2);
   // @ts-expect-error
   take.invariant(F.T<middle1>, take.bottom);

   // t := bottom
   // @ts-expect-error
   invariant(F.T<bottom>, top);
   // @ts-expect-error
   invariant(F.T<bottom>, middle1);
   // @ts-expect-error
   invariant(F.T<bottom>, middle2);
   invariant(F.T<bottom>, bottom);
}

{
   covariant(F.T<top>, top);     // t := top
   covariant(F.T<top>, middle1); // t := top
   covariant(F.T<top>, middle2); // t := top
   covariant(F.T<top>, bottom);  // t := top

   take.covariant(F.T<top>, take.top);     // t := top
   take.covariant(F.T<top>, take.middle1); // t := middle1
   take.covariant(F.T<top>, take.middle2); // t := middle2
   take.covariant(F.T<top>, take.bottom);  // t := bottom

   // @ts-expect-error
   covariant(F.T<middle1>, top);     // t := middle1
   covariant(F.T<middle1>, middle1); // t := middle1
   // @ts-expect-error
   covariant(F.T<middle1>, middle2); // t := middle1
   covariant(F.T<middle1>, bottom);  // t := middle1

   take.covariant(F.T<middle1>, take.top);     // t := middle1
   take.covariant(F.T<middle1>, take.middle1); // t := middle1
   // @ts-expect-error
   take.covariant(F.T<middle1>, take.middle2); // t := middle1
   take.covariant(F.T<middle1>, take.bottom);  // t := bottom

   // @ts-expect-error
   covariant(F.T<bottom>, top);     // t := bottom
   // @ts-expect-error
   covariant(F.T<bottom>, middle1); // t := bottom
   // @ts-expect-error
   covariant(F.T<bottom>, middle2); // t := bottom
   covariant(F.T<bottom>, bottom);  // t := bottom
}

import test from "ava";

test("type_traits typechecks properly!", t => t.pass());
