import {FoundatsionError} from "./err";

export namespace text {
   export function wrap80(s: string): string[] {
      const lines: string[] = [];
      for (const [, capture_group] of s.matchAll(/(.{1,80})\s/g)) {
         if (capture_group == null) {
            throw new FoundatsionError(
               "Called wrap80 but internal regex capture group was null!"
            );
         }
         lines.push(capture_group);
      }
      return lines;
   }
};
