import {inter} from "./inter";
import {bigint} from "./bigint";
import {unsigned} from "./unsigned";

export type ubigint = unsigned & bigint;
export const ubigint = inter(unsigned, bigint);
