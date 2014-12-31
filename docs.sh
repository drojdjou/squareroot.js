#!/bin/bash

rm -Rf docs/*
jsdoc -d docs -R tutorials/content/home.md -u tutorials/content html/src/*