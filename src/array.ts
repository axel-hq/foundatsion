import {FoundatsionError} from "./err";
import {object} from "./object";
import {rtti} from "./rtti";

export type array = unknown[];
export namespace array {
   export const name = "array";

   export function is(u: unknown): u is array {
      return Array.isArray(u);
   }

   export function assert(u: unknown): asserts u is array {
      if (!is(u)) {
         throw new FoundatsionError(
            "Tried asserting that value was array but failed!\n",
            `typeof value = "${typeof u}`,
            `value = ${u}`,
         );
      }
   }

   export type typed<t extends rtti> =
      & (t extends rtti.has_name ? rtti.has_name : {})
      & (t extends rtti.has_is<infer i> ? rtti.has_is<i[]> : {})
      & (t extends rtti.has_assert<infer i> ? rtti.has_assert<i[]> : {})

   export function typed<t extends rtti>(t: t): typed<t> {
      let name: {};
      if (object.has_key(t, "name")) {
         name = {name: `${t.name} array`};
      } else {
         name = {};
      }

      let is: {};
      if (object.has_key(t, "is")) {
         is = {
            is(u: unknown): boolean {
               if (!array.is(u)) return false;
               for (const elem of u) {
                  if (t.is(elem)) {}
                  else {
                     return false;
                  }
               }
               return true;
            }
         }
      } else {
         
      }
   }
}

// sufferage
export function typed
<
	C extends reflect.capabilities<any>,
	T = C extends reflect.capabilities<infer inner> ? inner : never,
>
(c: C):
(
	& reflect.view
	& (C extends reflect.validator<T>     ? reflect.validator<T[], unknown>     : {})
	& (C extends reflect.transformer<T>   ? reflect.transformer<T[], unknown>   : {})
	& (C extends reflect.reinterpreter<T> ? reflect.reinterpreter<T[], unknown> : {})
)
{
	const view: reflect.view = {typename: `${c.typename} array`};
	
	let validator: Partial<reflect.validator<T[], unknown>>;
	if (c.is) {
		const element_is: reflect.validator<T>["is"] = c.is;
		validator = {
			is(u: unknown): u is T[] {
				if (is(u)) {}
				else {
					return false;
				}
				for (const elem of u) {
					if (element_is(elem)) {}
					else {
						return false;
					}
				}
				return true;
			},
		};
	} else {
		validator = {};
	}
	
	let reinterpreter: Partial<reflect.reinterpreter<T[], unknown>>;
	if (c.assert) {
		const element_assert: reflect.reinterpreter<T>["assert"] = c.assert;
		reinterpreter = {
			assert(u: unknown): asserts u is T[] {
				assert(u);
				for (const elem of u) {
					element_assert(elem);
				}
			},
		};
	} else {
		reinterpreter = {};
	}
	
	let transformer: Partial<reflect.transformer<T[], unknown[]>>;
	if (c.from) {
		const {from} = c;
		transformer = {
			from(u: unknown): T[] {
				assert(u);
				return u.map(from);
			},
		};
	} else {
		transformer = {};
	}
	return unsound.shut_up({
		...view,
		...validator,
		...reinterpreter,
		...transformer,
	});
}
