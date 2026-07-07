// Local ambient declaration for the `culori` package.
//
// culori ships ESM source without bundled type declarations and has no
// `@types/culori` on npm, so `import { nearest, differenceCiede2000, parse }
// from 'culori'` triggered TS7016 (implicit-any module). We declare it locally
// instead of adding a dependency — no `npm install`, no supply-chain surface
// (threat T-07-SC). The named exports we consume (hc-colors.ts) resolve to
// `any`, which is acceptable for this single ΔE-nearest-token call site.
declare module 'culori';
