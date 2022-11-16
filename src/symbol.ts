import {FoundatsionError} from "./error";

export namespace symbol {
   export const name = "symbol";
   export function is(u: unknown): u is symbol {
      return typeof u === "symbol";
   }
   export function assert(this: typeof symbol, u: unknown): asserts u is symbol {
      if (typeof u !== "symbol") {
         throw new FoundatsionError(
            `Tried asserting for ${this.name} but failed.\n`,
            `typeof value was "${typeof u}" when it should've been "symbol".`,
         );
      }
   }
   export const from = {
      string(s: string): symbol {
         return Symbol.for(s);
      },
   };
}
