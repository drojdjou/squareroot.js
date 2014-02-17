#!/bin/bash

echo $#

if [[ $# > 1 && $2 = "b" ]] ; then
	tools/build.py 
	ls -l build/squareroot-min.js
fi

git add -u .
git add .
git status
git commit -m "$1"
git push origin gl