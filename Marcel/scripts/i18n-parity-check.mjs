#!/usr/bin/env node
/**
 * i18n parity check — Marcel Toolbox (UXH-05 / 05.3-06)
 *
 * Guards the three UI locales in `src/ui.html` against drift:
 *
 *   1. BIDIRECTIONAL key parity — EN↔FR and EN↔PT-BR, both directions. A key that
 *      exists in EN but not in FR is a French fallback-to-English bug; a key that
 *      exists in FR but not in EN is a *reverse* gap (the EN locale then renders a
 *      French string via the `t()` fallback chain — this is exactly how
 *      `settings.language` shipped broken before 05.3-06).
 *   2. Placeholder parity — every `{token}` present in an EN value must appear, with
 *      the same multiplicity, in the matching FR / PT-BR value (and vice versa).
 *      Canonical tokens today are {count} {score} {threshold} {label} {ms} {n} {name},
 *      but the check is generic over any `{token}`.
 *
 * Exits 0 only when every locale key-set is equal AND every placeholder matches.
 * Exits 1 (and prints the offending keys) on ANY diff.
 *
 * Standalone Node ESM, zero npm dependencies — reads the file with `node:fs` and
 * evaluates ONLY the `var TRANSLATIONS = {...};` object literal in a locked-down
 * `node:vm` context (no globals, no require, no network, never writes to source).
 *
 * Usage:  cd Marcel && npm run i18n:check
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { createContext, runInContext } from "node:vm";

const HERE = dirname(fileURLToPath(import.meta.url));
const UI_PATH = resolve(HERE, "..", "src", "ui.html");

const BASE_LOCALE = "en";
const LOCALES = ["en", "fr", "pt-BR"];

const OPEN = "var TRANSLATIONS = {";
const CLOSE = "\n      };";

/** Pull `var TRANSLATIONS = {...};` out of ui.html and evaluate it in a bare vm context. */
function loadTranslations(path) {
  const source = readFileSync(path, "utf8");
  const start = source.indexOf(OPEN);
  if (start === -1) throw new Error(`Could not find "${OPEN}" in ${path}`);
  const end = source.indexOf(CLOSE, start);
  if (end === -1) throw new Error(`Could not find the closing "${CLOSE.trim()}" of TRANSLATIONS in ${path}`);

  const literal = source.slice(start, end + CLOSE.length);
  const sandbox = Object.create(null);
  createContext(sandbox);
  runInContext(literal + "\n", sandbox, { filename: "ui.html#TRANSLATIONS", timeout: 5000 });

  const translations = sandbox.TRANSLATIONS;
  if (!translations || typeof translations !== "object") {
    throw new Error("TRANSLATIONS did not evaluate to an object");
  }
  for (const locale of LOCALES) {
    if (!translations[locale] || typeof translations[locale] !== "object") {
      throw new Error(`Locale "${locale}" is missing from TRANSLATIONS`);
    }
  }
  return translations;
}

/** All `{token}` occurrences of a value, sorted — multiplicity preserved. */
function placeholders(value) {
  return (String(value).match(/\{[^{}\s]+\}/g) || []).slice().sort();
}

function sameTokens(a, b) {
  return a.length === b.length && a.every((tok, i) => tok === b[i]);
}

function main() {
  const T = loadTranslations(UI_PATH);
  const problems = [];

  const baseKeys = Object.keys(T[BASE_LOCALE]);
  const baseSet = new Set(baseKeys);

  for (const locale of LOCALES) {
    if (locale === BASE_LOCALE) continue;

    const localeKeys = Object.keys(T[locale]);
    const localeSet = new Set(localeKeys);

    // Direction 1: EN → locale (missing translation, renders English under `locale`).
    const missing = baseKeys.filter((k) => !localeSet.has(k));
    // Direction 2: locale → EN (reverse gap, renders `locale` under English).
    const extra = localeKeys.filter((k) => !baseSet.has(k));

    if (missing.length) {
      problems.push(
        `[${locale}] ${missing.length} key(s) present in ${BASE_LOCALE} but MISSING here ` +
          `(they fall back to English at runtime):\n` +
          missing.map((k) => `    - ${k}`).join("\n")
      );
    }
    if (extra.length) {
      problems.push(
        `[${locale}] ${extra.length} key(s) present here but MISSING from ${BASE_LOCALE} ` +
          `(reverse gap — the ${BASE_LOCALE} locale falls back to a non-English string):\n` +
          extra.map((k) => `    - ${k}`).join("\n")
      );
    }

    // Placeholder parity over the shared key set.
    const mismatches = [];
    for (const key of baseKeys) {
      if (!localeSet.has(key)) continue;
      const want = placeholders(T[BASE_LOCALE][key]);
      const got = placeholders(T[locale][key]);
      if (!sameTokens(want, got)) {
        mismatches.push(
          `    - ${key}\n` +
            `        ${BASE_LOCALE}: ${want.length ? want.join(" ") : "(none)"}\n` +
            `        ${locale}: ${got.length ? got.join(" ") : "(none)"}`
        );
      }
    }
    if (mismatches.length) {
      problems.push(`[${locale}] ${mismatches.length} placeholder mismatch(es):\n` + mismatches.join("\n"));
    }
  }

  const counts = LOCALES.map((l) => `${l}=${Object.keys(T[l]).length}`).join("  ");

  if (problems.length) {
    console.error("i18n parity check FAILED\n");
    for (const p of problems) console.error(p + "\n");
    console.error(`key counts: ${counts}`);
    process.exit(1);
  }

  console.log(`i18n parity OK — ${LOCALES.length} locales key-equal, placeholders matched (${counts})`);
  process.exit(0);
}

main();
