import {newtype} from "./newtype";
import {rtti} from "./rtti";
import {string} from "./string";
import {text} from "./text";

export class FoundatsionError extends Error {
   passages: FoundatsionError.passage[];
   /**
    * Use `"\n"` to indicate a newline.
    * Entries that do not end in newline will be concatenated with a space and
    * the entry after it.
    * You do not need to add a newline before Errors.
    * One is added automatically.
    */
   constructor (...msg: FoundatsionError.input[]) {
      // :scunge:
      const thisꓸpassages: FoundatsionError.passage[] = [];
      let working_line: FoundatsionError.line | null = null;
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
                  thisꓸpassages.push(line);
               } else if (line === "") {
                 thisꓸpassages.push(working_line);
                 working_line = null;
               } else {
                  working_line += ` ${line}`;
                  thisꓸpassages.push(working_line);
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
         if (Array.isArray(e)) {
            if (working_line !== null) {
               thisꓸpassages.push(working_line);
               working_line;
            }
            thisꓸpassages.push(e);
         }
         if (e instanceof FoundatsionError) {
            if (working_line !== null) {
               thisꓸpassages.push(working_line);
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
            // thisꓸlines.push(`${e.name}:`);
            thisꓸpassages.push(e.passages);
            continue;
         }
         if (e instanceof Error) {
            if (working_line !== null) {
               thisꓸpassages.push(working_line);
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
            thisꓸpassages.push(`${e.name}:`);
            thisꓸpassages.push(sublines);
         }
      }

      if (working_line !== null) {
         thisꓸpassages.push(working_line);
         working_line = null;
      }

      super(FoundatsionError.processed_input_to_string(thisꓸpassages));

      // just shut up ts
      this.passages = [];
      this.name = "FoundatsionError";
      Object.defineProperty(this, "lines", {
         configurable: false,
         enumerable: false,
         value: thisꓸpassages,
         writable: false,
      });
   }

   static processed_input_to_lines(l: FoundatsionError.passage, len: number): string[] {
      if (typeof l === "string") {
         return text.wrap(len, l);
      } else {
         const lines: string[] = [];
         for (const sub of l) {
            for (const subsub of FoundatsionError.processed_input_to_lines(sub, len - 2)) {
               lines.push(`> ${subsub}`);
            }
         }
         return lines;
      }
   }

   static processed_input_to_string(l: FoundatsionError.passage[]): string {
      if (l.length === 0) {
         return "";
      } else {
         const lines = FoundatsionError.processed_input_to_lines(l, 80);
         return `\n${lines.join("\n")}`;
      }
   }
}

export namespace FoundatsionError {
   /**
    * A line is a string without a newline in it.
    */
   export type line = string & newtype<"FoundatsionError.line">;
   export namespace line {
      export const name = "FoundatsionError.line";
      export function is(u: unknown): u is line {
         return string.is(u) && (!u.includes("\n"));
      }
      export function assert(u: unknown): asserts u is line {
         string.assert(u);
         if (u.includes("\n")) {
            throw new FoundatsionError(
               `The string ${text.show(u)} includes a newline!`,
            );
         }
      }
   }
   export type passage = line | passage[];
   export type input = string | passage[] | Error | FoundatsionError;
   export namespace processed_input {
      export const name = "processed_input";
      export const is = rtti.is_from_assert(assert);
      export function assert(u: unknown): asserts u is passage {
         if (typeof u === "string") return;
         if (Array.isArray(u)) {
            for (const e of u) assert(e);
            return;
         }
         throw new FoundatsionError(
            ""
         );
      }
   }
}
