import {identity} from "./identity";

export namespace unsound {
   // When TypeScript is too stupid to figure out that something is definitely true
   export function is_now<t>(val: any): asserts val is t { void val }
   export const cast: {<t>(val: any): t} = identity;
   // Blessing something makes it of that type by definition. Should really only
   // be used with newtypes.
   export const bless = cast;
   // When you need the type system to shut up and let you do what you want with
   // a value. Usually you want to use this one from the "insertion" side of
   // expressions.
   export const shut_up: {(non_cubist: any): never} = identity as never;
   // Same thing as above but for the "receiving" side of expressions. Arguments
   // have the right type but the function refuses em? fuck_off's your Go-To.
   export const fuck_off: {(fookin_knacker: any): any} = identity as never;
}
