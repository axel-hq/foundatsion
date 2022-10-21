import {FoundatsionError} from "./err";

export namespace text {
   export function wrap80(s: string): string[] {
      const lines: string[] = [];
      for (const [, capture_group] of s.matchAll(/(.{1,80})\s/g)) {
         if (capture_group == null) {
            throw new FoundatsionError(
               "Called wrap80 but internal regex capture group was null.",
            );
         }
         lines.push(capture_group);
      }
      return lines;
   }

   export function stringify(u: unknown): string {
      switch (typeof u) {
      case "bigint": return `${u}n`;
      case "boolean": return `${u}`;
      case "number": return `${u}`;
      case "string": return JSON.stringify(u);
      case "symbol": return `Symbol(${stringify(u.description)})`;
      case "undefined": return "undefined";
      case "function":
         if (u.name) {
            return "anonymous function";
         } else {
            return "function";
         }
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
