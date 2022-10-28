import {unsound} from "./unsound";
import {identity} from "./type_traits";

// Newtypes are for internal use only.
// They will not be exposed to the user since the sdk itself should typecheck
// the inputs.

// What are newtypes?
// Useful reading:
// - https://wiki.haskell.org/Newtype
// - https://lexi-lambda.github.io/blog/2019/11/05/parse-don-t-validate/

// Newtypes are a zero runtime cost abstraction over types.
// Let's take gas_priority, for example.

// What is the type of a number that can only be between 0 and 2?
// Is it a number? Clearly not. 3 is a number but it's outside of 0 and 2.
// What we want is a way to separate out `gas_priority` numbers all the rest.

//declare const special: number_between_0_and_2;
//special + 1 :: number
//special + 0 :: number

// number_between_0_and_2 are still numbers; they should be usable in the exact
// same way that ordinary number types are used. But they're also special: A
// function who takes a number_between_0_and_2 should not accept plain numbers.

//function print_0_and_2(n: number_between_0_and_2);
//print_0_and_2(special) // good!
//print_0_and_2(3) // bad!
//print_0_and_2(1) // also still bad

// We want a private constructor of number_between_0_and_2 which performs
// runtime typechecking once and then returns a special value that as long as
// you don't modify it (adding, subtracting, ...etc) we know that it is a member
// of number_between_0_and_2.

// For this, we have newtypes. The exact mechanics behind them aren't important
// to explain, but the idea of why we use them is.

/**
 * Compiletime newtype property holder.
 * Exported because the typescript compiler needs to be able to refer to this
 * fake symbol inter-module.
 *
 * Search for errors like "cannot be named" to understand why this needs to
 * happen.
 */
export declare const nt_s: unique symbol;

export type newtype<uniq extends string | symbol> = {[nt_s]: {[k in uniq]: void}};
export type unwrap<outer> =
   outer extends {[nt_s]: {}}
      ? outer extends infer inner & {[nt_s]: {[k in keyof outer[typeof nt_s]]: void}}
         ? inner
         : never
      : outer;

export const unwrap: {<outer>(outer: outer): unwrap<outer>} = unsound.shut_up(identity);
