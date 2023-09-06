#!/bin/bash

cd "$(dirname "$0")"

for LIB_DIR in ./../projects/*; do
  if [[ -d $LIB_DIR ]]; then
    LIB_NAME=$(basename $LIB_DIR)

    # Build the library using Angular CLI
    echo "Building $LIB_NAME..."
    ng build $LIB_NAME
    if [ $? -ne 0 ]; then
      echo "Error building $LIB_NAME!"
      exit 1
    fi

    # Navigate to the distribution directory of the built library
    cd ../dist/$LIB_NAME

    # Get the current version from package.json
    CURRENT_VERSION=$(grep -Eo '"version":\s*"[^"]+"' package.json | grep -Eo '[0-9]+\.[0-9]+\.[0-9]+')

    # Fetch the content of the published library from npm to compare
    PUBLISHED_VERSION=$(npm info "$LIB_NAME" version 2> /dev/null)

    LOWEST_VERSION=$(printf "%s\n%s" "$CURRENT_VERSION" "$PUBLISHED_VERSION" | sort -V | head -n 1)

    if [[ "$LOWEST_VERSION" == "$PUBLISHED_VERSION" && "$CURRENT_VERSION" != "$PUBLISHED_VERSION" ]]; then
      # Publish the library
      npm publish
      if [ $? -ne 0 ]; then
        echo "Error publishing $LIB_NAME!"
        exit 1
      fi

      # Copy the version of package.json back to the source directory
      cp package.json ../../projects/$LIB_NAME/package.json

      echo "$LIB_NAME published successfully!"
    else
      echo "$LIB_NAME is not ready for publishing. Either it's already at the latest version ($CURRENT_VERSION) or the version number is not set correctly."
    fi

    # Navigate back to the script directory
    cd -
  fi
done
