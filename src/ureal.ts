import {real} from "./real";
import {inter} from "./inter";
import {unsigned} from "./unsigned";

export type ureal = unsigned & real;
export const ureal = inter(unsigned, real);
