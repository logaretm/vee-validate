#!/usr/bin/env sh

echo "\e[34mRemoving old declarations..."
rm -rf ./dist/types
mkdir -p ./dist/types
echo "\e[92mDone"

echo "\e[34mGenerating main declarations..."
tsc --emitDeclarationOnly
echo "\e[92mDone"

echo "\e[34mCleaning up declaration folder..."
mv ./dist/types/src/* ./dist/types
rm -rf ./dist/types/src
echo "\e[92mDone"

# echo "Generating rule declarations..."
# tsc ./src/rules/index.ts --emitDeclarationOnly --declaration --declarationDir ./dist/types --lib es2017 dom
# echo "Done"
