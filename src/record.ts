import {rtti} from "./rtti";
import {unsound} from "./unsound";

type template = rtti | {[k in string]: template};

type record_decant<t extends template> =
   t extends rtti<infer i> ? i :
   t extends {name: string; is: unsound.any_fn; assert: unsound.any_fn} ? never :
   t extends {[k in string]: template} ? {[k in keyof t]: record_decant<t[k]>} : never;

export type record<t extends template> = rtti<record_decant<t>>;

export function record<t extends template>(t: t): record<t> {
   if (rtti.meta.is(t)) {
      
   } else {
      return 
   }
}
