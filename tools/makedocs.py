#!/usr/bin/env python

import os, glob, sys, fileinput, shutil, time

def listSourceFiles(srcfolder):
	jsf = []
	for root, dirs, files in os.walk(srcfolder):
		for name in files:
			fname = os.path.join(root, name)
			if name[-2:] == "js":
				jsf.append(fname)
	return jsf

def build(srcfolder):
	print "[ Getting JS source files ]"
	f = listSourceFiles(srcfolder)
	print "[ Generating docs ]"
	c = "./node_modules/.bin/jsdoc "
	c += " ".join(f)
	c += " README.md"
	os.system(c);


# # # # # #
if(__name__ == '__main__'):
	cwd = os.getcwd().split("/")[-1]
	if cwd == "tools":
		os.chdir('../')

	build("src")