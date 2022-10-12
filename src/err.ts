const x = typeof window;
type all = typeof x;

type einp = string | TSFoundationError | Error;

type lent = string | lent[];

export class TSFoundationError extends Error {
   lines: lent[];
   /**
    * Use `"\n"` to indicate a separate line.
    */
   constructor (...msg: einp[]) {
      const thisdotlines: lent[] = [];
      let linebuffer: string | null = null;
      for (let e of msg) {
         if (typeof e === "string") {
            for (
               // iterate through lines
               let idx: number;
               (idx = e.indexOf("\n")) >= 0;
               e = e.slice(idx + 1))
            {
               const line = e.slice(0, idx);
               if (linebuffer === null) {}
               else {
                  thisdotlines.push(linebuffer);
               }
               linebuffer = line;
            }
            // from here on out, e doesn't contain any newline
            // there might not be anything left in e if it ended with a newline
            if (e.length > 0) {
               if (linebuffer === null) {
                  linebuffer = e;
               } else {
                  linebuffer += ` ${e}`;
               }
            }
            continue;
         }
         if (e instanceof TSFoundationError) {
            if (linebuffer === null) {}
            else {
               thisdotlines.push(linebuffer);
            }
            thisdotlines.push(e.lines);
            continue;
         }
         if (e instanceof Error) {
            if (linebuffer === null) {}
            else {
               thisdotlines.push(linebuffer);
            }
            const sublines = [e.name];
            let msg = e.message;
            for (
               // iterate through lines in e.message
               let idx: number;
               (idx = msg.indexOf("\n")) >= 0;
               msg = msg.slice(idx + 1))
            {
               sublines.push(msg.slice(0, idx));
            }
            // now msg has no more newlines in it
            // but it might also have nothing in it
            if (msg.length > 0) {
               sublines.push(msg);
            }
            thisdotlines.push(sublines);
         }
      }
      super(lines.join("\n"));
   }
}

new TSFoundationError(
   "this is on the first line",
   "this is still on the first line\n",
   "this is on the second line",
   "this i"
)

function wrap60(s: string): string[] {
	const lines = [];
	while (s.length > 60) {
		lines.push(`${s.slice(0, 59)}-`);
		s = s.slice(59);
	}
	return lines;
}

export namespace debug {
	export function show(val: any): string {
		if (typeof val === "string") {
			return `"${val}"`;
		}
		return `${val}`;
	}
}

export class AxelError extends Error {
	#lines: string[];
	constructor (...entries: unknown[]) {
		const lines: string[] = [""];
		for (const e of entries) {
			if (e instanceof AxelError) {
				for (const subline of e.#lines) {
					lines.push(`> > ${subline}`);
				}
				continue;
			}
	
			if (e instanceof Error) {
				lines.push(
					`> ${e.name}:`,
					...wrap60(e.message).map(v => `> > ${v}`),
					...(e.stack ?? "").split("\n").map(v => `> > ${v}`),
				);
				continue;
			}
	
			if (true) {
				lines.push(`> ${e}`);
				continue;
			}
		}
		super(lines.join("\n"));
		this.#lines = lines;
	}
}

export class AxelTypeError extends AxelError {
	constructor (...lines: unknown[]) {
		super(...lines);
	}
}
