#!/usr/bin/env bash
set -e

if [ -n "$DECAF_JS_SKIP_POSTINSTALL" ]; then
  echo "Local Env detected. Skipping postinstall phase."
  exit 0
fi

echo 'Copying files from dist folder into root project folder...'
cp -r dist/* ./ && rm -rf dist
echo 'Done!'
