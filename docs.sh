#!/bin/bash

rm -Rf docs/*
jsdoc -d docs -R README.md html/src/*