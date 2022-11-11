import {int} from "./int";
import {real} from "./real";
import {inter} from "./inter";
import {unsigned} from "./unsigned";

export type ureal = unsigned & int;
export const ureal = inter(unsigned, real);
