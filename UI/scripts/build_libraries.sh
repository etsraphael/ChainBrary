#!/bin/bash

cd "$(dirname "$0")"

for LIB_DIR in ./../projects/*; do
  if [[ -d $LIB_DIR ]]; then
    LIB_NAME=$(basename $LIB_DIR)
    echo "Building $LIB_NAME..."
    npx ng build $LIB_NAME
    if [ $? -ne 0 ]; then
      echo "Error building $LIB_NAME!"
      exit 1
    fi
    echo "$LIB_NAME built successfully!"
  fi
done
