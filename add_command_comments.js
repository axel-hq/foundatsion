const fs = require("fs");

const nt = "bin/dts/newtype.d.ts";
const lines = fs.readFileSync(nt, "utf8").split("\n");
const newlines = [];
for (const line of lines) {
   if (line.startsWith("export type newtype")) {
      newlines.push("//! foundatsion::newtype");
   } else
   if (line.startsWith("export type unwrap")) {
      newlines.push("//! foundatsion::unwrap");
   }
   else
   if (line.startsWith("export type api_in")) {
      newlines.push("//! foundatsion::unwrap");
   }
   newlines.push(line);
}

fs.writeFileSync(nt, newlines.join("\n"));
