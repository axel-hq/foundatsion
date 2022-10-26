import {rtti} from "./rtti";
import {unknown} from "./unknown";
import {unsound} from "./unsound";
import {dyn_record} from "./dyn_record";
import {FoundatsionError} from "./error";

function cast<from, to, to_name extends string>(
   rtti_from: rtti<from> & {to: {[m in to_name]: {(from: from): to}}},
   rtti_to: rtti<to, to_name> & rtti.ct_name<to_name>,
   from: from,
): to;
function cast<from, to, from_name extends string>(
   rtti_from: rtti<from, from_name> & rtti.ct_name<from_name>,
   rtti_to: rtti<to> & {from: {[m in from_name]: {(from: from): to}}},
   from: from,
): to;
function cast<from, to>(
   rtti_from: rtti<from>,
   rtti_to: rtti<to> & {from?: dyn_record},
   from: from
): to {
   if (dyn_record.field_is(rtti_from, "to", dyn_record)) {
      const to = rtti_from.to;
      const name = rtti_to.name
      if (dyn_record.field_is(to, name, unknown)) {
         const cast_fn = to[name];
         try {
            unsound.any_fn.assert(cast_fn);
         } catch (e) {
            if (e instanceof Error) {
               throw new FoundatsionError(
                  `While casting from ${rtti_from.name} to ${rtti_to.name},`,
                  `found (${rtti_from.name}).to.[${name}] but it wasn't the`,
                  "right type",
                  e,
               );
            } else {
               throw e;
            }
         }
         return unsound.cast<to>(cast_fn(from));
      }
   }
   if (dyn_record.field_is(rtti_to, "from", dyn_record)) {
      const from = rtti_to.from;
      const name = rtti_from.name;
      if (dyn_record.field_is(from, name, unknown)) {
         const cast_fn = from[name];
         try {
            unsound.any_fn.assert(cast_fn);
         } catch (e) {
            if (e instanceof Error) {
               throw new FoundatsionError(
                  `While casting from ${rtti_from.name} to ${rtti_to.name},`,
                  `found (${rtti_to.name}).from.[${name}] but it wasn't the`,
                  "right type",
                  e,
               );
            } else {
               throw e;
            }
         }
         return unsound.cast<to>(cast_fn(from));
      }
   }
   // at this point, neither the .from.to or .to.from methods were found
   throw new FoundatsionError(
      ""
   );
};
export {cast};

