import {id, tt} from "./type_traits";
import {unsound} from "./unsound";

// Newtypes are for package internals only.
// Do not export newtypes over API boundaries!
// They will not be exposed to the user since the sdk itself should typecheck
// the inputs.

// What are newtypes?
// Newtypes are a zero runtime cost abstraction over types.
// Useful reading:
// - https://wiki.haskell.org/Newtype
// - https://lexi-lambda.github.io/blog/2019/11/05/parse-don-t-validate/

/**
 * Compiletime newtype property holder.
 * Exported because the typescript compiler needs to be able to refer to this
 * fake symbol inter-module.
 *
 * Search for errors like "cannot be named" to understand why this needs to
 * happen.
 */
export declare const nt_s: unique symbol;

type newtype_partials_union<uniq_union extends keyof any> =
   {[k in uniq_union]: {[nt_s]: {[_ in k]: void}}}[uniq_union];

export type newtype<uniq extends string | symbol> = {[nt_s]: {[k in uniq]: void}};
export type unwrap<outer> =
   outer extends {[nt_s]: {}}
      ? outer extends infer inner & tt.union_to_intersection<newtype_partials_union<keyof outer[typeof nt_s]>>
         ? inner
         : never
      : outer;

export const unwrap: {<outer>(outer: outer): unwrap<outer>}
   = unsound.shut_up(id);
