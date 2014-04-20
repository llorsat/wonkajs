#!/bin/bash

mkdir dist
mkdir dist/templates
mkdir dist/scripts
mkdir dist/lib
mkdir dist/bin
cp -r ./templates/* dist/templates/
cp -r ./scripts/* dist/scripts/
cp -r ./lib/* dist/lib/
cp -r ./bin/* dist/bin/
cp package.json dist/
cp LICENSE-MIT dist/
cp README.md dist/
cp RELEASE.txt dist/
