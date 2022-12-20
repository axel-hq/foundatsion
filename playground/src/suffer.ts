import {F} from "@axel-hq/foundatsion";

type bad = number & F.newtype<"bad">;
namespace bad {
   export const name = "bad";
   export const is = F.rtti.is_from_assert(assert);
   export declare function assert(u: unknown): asserts u is bad;
   export declare function cast_to_number(b: bad): number;
}
F.rtti.verify(F.T<bad>, bad);
