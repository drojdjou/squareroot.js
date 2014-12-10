#!/bin/bash

BRANCH=$(git rev-parse --abbrev-ref HEAD)

./build
git add -u .
git add .
git status
git commit -m "$1"
git push origin $BRANCH