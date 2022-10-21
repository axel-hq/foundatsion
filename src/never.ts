import {text} from "./text";
import {FoundatsionError} from "./err";

export namespace never {
   export const name = "never";

   export function is(_: unknown): _ is never {
      return false;
   }

   export function assert(_: unknown): _ is never {
      throw new FoundatsionError(
         `Tried to assert that ${text.stringify(_)} was never.\n`,
         "That's Absurd.",
      );
   }
}
