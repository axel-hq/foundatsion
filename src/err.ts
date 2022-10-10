export class TSFoundationError extends Error {
   lines: string[];
   /**
    * Use `"\n"` to indicate a separate line.
    */
   constructor (...msg: unknown[]) {
      const forced_lines: string[] = [];
      for (const e of msg) {
         if (e instanceof TSFoundationError) {
            forced_lines.push(...e.lines);
            continue;
         }
         this.lines[this.lines.length - 1] += ` ${line}`;
      }
      super(lines.join("\n"));
   }
}

new TSFoundationError(
   "this is on the first line",
   "this is still on the first line",
   "\n",
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
