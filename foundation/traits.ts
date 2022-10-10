// useful with satisfiable
export type $extends<parent, child> = child extends parent ? true : false;

/* BEGIN UNSATISFIABLE ********************************************************/
// With advanced types, we can perform crazy amounts of computation on the type
// system, after all, typescript's types are a typed lambda calculus.
// With our types, we can perform our own typechecking. But wait. How do we
// halt compilation to let the programmer know that something is wrong?
// For that, we need to generate some sort of compile time error.
// This is where unsatisfiable comes in.
// Casting null to satisfies<true> works just fine but not satisfies<false>.
// null as unsatisfiable generates a compile time error.

// I use this extensively in protocols.ts
// See action_class_matches and the void(null as action_class_matches...)

declare const unsatisfiable: unique symbol;
type unsatisfiable = typeof unsatisfiable;

export type satisfies<cond extends boolean>
	= cond extends true ? never : unsatisfiable;
/* END UNSATISFIABLE **********************************************************/
