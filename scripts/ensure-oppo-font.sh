#!/usr/bin/env bash

set -euo pipefail

project_dir="$(cd "$(dirname "$0")/.." && pwd)"
font_dir="$project_dir/public/fonts"
font_path="$font_dir/OPPOSans4.0.ttf"

if [[ -s "$font_path" ]]; then
  exit 0
fi

download_dir="$(mktemp -d)"
trap 'rm -rf "$download_dir"' EXIT

mkdir -p "$font_dir"

curl \
  --location \
  --fail \
  --retry 2 \
  --user-agent "Mozilla/5.0" \
  --referer "https://www.coloros.com/" \
  --output "$download_dir/OPPO_Sans_4.0.zip" \
  "https://coloros-website-cn.allawnfs.com/font/OPPO_Sans_4.0.zip"

unzip -p \
  "$download_dir/OPPO_Sans_4.0.zip" \
  "OPPO_Sans_4.0/OPPO Sans 4.0.ttf" \
  > "$font_path"

if [[ ! -s "$font_path" ]]; then
  echo "OPPO Sans download completed without a usable font file." >&2
  exit 1
fi
