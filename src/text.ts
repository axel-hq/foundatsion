// this file is not allowed to depend on other files!
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
         if (Array.isArray(u)) {
            return `[${u.map(show).join(", ")}]`;
         } else if (u === null) {
            return "null";
         } else {
            const defined_keys = Object.keys(u).filter(k => (u as any)[k] !== undefined);
            return `{${defined_keys.join(", ")}}`;
         }
      }
   }
}
