import {newtype} from "./newtype";
import {rtti} from "./rtti";
import {string} from "./string";
import {text} from "./text";
import {unsound} from "./unsound";

export class FoundatsionError extends Error {
   passages: FoundatsionError.passage[];
   /**
    * Use `"\n"` to indicate a newline.
    * Entries that do not end in newline will be concatenated with a space and
    * the entry after it.
    * You do not need to add a newline before Errors.
    * One is added automatically.
    */
   constructor (...msg: FoundatsionError.input_arg[]) {
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
               const line = unsound.cast<FoundatsionError.line>(e.slice(0, idx));
               if (working_line === null) {
                  thisꓸpassages.push(line);
               } else

               if (line === "") {
                 thisꓸpassages.push(working_line);
                 working_line = null;
               }

               else {
                  working_line = unsound.cast<FoundatsionError.line>(`${working_line} ${line}`);
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
            thisꓸlines.push(`${e.name}:`);
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
   /** A line is a string without a newline in it. */
   export type line = string & newtype<"FoundatsionError.line">;
   export namespace line {
      export const name = "FoundatsionError.line";
      export function is(u: unknown): u is line {
         return string.is(u) && (!u.includes("\n"));
      }
      export function assert(this: typeof line, u: unknown): asserts u is line {
         string.assert(u);
         if (u.includes("\n")) {
            throw new FoundatsionError(
               `Could not assert for ${this.name} because the the string`,
               `${text.show(u)} includes a newline!`,
            );
         }
      }
   }
   /**
    * A passage represents a multiple indented (or unindented) blocks of text.
    */
   export type passage = line | passage[];
   export namespace passage {
      export const name = "FoundatsionError.passage";
      export function is(u: unknown): u is passage {
         if (Array.isArray(u)) {
            return u.every(is);
         } else {
            return line.is(u);
         }
      }
      export function assert(this: typeof passage, u: unknown): asserts u is passage {
         // honestly, I don't really know if this is any better for performance
         // but I'm mostly doing it for the error message
         const stack = [u];
         while (stack.length > 0) {
            const last_e = stack.pop();
            try {
               if (Array.isArray(last_e)) {
                  // push sub array to back in reverse
                  // let's imagine you have a passage like so
                  // [[a, b, c], d]
                  // let's examine the stack at each loop

                  /* loop n
                     bottom
                     middle
                     top <- next
                  */

                  /* loop 0
                     [[a, b, c], d] <- next
                  */

                  /* loop 1
                     d
                     [a, b, c] <- next
                  */

                  /* loop 2
                     d
                     c
                     b
                     a <- next
                  */

                  // etc...
                  // since our stack uses the last element of the array as the
                  // top, we need to do it like this.
                  // notice how the elements are asserted in depth first order.
                  for (let i = last_e.length; i --> 0;) {
                     stack.push(last_e[i]);
                  }
               } else {
                  line.assert(last_e);
               }
            } catch (e) {
               if (e instanceof Error) {
                  throw new FoundatsionError(
                     `Error while asserting for ${this.name} at depth=${stack.length}`,
                     e,
                  );
               } else {
                  throw e;
               }
            }
         }
      }
   }

   export type input_arg =
      // trusted input & automatic flush:
      // if you pass an array as an argument, FoundatsionError trusts that you've
      // asserted it's validity.
      | passage[]
      // trusted input & automatic flush:
      // #lines used for input as a passage[]
      | FoundatsionError
      // automatic flush:
      // Interpreted in much the same way as FoundatsionError where
      // Error#message split into newlines is used instead of #lines
      | Error
      // split by newlines and interpreted as multiple input arguments
      | string;
}
