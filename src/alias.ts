// why doesn't the alias rtti-wrapper cache it's types?
// well, I assume that if you're naming something, you're probably gonna keep
// track of it for the entire duration of the program.

import {rtti} from "./rtti";
import {unsound} from "./unsound";
import {dyn_record} from "./dyn_record";

export function alias<t>(r: rtti<t>, name: string): rtti<t> {
   return new Proxy(r, {
      get(target, prop) {
         if (prop === "name") {
            return name;
         } else {
            return dyn_record.from(target)[unsound.shut_up(prop)];
         }
      }
   });
}
