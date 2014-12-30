#!/bin/bash

rm -Rf docs/*
jsdoc -d docs -R README.md -u tutorials/ html/src/*