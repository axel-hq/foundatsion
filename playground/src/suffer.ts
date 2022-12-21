import {F} from "@axel-hq/foundatsion";

type bad = number & F.newtype<"bad">;
namespace bad {
   export const name = "bad";
   export const is = F.rtti.is_from_assert(assert);
   export function assert(u: unknown): asserts u is bad {
      F.number.assert(u);
      if (Math.sin(u) > 0) { }
      else {
         throw new F.Error("You failed.");
      }
   }
   export function cast_to_number(b: bad): number {
      return Math.sin(b);
   }
}
F.rtti.verify(F.T<bad>, bad);
