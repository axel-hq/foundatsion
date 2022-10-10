import {debug, AxelTypeError} from "../err";
import * as unsound from "./unsound";

export type obj = {};
export declare const type: obj;

export type key = keyof any;
export const typename = "non-null object";

export function is(u: unknown): u is {} {
	return typeof u === "object" && u !== null;
}

export function assert(u: unknown): asserts u is {} {
	if (typeof u !== "object") {
		throw new AxelTypeError(
			"Asserting that value was non-null object failed!",
			`typeof value was ${debug.show(typeof u)} when it should've been "object"`
		);
	}
	if (u === null) {
		throw new AxelTypeError(
			"Asserting that value was non-null object failed because the value was null!",
		);
	}
}

export function has
	<o extends {}, k extends key>
		(o: o, k: k):
			o is o & {[_ in k]: unknown}
{
	return Object.hasOwnProperty.call(o, k);
}

export function freeze<T>(obj: T): asserts obj is Readonly<T> {
	Object.freeze(obj);
}

export function keys<o extends {}>(o: o): readonly (keyof o)[] {
	const ks = Object.keys(o);
	freeze(ks);
	return unsound.shut_up(ks);
}

// NOTE(Marcus): This should probably be connected to reflect
export type assert_obj<T> = {
	assert: (u: unknown) => asserts u is T;
	typename: string;
};

export function assert_has
<k extends key, o extends {}>(o: o, k: k):
	asserts o is o & {[_ in k]: unknown}
{
	if (has(o, k)) {}
	else {
		throw new AxelTypeError(`Object did not have key ${debug.show(k)}!`);
	}
}

// NOTE(Marcus): This should probably be connected to reflect
export type is_obj<T> = {
	is: (u: unknown) => u is T;
	typename: string;
};

export function has_t
	<T, k extends key, o extends {}>
		(o: o, k: k, is: is_obj<T>):
			o is o & {[_ in k]: T}
{
	return true
	&& has(o, k)
	&& is.is(o[k])
	;
}

/** Assert that an object has a property of type T. */
export function assert_has_t
	<T, k extends key, o extends {}>
		(o: o, k: k, assert: assert_obj<T>):
			asserts o is o & {[_ in k]: T}
{
	assert_has(o, k);
	try {
		assert.assert(o[k]);
	} catch (e) {
		if (e instanceof AxelTypeError) {
			throw new AxelTypeError(
				`While asserting that object[${debug.show(k)}] is of type ${assert.typename}`,
				"an error was thrown:",
				e,
			);
		} else {
			throw e;
		}
	}
}


// NOTE(Marcus): I don't know how to implement the general case for
// the function signature here.
/** Assert that an object has a property of union type T. */
export function assert_has_ts
	<T1, T2, k extends key, o extends {}>
		(o: o, k: k, asserts: [assert_obj<T1>, assert_obj<T2>]):
			asserts o is o & {[_ in k]: T1 | T2}
{
	assert_has(o, k);
	const es = [];
	for (const assert of asserts) {
		try {
			assert.assert(o[k]);
			// Only one assert function needs to work for the union type to be satisfied
			return;
		} catch (e) {
			if (e instanceof AxelTypeError) {
				es.push(e);
				continue;
			} else {
				throw e;
			}
		}
	}
	throw new AxelTypeError(
		`While asserting that object[${debug.show(k)}] has value of type ${asserts.map(v => v.typename).join(" | ")}`,
		"these errors were thrown:",
		...es
	);
}

export function has_v
	<v, k extends key, o extends {[_ in k]: unknown}>
		(o: o, k: k, v: v):
			o is o & {[_ in k]: v}
{
	return o[k] === v;
}

export function assert_has_v
	<v, k extends key, o extends {}>
		(o: o, k: k, v: v):
			asserts o is o & {[_ in k]: v}
{
	assert_has(o, k);
	
	if (has_v(o, k, v)) {}
	else {
		throw new AxelTypeError(`object[${debug.show(k)}] is not equal to v`);
	}
}

export function assert_optional
	<k extends key, o extends {}>
		(o: o, k: k):
			asserts o is o & {[_ in k]: unknown | undefined}
{
	void o, k;
}

export function optional_t
	<T, k extends key, o extends {}>
		(o: o, k: k, is: is_obj<T>):
			o is o & {[_ in k]: T | undefined}
{
	if (has(o, k)) {
		if (is.is(o[k])) {
			return true;
		} else {
			return false;
		}
	} else {
		return true;
	}
}

export function assert_optional_t
	<T, k extends key, o extends {}>
		(o: o, k: k, assert: assert_obj<T>):
			asserts o is o & {[_ in k]: T | undefined}
{
	if (has(o, k)) {
		try {
			assert.assert(o[k]);
		} catch (e) {
			if (e instanceof AxelTypeError) {
				throw new AxelTypeError(
					`While asserting that object[${debug.show(k)}] has optional value of type ${assert.typename}`,
					"an error was thrown:",
					e,
				);
			}
		}
	}
}

// NOTE(Marcus): I don't know how to implement the general case for
// the function signature here.
export function assert_optional_ts
	<T1, T2, k extends key, o extends {}>
		(o: o, k: k, asserts: [assert_obj<T1>, assert_obj<T2>]):
			asserts o is o & {[_ in k]: T1 | T2 | undefined}
{
	const es = [];
	if (has(o, k)) {
		for (const assert of asserts) {
			try {
				assert.assert(o[k]);
				// Only one assert function needs to work for the union type to be satisfied
				return;
			} catch (e) {
				if (e instanceof AxelTypeError) {
					es.push(e);
					continue;
				} else {
					throw e;
				}
			}
		}
		throw new AxelTypeError(
			`While asserting that object[${debug.show(k)}] has optional value of type ${asserts.map(v => v.typename).join(" | ")}`,
			"these errors were thrown:",
			...es
		);
	}
}

export function from_entries<k extends key, v>(entries: [k, v][]): {[_ in k]: v} {
	return unsound.shut_up(Object.fromEntries(entries));
}
