#!/bin/bash

./build
git add -u .
git add .
git status
git commit -m "$1"
git push origin dev