#!/usr/bin/env bash
set -e

if [ -n "$DECAF_JS_SKIP_POSTINSTALL" ]; then
  yarn husky install
  echo "Local Env detected. Skipping dist/ relocation..."
  exit 0
fi

echo 'Copying files from dist folder into root project folder...'
cp -r dist/* ./ && rm -rf dist
echo 'Done!'
