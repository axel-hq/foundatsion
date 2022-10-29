import {oo} from "./oo";
import {rtti} from "./rtti";
import {unsound} from "./unsound";
import {FoundatsionError} from "./error";

type tof<r extends rtti> = r extends rtti<infer t> ? t : never;
function cast<rtti_from extends rtti, to>(
   rtti_from: rtti_from & (rtti_from extends {to: {(r: rtti<to>, from: tof<rtti_from>): to}} ? unknown : never),
   rtti_to: rtti<to>,
   from: tof<rtti_from>,
): to;
function cast<from, rtti_to extends rtti>(
   rtti_from: rtti<from>,
   rtti_to: rtti_to & (rtti_to extends {from: {(r: rtti<from>, from: from): tof<rtti_to>}} ? unknown : never),
   from: from,
): tof<rtti_to>;
function cast<from, to>(
   rtti_from: rtti<from> & {to?: unsound.any_fn},
   rtti_to: rtti<to> & {from?: unsound.any_fn},
   from: from
): to {
   if (oo.field_is(rtti_from, "to", unsound.any_fn)) {
      const to = rtti_from.to;
      return unsound.cast<to>(to(rtti_to, from));
   }

   if (oo.field_is(rtti_to, "from", unsound.any_fn)) {
      const from = rtti_to.from;
      return unsound.cast<to>(from(rtti_from, from));
   }
   // at this point, neither the .from.to or .to.from methods were found
   throw new FoundatsionError(
      `Could not cast from (${rtti_from.name}) to (${rtti_to.name}) because:\n`,
      "1. the initial rtti object did not contain a method .to\n",
      "2. the terminal rtti object did not contain a method .from\n",
   );
}
export {cast};
