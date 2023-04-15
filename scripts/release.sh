#!/bin/bash

pnpm build
pnpm changeset version
pnpm install
git add .
git commit -m "chore(release): publish"
pnpm changeset publish
git push --follow-tags
