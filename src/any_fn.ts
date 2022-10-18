export type any_fn = (...args: any[]) => any;
export namespace any_fn {
   export const name = "any function";
   export function is(u: unknown): u is any_fn {
      return typeof u == "function";
   }
}
