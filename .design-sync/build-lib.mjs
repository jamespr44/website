// Builds .ds-lib/: a package-shaped copy of the design-system surface (.design-sync/entry.ts) for the design-sync
// converter - an ESM entry, .d.ts types and the compiled Tailwind stylesheet. Run from the repo root:
//   node .design-sync/build-lib.mjs
// Needs the converter deps staged in .ds-sync/node_modules (esbuild, @tailwindcss/cli).
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { createRequire } from "node:module";

const root = process.cwd();
const out = resolve(".ds-lib");
const require = createRequire(join(root, ".ds-sync", "package.json"));
const esbuild = require("esbuild");

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

// 1. JS entry. React stays external (the converter vendors it); everything else is bundled in.
await esbuild.build({
  entryPoints: [".design-sync/entry.ts"],
  outfile: join(out, "index.js"),
  bundle: true,
  format: "esm",
  jsx: "automatic",
  target: "es2020",
  tsconfig: "tsconfig.json",
  external: ["react", "react-dom", "react/jsx-runtime", "react-dom/client"],
  logLevel: "warning",
});

// 2. Declarations. tsc keeps the "@/..." aliases verbatim, so rewrite them to relative paths afterwards.
writeFileSync(
  join(out, "tsconfig.json"),
  JSON.stringify({
    extends: "../tsconfig.json",
    compilerOptions: {
      noEmit: false,
      declaration: true,
      emitDeclarationOnly: true,
      incremental: false,
      rootDir: "..",
      outDir: "./types",
      plugins: [],
    },
    include: ["../.design-sync/entry.ts"],
  }),
);
execFileSync(join(root, "node_modules/.bin/tsc"), ["-p", join(out, "tsconfig.json")], { stdio: "inherit" });
const typesSrc = join(out, "types", "src");
const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
for (const f of walk(join(out, "types"))) {
  const text = readFileSync(f, "utf8").replace(/(["'])@\/([^"']+)\1/g, (_, q, p) => {
    let rel = relative(dirname(f), join(typesSrc, p));
    if (!rel.startsWith(".")) rel = "./" + rel;
    return q + rel + q;
  });
  writeFileSync(f, text);
}
writeFileSync(join(out, "index.d.ts"), 'export * from "./types/.design-sync/entry";\n');

// 3. Stylesheet: the site's globals.css compiled by Tailwind, plus a safelist of layout utilities so designs built
//    with the system have a predictable vocabulary beyond the classes the site happens to use.
writeFileSync(
  join(out, "input.css"),
  `@import "../src/app/globals.css";
@source "../src";
@source "../.design-sync/previews";
@source "../.design-sync/conventions.md";
@source inline("{sm:,md:,lg:,}{p,px,py,pt,pb,pl,pr,m,mx,my,mt,mb,gap,gap-x,gap-y,space-y}-{0,1,2,3,4,5,6,7,8,10,12,14,16,20,24,32,40}");
@source inline("{sm:,md:,lg:,}{grid-cols-{1,2,3,4,5,6,12},flex,grid,block,inline-flex,hidden,flex-col,flex-row,flex-wrap,items-{start,center,end,baseline},justify-{start,center,end,between},col-span-{1,2,3,4,6,12}}");
@source inline("{hover:,}{bg,text,border,border-t,border-b,outline}-{bg,raised,ink,inkstone,muted,faint,line,rule,track,sage,amber,oxblood}");
@source inline("{sm:,md:,}text-{xs,sm,base,lg,xl,2xl,3xl,4xl,5xl} font-{light,normal,medium} tracking-{tight,tighter,normal} leading-{none,tight,snug,normal,relaxed}");
@source inline("max-w-{sm,md,lg,xl,2xl,3xl,4xl,5xl,6xl,prose,none} w-full h-full min-h-screen mx-auto border border-t border-b rounded-none tabular-nums");
`,
);
execFileSync(
  join(root, ".ds-sync/node_modules/.bin/tailwindcss"),
  ["-i", join(out, "input.css"), "-o", join(out, "styles.css")],
  { stdio: "inherit" },
);

writeFileSync(
  join(out, "package.json"),
  JSON.stringify(
    {
      name: "warm-water-cooling",
      version: "0.1.0",
      private: true,
      type: "module",
      module: "./index.js",
      types: "./index.d.ts",
      peerDependencies: { react: "^19", "react-dom": "^19" },
    },
    null,
    2,
  ) + "\n",
);
console.log("built .ds-lib/");
