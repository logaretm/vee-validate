#!/usr/bin/env sh

# abort on errors
set -e

cd packages/docs

yarn generate

cd dist
git init
git add -A
git commit -m 'deploy'

git push -f git@github.com:logaretm/vee-validate.git master:gh-pages-next

cd -