import {oo} from "./oo";
import {rtti} from "./rtti";
import {any_fn} from "./any_fn";
import {unsound} from "./unsound";
import {FoundatsionError} from "./error";

type template = rtti | {[k in string]: template};

type auto_decant<t extends template> =
   t extends rtti<infer i> ? i :
   t extends {name: string; is: any_fn; assert: any_fn} ? never :
   t extends {[k in string]: template} ? {[k in keyof t]: auto_decant<t[k]>} : never;

export type auto<t extends template> = rtti<auto_decant<t>>;
export function auto<t extends template>(t: t): auto<t> {
   if (rtti.meta.is(t)) {
      return unsound.shut_up(t);
   }

   return {
      name: "anonymous record",
      is(u_toplevel: unknown): u_toplevel is auto_decant<t> {
         type is_pair = {t: template; u: unknown};
         let pairs: is_pair[] = [{t: t, u: u_toplevel}];

         // depth first type predicate-ing
         while (pairs.length > 0) {
            const current = pairs[0];
            // pop head
            [,...pairs] = pairs;
            // can't be undefined if the length > 0
            unsound.assert_not_undefined(current);
            const current_t = current.t;
            const current_u = current.u;

            if (rtti.meta.is(current_t)) {
               if (!current_t.is(current_u)) {
                  return false; // <----------------------------------- sad path
               }
               continue;
            } else {
               // we're dealing with a record
               if (!oo.is(current_u)) {
                  return false; // <----------------------------------- sad path
               }
               for (const k of oo.keys(current_t)) {
                  const sub_t = unsound.cast_to_not_undefined(current_t[k]);
                  const sub_u = current_u[k];
                  const new_pair = {t: sub_t, u: sub_u};
                  pairs = [new_pair, ...pairs];
               }
               continue;
            }
         }
         return true;
      },
      assert<u_toplevel>(u_toplevel: u_toplevel): asserts u_toplevel is u_toplevel & auto_decant<t> {
         type assert_info = {
            n: string; // name
            u: unknown;
            t: template;
         };
         let infos: assert_info[] = [{
            n: this.name,
            u: u_toplevel,
            t,
         }];

         // depth first asserting
         while (infos.length > 0) {
            const current = infos[0];
            // pop head
            [,...infos] = infos;
            // can't be undefined if the length > 0
            unsound.assert_not_undefined(current);
            const current_n = current.n;
            const current_u = current.u;
            const current_t = current.t;

            try {
               if (rtti.meta.is(current_t)) {
                  const current_rtti: rtti = current_t;
                  current_rtti.assert(current_u);
                  continue; // <------------------------------------- happy path
               }
               else {
                  // we're dealing with a record
                  oo.assert(current_u);
                  for (const k of oo.keys(current_t)) {
                     const sub_n = `${current_n}.${k}`;
                     const sub_u = current_u[k];
                     const sub_t = unsound.cast_to_not_undefined(current_t[k]);
                     const new_info = {
                        n: sub_n,
                        u: sub_u,
                        t: sub_t,
                     };
                     infos = [new_info, ...infos];
                  }
                  continue; // <------------------------------------- happy path
               }
            } catch (e) {
               if (e instanceof Error) {
                  throw new FoundatsionError(
                     `While asserting for ${current_n}, an error was thrown:`,
                     e,
                  );
               } else {
                  throw e;
               }
            }
         }
      },
   };
}
