import {array} from "./array";
import {oo} from "./oo";

export namespace text {
   /**
    * Whenever you're printing something from the user, you should probably just
    * use this.
    *
    * Don't plug `typeof x` into this, that'd be silly.
    *
    * Will not error
    */
   export function show(u: unknown): string {
      switch (typeof u) {
      case "bigint":    return `${u}n`;
      case "boolean":   return `${u}`;
      case "number":    return `${u}`;
      case "string":    return JSON.stringify(u);
      case "symbol":    return `Symbol(${u.description === undefined ? "" : show(u.description)})`;
      case "undefined": return "undefined";
      case "function":  return `function ${u.name}(...)`;
      case "object":
         if (array.is(u)) {
            return `[${u.map(show).join(", ")}]`;
         } else if (u === null) {
            return "null";
         } else {
            const defined_keys = oo.keys(u).filter(k => u[k] !== undefined);
            return `{${defined_keys.join(", ")}}`;
         }
      }
   }
}
