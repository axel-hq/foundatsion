export namespace text {
   export function wrap80(s: string): string[] {
      const lines: string[] = [];
      for (const [, capture_group] of s.matchAll(/(.{1,80})\s/g)) {
         lines.push(capture_group);
      }
      return lines;
   }

   // needs implementing. Should escape characters and spaces
   export function show(a: any): string {
      return "text.show";
   }
};
