import {T} from "./type_traits";
import {rtti} from "./rtti";
import {FoundatsionError} from "./error";

export namespace never {
   export const name = "never";
   export function is(_: unknown): _ is never {
      return false;
   }
   export function assert(this: typeof never, _: unknown): asserts _ is never {
      throw new FoundatsionError(
         `Tried asserting for ${this.name} but that's absurd!`,
      );
   }
}

rtti.verify(T<never>, never);
