#!/bin/bash
set -e

if [[ -z $1 ]]; then
  echo "Enter new version: "
  read -r VERSION
else
  VERSION=$1
fi

read -p "Releasing $VERSION - are you sure? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "Releasing $VERSION ..."

  if [[ -z $SKIP_TESTS ]]; then
    npm run lint
    npm run test --maxWorkers=1
  fi

  # build
  VERSION=$VERSION npm run build

  git add .
  git diff --quiet && git diff --staged --quiet || git commit -am "build: build $VERSION"

  # tag version
  npm version "$VERSION" --message "build: release $VERSION"

  # publish
  git push origin refs/tags/v"$VERSION"
  git push

  echo -e "\033[1;92m You are ready to publish!"
  echo -e "\033[1;95m npm publish"
fi
