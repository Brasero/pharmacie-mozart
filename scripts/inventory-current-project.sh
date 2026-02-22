#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT_DIR="$ROOT_DIR/reports/migration"
mkdir -p "$OUT_DIR"

printf "[info] writing inventory to %s\n" "$OUT_DIR"

# package-level dependencies relevant to migration
node -e '
const fs=require("fs");
const p=JSON.parse(fs.readFileSync("package.json","utf8"));
const deps={...p.dependencies,...p.devDependencies};
const keys=Object.keys(deps).sort();
for (const k of keys){
  if(k.includes("capacitor")||k.includes("cordova")||k.includes("ionic")||k.includes("angular")){
    console.log(`${k}=${deps[k]}`);
  }
}
' > "$OUT_DIR/plugins.txt"

{
  echo "# android/build.gradle";
  sed -n '1,220p' "$ROOT_DIR/android/build.gradle";
  echo;
  echo "# android/app/build.gradle";
  sed -n '1,260p' "$ROOT_DIR/android/app/build.gradle";
  echo;
  echo "# android/variables.gradle";
  sed -n '1,200p' "$ROOT_DIR/android/variables.gradle";
} > "$OUT_DIR/android-config.txt"

find "$ROOT_DIR/ios" -maxdepth 4 -type f | sed "s#^$ROOT_DIR/##" | sort > "$OUT_DIR/ios-tree.txt"
find "$ROOT_DIR/src" -maxdepth 5 -type f | sed "s#^$ROOT_DIR/##" | sort > "$OUT_DIR/src-tree.txt"

printf "[done] inventory generated\n"
