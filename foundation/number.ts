import {debug, AxelTypeError} from "../err";

export const typename = "number";

export function is(u: unknown): u is number {
	return typeof u === "number";
}

export function assert(u: unknown): asserts u is number {
	if (typeof u !== "number") {
		throw new AxelTypeError(
			"Tried asserting that value was number but failed!",
			`typeof value was ${debug.show(typeof u)} but should've been "number"!`,
		);
	}
}

export function from(u: number | string): number {
	if (typeof u === "number") {
		return u;
	} else if (typeof u === "string") {
		const res = Number(u);
		if (isNaN(res)) {}
		else {
			return res;
		}
	}
	throw new AxelTypeError(
		"Tried converting value to number but failed!",
		`value was ${debug.show(u)}`
	);
}
