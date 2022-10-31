import {oo} from "./oo";
import {rtti} from "./rtti";
import {text} from "./text";
import {unsound} from "./unsound";
import {FoundatsionError} from "./error";

function cast<from, from_name extends string, to>(
   rtti_from: rtti<from, from_name> & rtti.has_valid_name<from_name>,
   rtti_to: rtti<to> & {from: {[m in from_name]: {(from: from): to}}},
   from: from,
): to;
function cast<from, to, to_name extends string>(
   rtti_from: rtti<from> & {to: {[m in to_name]: {(from: from): to}}},
   rtti_to: rtti<to> & rtti.has_valid_name<to_name>,
   from: from,
): to;
function cast<from, to>(
   rtti_from: rtti<from> & {to?: oo},
   rtti_to: rtti<to> & {from?: oo},
   from: from,
): to {
   if (oo.field_is(rtti_to, "from", oo)) {
      const from = rtti_to.from;
      const cast = from[rtti_from.name];
      if (unsound.any_fn.is(cast)) {
         return unsound.cast<to>(cast(from));
      }
   }

   if (oo.field_is(rtti_from, "to", oo)) {
      const to = rtti_from.to;
      const cast = to[rtti_to.name];
      if (unsound.any_fn.is(cast)) {
         return unsound.cast<to>(cast(from));
      }
   }

   throw new FoundatsionError(
      `Could not cast from (${rtti_from.name}) to (${rtti_to.name}) because:\n`,
      `1. rtti_to.from[${text.stringify(rtti_from.name)}] was not a function.\n`,
      `2. rtti_from.to[${text.stringify(rtti_to.name)}] was not a function.\n`,
   );
}
export {cast};
