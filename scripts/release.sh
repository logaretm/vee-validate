#!/bin/bash

pnpm build
pnpm changeset version
git add .
git commit -m "chore(release): publish"
pnpm install
pnpm changeset publish
git push --follow-tags
