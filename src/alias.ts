// why doesn't the alias rtti-wrapper cache it's types?
// well, I assume that if you're naming something, you're probably gonna keep
// track of it for the entire duration of the program.

import {oo} from "./oo";
import {rtti} from "./rtti";
import {unsound} from "./unsound";

export function alias<r extends rtti>(r: r, name: string): r {
   return new Proxy(r, {
      get(target, prop): any {
         if (prop === "name") {
            return name;
         } else {
            return oo.from(target)[unsound.shut_up(prop)];
         }
      },
   });
}
