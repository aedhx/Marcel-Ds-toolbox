import * as esbuild from "esbuild";
import { copyFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const isWatch = process.argv.includes("--watch");

const distDir = resolve(__dirname, "dist");
mkdirSync(distDir, { recursive: true });

// Copy ui.html to dist/
copyFileSync(
  resolve(__dirname, "src/ui.html"),
  resolve(distDir, "ui.html")
);

const buildOptions = {
  entryPoints: [resolve(__dirname, "src/main.ts")],
  bundle: true,
  outfile: resolve(distDir, "main.js"),
  format: "iife",
  target: "es2017",
  logLevel: "info",
};

if (isWatch) {
  const ctx = await esbuild.context(buildOptions);
  await ctx.watch();
  console.log("Watching for changes...");
} else {
  await esbuild.build(buildOptions);
  console.log("Build complete. ui.html copied to dist/.");
}
