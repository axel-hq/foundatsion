// why doesn't the alias rtti-wrapper cache it's types?
// well, I assume that if you're naming something, you're probably gonna keep
// track of it for the entire duration of the program.

import {rtti} from "./rtti";
import {unsound} from "./unsound";
import {dyn_record} from "./dyn_record";

export function alias<r extends rtti>(r: r, name: string): r {
   return new Proxy(r, {
      get(target, prop): any {
         if (prop === "name") {
            return name;
         } else {
            return dyn_record.from(target)[unsound.shut_up(prop)];
         }
      },
   });
}
