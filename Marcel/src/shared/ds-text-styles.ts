// ── Marcel Semantic text styles (published keys) ──
//
// The Plugin API cannot list a team library's text styles, so a project file that does
// not already USE a given Marcel text style has no way to discover it. Published style
// keys are stable, so the fixers import the matching style with
// figma.importStyleByKeyAsync(key) — the same mechanism dead-styles-fix already uses.
//
// Source: Marcel Semantic (file "QJfqeYmqC6QJRGzud27CqV"), snapshot 2026-04-09.
// If a style is recreated in the library its key changes: the import then fails, the
// fixer falls back to local/harvested styles, and this table must be refreshed.

export const DS_SEMANTIC_FILE_KEY = "QJfqeYmqC6QJRGzud27CqV";

export interface DsTextStyleKey {
  name: string;
  key: string;
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
}

export const DS_TEXT_STYLE_KEYS: DsTextStyleKey[] = [
  { name: "Body/XS/Bold", key: "10f90ca2df496402708a0253b31c5d2102a09b2b", fontSize: 12, fontWeight: 700, lineHeight: 16 },
  { name: "Body/XS/Regular", key: "acf73260fd011030c3deb4cc7799911d77e5d36c", fontSize: 12, fontWeight: 400, lineHeight: 16 },
  { name: "Body/XS/Strikethrough", key: "3fa560acedbdb30ecd907d9c1335b17c7bd6a13a", fontSize: 12, fontWeight: 400, lineHeight: 16 },
  { name: "Body/XS/Underline", key: "355019debef91f8b1759a9739543912804c86dd4", fontSize: 12, fontWeight: 400, lineHeight: 16 },
  { name: "Body/S/Bold", key: "8c691bf9de7555e9201b545b2e8ff1138af30e53", fontSize: 14, fontWeight: 700, lineHeight: 20 },
  { name: "Body/S/Regular", key: "82e63e0141673f1a954a4b4d892e8e3d5df58828", fontSize: 14, fontWeight: 400, lineHeight: 20 },
  { name: "Body/S/Strikethrough", key: "d5ab79c95d2e152f401269c6e3fe7b1ba7a0c3e1", fontSize: 14, fontWeight: 400, lineHeight: 20 },
  { name: "Body/S/Underline", key: "d832f19ab47be14029801a738bab46c5a7efd8b4", fontSize: 14, fontWeight: 400, lineHeight: 20 },
  { name: "Body/M/Bold", key: "a752738aeb7859f4894403d0bd9da634ce2be569", fontSize: 16, fontWeight: 700, lineHeight: 24 },
  { name: "Body/M/Regular", key: "ed1cc82e6201c5ae84f769967a88fa3c7fa241c9", fontSize: 16, fontWeight: 400, lineHeight: 24 },
  { name: "Body/M/Strikethrough", key: "e6c7b296747bae78ffd0caf36c752eaf0b51a7c8", fontSize: 16, fontWeight: 400, lineHeight: 24 },
  { name: "Body/M/Underline", key: "47105cb82a598ed0d1dac72be35b465075fce343", fontSize: 16, fontWeight: 400, lineHeight: 24 },
  { name: "Title/2XS", key: "d2f94295272999f01d4c0e332238b57ac0996095", fontSize: 20, fontWeight: 700, lineHeight: 24 },
  { name: "Title/2XS - Regular", key: "a7f1e0249cfb0b316ed945b4fb93479768862d0f", fontSize: 20, fontWeight: 400, lineHeight: 24 },
  { name: "Title/XS", key: "f15ac71a3df9354fc75769c2bd407dfc46e41562", fontSize: 24, fontWeight: 700, lineHeight: 32 },
  { name: "Title/XS - Regular", key: "1d52ac0bffd922cac8675ea84b88f9aee7782e45", fontSize: 24, fontWeight: 400, lineHeight: 32 },
  { name: "Title/S", key: "c65a93bfea1ac4b26112ba6cd0c2d685bc3ddb0e", fontSize: 28, fontWeight: 700, lineHeight: 36 },
  { name: "Title/S - Regular", key: "ae947e40f7f83fcdff4157cb6399f1b5b6d94a53", fontSize: 28, fontWeight: 700, lineHeight: 36 },
  { name: "Title/M", key: "9d774c983014db432f3a967e9d7f950fc70cc487", fontSize: 32, fontWeight: 700, lineHeight: 40 },
  { name: "Title/L", key: "2424750a6d664af58a5547b3077892999fb4e889", fontSize: 40, fontWeight: 700, lineHeight: 48 },
  { name: "Title/XL", key: "89baebc0846a6b2a610c6c01c3024218dd63a815", fontSize: 48, fontWeight: 700, lineHeight: 52 },
  { name: "Title/2XL", key: "d46942cb990a9924d843fa8480c9cc76f52a92eb", fontSize: 56, fontWeight: 400, lineHeight: 64 },
];
