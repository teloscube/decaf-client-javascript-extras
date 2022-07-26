#!/usr/bin/env bash
set -e

if [ -n "$DECAF_JS_SKIP_POSTINSTALL" ]; then
  yarn husky install
  echo "Local Env detected. Skipping lib/ relocation..."
  exit 0
fi

echo 'Copying files from lib folder into root project folder...'
cp -r lib/* ./ && rm -rf lib
echo 'Done!'
