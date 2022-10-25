import {FoundatsionError} from "./error";

export namespace text {
   export function wrap(length: number, s: string): string[] {
      const lines: string[] = [];
      const r = new RegExp(`(.{1,${length}})(?:\\s|$)`, "g");
      for (const [, capture_group] of s.matchAll(r)) {
         if (capture_group == null) {
            throw new FoundatsionError(
               "Called wrap80 but internal regex capture group was null.",
            );
         }
         lines.push(capture_group);
      }
      return lines;
   }

   export type stringify<u>
      = u extends bigint ? `${u}n`
      : u extends boolean ? `${u}`
      : u extends number ? `${u}`
      : u extends string ? `"${u}"`
      : u extends symbol ? `Symbol(${stringify<u["description"]>})`
      : u extends undefined ? "undefined"
      : u extends Function ? "function"
      : u extends null ? "null"
      : u extends 

   /**
    * Whenever you're printing something from the user, you should probably just
    * use this.
    *
    * Don't plug `typeof x` into this, that'd be silly.
    */
   export function stringify(u: unknown): string {
      switch (typeof u) {
      case "bigint":  return `${u}n`;
      case "boolean": return `${u}`;
      case "number":  return `${u}`;
      case "string":  return JSON.stringify(u);
      case "symbol":  return `Symbol(${stringify(u.description)})`;
      case "undefined": return "undefined";
      case "function": return "function";
      case "object":
         if (Array.isArray(u)) {
            return `[${u.map(stringify).join(", ")}]`;
         } else if (u === null) {
            return "null";
         } else {
            return "object";
         }
      }
   }
};
