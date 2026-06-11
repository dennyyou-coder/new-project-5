#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
MANIFEST="${1:-$ROOT_DIR/assets/source-library/download-manifest.tsv}"
DEST_ROOT="$ROOT_DIR/assets/source-library/brands"

if [[ ! -f "$MANIFEST" ]]; then
  echo "Manifest not found: $MANIFEST" >&2
  exit 1
fi

mkdir -p "$DEST_ROOT"

line_no=0
downloaded=0
skipped=0
failed=0

while IFS=$'\t' read -r brand type filename url source_note; do
  line_no=$((line_no + 1))

  if [[ "$line_no" -eq 1 ]]; then
    continue
  fi

  if [[ -z "${brand:-}" || -z "${type:-}" || -z "${filename:-}" || -z "${url:-}" ]]; then
    echo "Skip line $line_no: missing required field"
    skipped=$((skipped + 1))
    continue
  fi

  dest_dir="$DEST_ROOT/$brand/$type"
  dest_file="$dest_dir/$filename"
  mkdir -p "$dest_dir"

  if [[ -f "$dest_file" ]]; then
    echo "Already exists: $dest_file"
    skipped=$((skipped + 1))
    continue
  fi

  echo "Downloading: $brand / $type / $filename"
  if curl -L --fail --retry 2 --connect-timeout 20 --max-time 120 "$url" -o "$dest_file"; then
    downloaded=$((downloaded + 1))
  else
    echo "Failed: $url" >&2
    rm -f "$dest_file"
    failed=$((failed + 1))
  fi
done < "$MANIFEST"

echo
echo "Download summary"
echo "Downloaded: $downloaded"
echo "Skipped:    $skipped"
echo "Failed:     $failed"
