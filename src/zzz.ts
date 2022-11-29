import { int } from "./int";
import { unwrap } from "./newtype";
import { real } from "./real";
import { uint } from "./uint";
import { unsigned } from "./unsigned";
import { ureal } from "./ureal";

type x = unwrap<ureal>;

type preserve<n, p, t extends p> = t extends p & n ? p & n : p;

type y = preserve<unsigned, number, real>;
