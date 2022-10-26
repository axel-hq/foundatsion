import {text} from "./text";

type error_input = string | Error | FoundatsionError;

type processed_input = string | processed_input[];

export class FoundatsionError extends Error {
   lines: processed_input[];
   /**
    * Use `"\n"` to indicate a newline.
    * Entries that do not end in newline will be concatenated with a space and
    * the entry after it.
    * You do not need to add a newline before Errors.
    * One is added automatically.
    */
   constructor (...msg: error_input[]) {
      // :scunge:
      const thisꓸlines: processed_input[] = [];
      let working_line: string | null = null;
      for (let e of msg) {
         if (typeof e === "string") {
            for (
               // iterate through lines
               let idx: number;
               (idx = e.indexOf("\n")) >= 0;
               e = e.slice(idx + 1))
            {
               const line = e.slice(0, idx);
               if (working_line === null) {
                  thisꓸlines.push(line);
               } else if (line === "") {
                 thisꓸlines.push(working_line);
                 working_line = null;
               } else {
                  working_line += ` ${line}`;
                  thisꓸlines.push(working_line);
                  working_line = null;
               }
               // at the end of this loop, linebuffer should always be null
               // but if this loop doesn't run it might not be null
            }
            // from here on out, e doesn't contain any newlines
            // there might not be anything left in e if it ended with a newline
            if (e.length > 0) {
               if (working_line === null) {
                  working_line = e;
               } else {
                  working_line += ` ${e}`;
               }
            }
            continue;
         }
         if (e instanceof FoundatsionError) {
            if (working_line === null) {}
            else {
               thisꓸlines.push(working_line);
               working_line = null;
            }
            /*
            FoundatsionError:
            > blah blah blah
            > blah blah blah
            > FoundatsionError
            > > other stuff here
            > > other stuff here
            */
            thisꓸlines.push(`${e.name}:`);
            thisꓸlines.push(e.lines);
            continue;
         }
         if (e instanceof Error) {
            if (working_line === null) {}
            else {
               thisꓸlines.push(working_line);
               working_line = null;
            }
            const sublines = [];
            let msg = e.message;
            for (
               // iterate through lines in e.message
               let idx: number;
               (idx = msg.indexOf("\n")) >= 0;
               msg = msg.slice(idx + 1))
            {
               sublines.push(msg.slice(0, idx));
            }
            // now msg has no more newlines in it
            // but it might also have nothing in it
            if (msg.length > 0) {
               sublines.push(msg);
            }
            thisꓸlines.push(`${e.name}:`);
            thisꓸlines.push(sublines);
         }
      }

      if (working_line !== null) {
         thisꓸlines.push(working_line);
         working_line = null;
      }

      super(FoundatsionError.processed_input_to_string(thisꓸlines));

      // just shut up ts
      this.lines = [];
      this.name = "FoundatsionError";
      Object.defineProperty(this, "lines", {
         configurable: false,
         enumerable: false,
         value: thisꓸlines,
         writable: false,
      });
   }

   static processed_input_to_lines(l: processed_input): string[] {
      if (typeof l === "string") {
         return text.wrap(78, l);
      } else {
         const lines: string[] = [];
         for (const sub of l) {
            for (const subsub of FoundatsionError.processed_input_to_lines(sub)) {
               lines.push(`> ${subsub}`);
            }
         }
         return lines;
      }
   }

   static processed_input_to_string(l: processed_input[]): string {
      if (l.length === 0) {
         return "";
      } else {
         const lines = FoundatsionError.processed_input_to_lines(l);
         return `\n${lines.join("\n")}`;
      }
   }
}
