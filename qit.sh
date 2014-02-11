#!/bin/bash

# tools/build.py
# ls -l build/squareroot-min.js
git add -u .
git add .
git status
git commit -m "$1"
git push origin gl