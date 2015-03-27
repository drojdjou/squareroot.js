#!/bin/bash

BRANCH=$(git rev-parse --abbrev-ref HEAD)

./build $1
git add -u .
git add .
git status
git commit -m "$1"
git push origin $BRANCH