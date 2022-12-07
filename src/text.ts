import {array} from "./array";

export namespace text {
   /**
    * Whenever you're printing something from the user, you should probably just
    * use this.
    *
    * Don't plug `typeof x` into this, that'd be silly.
    */
   export function show(u: unknown): string {
      switch (typeof u) {
      case "bigint":    return `${u}n`;
      case "boolean":   return `${u}`;
      case "number":    return `${u}`;
      case "string":    return JSON.stringify(u);
      case "symbol":    return `Symbol(${show(u.description)})`;
      case "undefined": return "undefined";
      case "function":  return `function ${u.name}(...)`;
      case "object":
         if (array.is(u)) {
            return `[${u.map(show).join(", ")}]`;
         } else if (u === null) {
            return "null";
         } else {
            return "object";
         }
      }
   }
}
