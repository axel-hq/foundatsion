import {iT} from "./type_traits";
import {rtti} from "./rtti";
import {text} from "./text";
import {FoundatsionError} from "./error";

export namespace symbol {
   export const name = "symbol";
   export function is(u: unknown): u is symbol {
      return typeof u === "symbol";
   }
   export function assert<u>(this: typeof symbol, u: u): asserts u is u & symbol {
      if (typeof u !== "symbol") {
         throw new FoundatsionError(
            `Tried asserting for ${this.name} but failed.\n`,
            `typeof value was "${typeof u}" when it should've been "symbol".`,
            `Instead, value was ${text.show(u)}`,
         );
      }
   }
   export const cast_from_string = Symbol.for.bind(Symbol);
}

rtti.verify(iT<symbol>, symbol);
