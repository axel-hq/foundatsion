import {text} from "./text";
import {string} from "./string";
import {newtype} from "./newtype";
import {unsound} from "./unsound";

export class FoundatsionError extends Error {
   name = "FoundatsionError";
   // this is actually initialized but typescript can't know
   // @ts-expect-error
   passages: FoundatsionError.passages;
   /**
    * Use `"\n"` to indicate a newline.
    * Entries that do not end in newline will be concatenated with a space and
    * the entry after it.
    * You do not need to add a newline before Errors.
    * One is added automatically.
    */
   constructor (...msg: FoundatsionError.input_arg[]) {
      const new_passages: FoundatsionError.passages = [];
      let linebuffer: FoundatsionError.line | null = null;
      for (const e of msg) {
         if (typeof e === "string") {
            let string_arg = e;
            // while we can find a newline in the string
            for (let idx_of_newline; (idx_of_newline = string_arg.indexOf("\n")) > 0;) {
               const line = string_arg.slice(0, idx_of_newline);
               string_arg = string_arg.slice(idx_of_newline + 1);

               unsound.assert<FoundatsionError.line>(line);
               // [1]
               // this one confused me initially when I read it a second time.
               // normally when we have a line, we append it to the linebuffer
               // with a space (see condition 3) but in this case, there's
               // nothing in the linebuffer.
               // It'd be kinda strange to just add a space, now wouldn't it?
               if (linebuffer === null) {
                  flush:
                  new_passages.push(line);
                  linebuffer satisfies null; continue;
               }

               // [2]
               // When a string is split with an lf at the start or end like so:
               // "\nbar baz\n".split('\n') -> ["", "bar baz", ""].
               // If we imagine the linebuffer = "foo", we don't want to flush
               // "foo ". We just want to flush without adding a space.
               if (line === "") {
                  flush:
                  new_passages.push(linebuffer);
                  linebuffer = null;
                  linebuffer satisfies null; continue;
               }

               // [3] (condition 3)
               // the linebuffer has something in it and line is normalish.
               // concatenate with a space and then flush.
               linebuffer = unsound.cast<FoundatsionError.line>(`${linebuffer} ${line}`);
               flush:
               new_passages.push(linebuffer);
               linebuffer = null;
               linebuffer satisfies null; continue;
            }
            // from here on out, string_arg doesn't contain any newlines.
            unsound.assert<FoundatsionError.line>(string_arg);
            if (string_arg.length > 0) {
               // there's still stuff after the last newline
               if (linebuffer === null) {
                  linebuffer = string_arg;
               } else {
                  linebuffer = unsound.cast<FoundatsionError.line>(` ${string_arg}`);
               }
            }
            // linebuffer could have stuff in it
            continue; // next argument
         }

         // passages
         if (Array.isArray(e)) {
            if (linebuffer !== null) {
               flush:
               new_passages.push(linebuffer);
               linebuffer = null;
            }
            new_passages.push(e);
            linebuffer satisfies null; continue;
         }

         if (e instanceof FoundatsionError) {
            if (linebuffer !== null) {
               new_passages.push(linebuffer);
               linebuffer = null;
            }
            const escapedname = FoundatsionError.line.escape_string(e.name);
            const header = `${escapedname}:`;
            unsound.assert<FoundatsionError.line>(header);
            /*
               FoundatsionError:
               > blah blah blah
               > blah blah blah
               > FoundatsionError
               > > other stuff here
               > > other stuff here
            */
            new_passages.push(header);
            new_passages.push(e.passages);
            linebuffer satisfies null; continue;
         }

         if (e instanceof Error) {
            if (linebuffer !== null) {
               new_passages.push(linebuffer);
               linebuffer = null;
            }
            const sublines = FoundatsionError.line.split_into(e.message);

            if (sublines[0] === "") {
               sublines.shift();
            }
            if (sublines[sublines.length - 1] === "") {
               sublines.pop();
            }

            const escapedname = FoundatsionError.line.escape_string(e.name);
            const header = `${escapedname}:`;
            unsound.assert<FoundatsionError.line>(header);

            new_passages.push(header);
            new_passages.push(sublines);
            linebuffer satisfies null; continue;
         }
      }

      if (linebuffer !== null) {
         new_passages.push(linebuffer);
         linebuffer = null;
      }
      linebuffer satisfies null;

      super(FoundatsionError.passages.cast_to_string(new_passages));

      Object.defineProperty(this, "passages", {
         configurable: false,
         enumerable: false,
         value: new_passages,
         writable: false,
      });
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
      export function assert<u>(this: typeof line, u: u): asserts u is u & line {
         string.assert(u);
         if (u.includes("\n")) {
            throw new FoundatsionError(
               `Could not assert for ${this.name} because the the string`,
               `${text.show(u)} includes a newline!`,
            );
         }
      }
      /** turns \n into "\\n" */
      export function escape_string(s: string): line {
         return s.replace(/\n/g, "\\n") as line;
      }
      export function split_into(s: string): line[] {
         return s.split("\n") as line[];
      }
      export function wrap(this: typeof line, l: line, length: number): line[] {
         const lines: string[] = [];
         const r = new RegExp(`(.{1,${length}})(?:\\s|$)`, "g");
         for (const [, capture_group] of l.matchAll(r)) {
            if (capture_group == null) {
               throw new FoundatsionError(
                  `Called ${this.name}.wrap ${length} but internal regex capture group was null.`,
               );
            }
            lines.push(capture_group);
         }
         return lines as line[];
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
      export function assert<u>(this: typeof passage, top: u): asserts top is u & passage {
         // honestly, I don't really know if this is any better for performance
         // but I'm mostly doing it for the error message
         type to_be_asserted = {e: unknown; path: number[]};
         const stack: to_be_asserted[] = [{e: top, path: []}];
         let curr: to_be_asserted | undefined;
         while (curr = stack.pop()) {
            if (Array.isArray(curr.e)) {
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
               for (let i = curr.e.length; i --> 0;) {
                  stack.push({e: curr.e[i], path: [...curr.path, i]});
               }
            }
            try {
               line.assert(curr.e);
            } catch (e) {
               if (e instanceof Error) {
                  if (curr.path.length > 0) {
                     const location = `top${curr.path.map(n => `[${n}]`).join("")}`;
                     throw new FoundatsionError(
                        `Error while asserting for ${this.name} at ${location}:`,
                        e,
                     );
                  } else {
                     throw new FoundatsionError(
                        `While asserting for ${this.name}, a non-array value`,
                        "was passed in as the top argument which resulted",
                        "in an error:",
                        e,
                     );
                  }
               } else {
                  throw e;
               }
            }
         }
      }

      export const default_line_wrap = 80;
      export function cast_to_lines(l: passage, line_length: number = default_line_wrap): line[] {
         if (typeof l === "string") {
            return line.wrap(l, line_length);
         } else {
            const lines: line[] = [];
            for (const sub of l) {
               // remove two characters because of the "> "
               for (const subsub of cast_to_lines(sub, line_length - 2)) {
                  lines.push(`> ${subsub}` as line);
               }
            }
            return lines;
         }
      }
   }
   // passages <: passage
   export type passages = passage[];
   export namespace passages {
      export const name = "FoundatsionError.passages";
      export function is(u: unknown): u is passage {
         return Array.isArray(u) && u.every(passage.is);
      }
      export function assert<u>(this: typeof passages, u: u): asserts u is u & passages {
         if (!Array.isArray(u)) {
            throw new FoundatsionError(
               `Could not assert for ${this.name} but failed since`,
               "Array.isArray returned false.",
            );
         }
         passage.assert(u);
         u satisfies passages;
      }
      // incomplete rtti because I don't care
      export function cast_to_string(passages: passage[]): string {
         if (passages.length === 0) {
            return "";
         } else {
            const lines = passage.cast_to_lines(passages, 80);
            return `\n${lines.join("\n")}`;
         }
      }
   }

   export type input_arg =
      // trusted input & automatic flush:
      // if you pass an array as an argument, FoundatsionError trusts that you've
      // asserted it's validity.
      | passages
      // trusted input & automatic flush:
      // #lines used for input as passages
      | FoundatsionError
      // automatic flush:
      // Interpreted in much the same way as FoundatsionError where
      // Error#message split into newlines is used instead of #lines
      | Error
      // split by newlines and interpreted as multiple input arguments
      | string;
}
