import {FoundatsionError} from "./err";

export namespace never {
   export const name = "never";

   export function is(_: unknown): _ is never {
      return false;
   }

   export function assert(_: unknown): _ is never {
      throw new FoundatsionError(
         `Tried asserting for never but that's absurd!`,
      );
   }
}
