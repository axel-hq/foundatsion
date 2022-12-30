import {F, $} from ".";

type oh_no = {oh: "no"};
$.true$<F.tt.is_union<1 | 2>>;
$.true$<F.tt.is_union<boolean>>;
$.false$<F.tt.is_union<1>>;
$.true$<F.tt.is_unit<true>>;
$.true$<F.tt.is_unit<false>>;
$.true$<F.tt.is_unit<1>>;
$.true$<F.tt.is_unit<`I have ${1} dog`>>;
$.true$<F.tt.is_unit<undefined>>;
$.true$<F.tt.is_unit<never>>; // cults, this should probably be false but whatever
$.true$<F.tt.is_unit<null>>;
$.true$<F.tt.is_unit<"">>;
$.true$<F.tt.is_unit<"this is still a unit but it's a weird one" & oh_no>>;
$.false$<F.tt.is_unit<boolean & oh_no>>;
$.false$<F.tt.is_unit<number & oh_no>>;
$.false$<F.tt.is_unit<bigint & oh_no>>;
$.false$<F.tt.is_unit<string & oh_no>>;
$.false$<F.tt.is_unit<symbol & oh_no>>;
$.false$<F.tt.is_union<symbol>>;

/** `F.T<a> => t := a` */
function invariant<t>(_: F.T<t>, __: t): void {}
/** `F.T.Co<a> => t <: a` */
function covariant<t>(_: F.T.Co<t>, __: t): void {}
/** `F.T.Contra<a> => t :> a` */
function contravariant<t>(_: F.T.Contra<t>, __: t): void {}

declare const top_s: unique symbol;

type top = {[top_s]: void};
type middle1 = top & {species: string};
type middle2 = top & {color: string};
type bottom = middle1 & middle2;

const top = {} as top;
const middle1 = {} as middle1;
const middle2 = {} as middle2;
const bottom = {} as bottom;

middle1 satisfies top;
middle2 satisfies top;
bottom satisfies top;
bottom satisfies middle1;
bottom satisfies middle2;

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
   // t := top
   covariant(F.T<top>, top);
   covariant(F.T<top>, middle1);
   covariant(F.T<top>, middle2);
   covariant(F.T<top>, bottom);

   take.covariant(F.T<top>, take.top);     // t := top
   take.covariant(F.T<top>, take.middle1); // t := middle1
   take.covariant(F.T<top>, take.middle2); // t := middle2
   take.covariant(F.T<top>, take.bottom);  // t := bottom

   // t := middle1
   // @ts-expect-error
   covariant(F.T<middle1>, top);
   covariant(F.T<middle1>, middle1);
   // @ts-expect-error
   covariant(F.T<middle1>, middle2);
   covariant(F.T<middle1>, bottom);

   take.covariant(F.T<middle1>, take.top);     // t := middle1
   take.covariant(F.T<middle1>, take.middle1); // t := middle1
   // @ts-expect-error
   take.covariant(F.T<middle1>, take.middle2); // t := middle1
   take.covariant(F.T<middle1>, take.bottom);  // t := bottom

   // t := bottom
   // @ts-expect-error
   covariant(F.T<bottom>, top);
   // @ts-expect-error
   covariant(F.T<bottom>, middle1);
   // @ts-expect-error
   covariant(F.T<bottom>, middle2);
   covariant(F.T<bottom>, bottom);

   // t := bottom
   take.covariant(F.T<bottom>, take.top);
   take.covariant(F.T<bottom>, take.middle1);
   take.covariant(F.T<bottom>, take.middle2);
   take.covariant(F.T<bottom>, take.bottom);
}

{
   // t := top
   contravariant(F.T<top>, top);
   contravariant(F.T<top>, middle1);
   contravariant(F.T<top>, middle2);
   contravariant(F.T<top>, bottom);

   // t := top
   take.contravariant(F.T<top>, take.top);
   // @ts-expect-error
   take.contravariant(F.T<top>, take.middle1);
   // @ts-expect-error
   take.contravariant(F.T<top>, take.middle2);
   // @ts-expect-error
   take.contravariant(F.T<top>, take.bottom);

   contravariant(F.T<middle1>, top);     // t := top
   contravariant(F.T<middle1>, middle1); // t := middle1
   // @ts-expect-error
   contravariant(F.T<middle1>, middle2); // t := middle1
   contravariant(F.T<middle1>, bottom);  // t := middle1

   // t := middle1
   take.contravariant(F.T<middle1>, take.top);
   take.contravariant(F.T<middle1>, take.middle1);
   // @ts-expect-error
   take.contravariant(F.T<middle1>, take.middle2);
   // @ts-expect-error
   take.contravariant(F.T<middle1>, take.bottom);

   contravariant(F.T<bottom>, top);     // t := top
   contravariant(F.T<bottom>, middle1); // t := middle1
   contravariant(F.T<bottom>, middle2); // t := middle2
   contravariant(F.T<bottom>, bottom);  // t := bottom

   // t := bottom
   take.contravariant(F.T<bottom>, take.top);
   take.contravariant(F.T<bottom>, take.middle1);
   take.contravariant(F.T<bottom>, take.middle2);
   take.contravariant(F.T<bottom>, take.bottom);
}

import test from "ava";

test("type_traits typechecks properly!", t => t.pass());
