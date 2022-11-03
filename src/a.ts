import {F} from "./index";
import {rtti} from "./rtti";

const res = {
   a: F.number,
   b: F.union(F.number, F.string),
   c: {
      d: F.tuple(F.number),
   },
};

type r = typeof res;

type ZZ = [] extends readonly [] ? true : false;


type valid_input = rtti | {[k in string]: valid_input};

type Z = (typeof F.number)[] extends valid_input ? true : false;
type to_array<t> = t extends [...unknown[]] ? t : [];



type z = q<r>;
