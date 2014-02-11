#!/usr/bin/env python

import os, glob, sys, fileinput, shutil, time

infoTxt = "tools/build/info.txt"

now = ""

def listSourceFiles(srcfolder):
	jsf = []
	for root, dirs, files in os.walk(srcfolder):
		for name in files:
			fname = os.path.join(root, name)
			if name[-2:] == "js":
				jsf.append(fname)
				print "J %s" % fname
	return jsf

def minifyWithClosure(jsf, output):
	os.system('touch %s.temp' % output)

	_cmd =  "java -jar tools/build/compiler.jar --js_output_file %s.temp --warning_level QUIET --js " % output
	_cmd += ' --js '.join(jsf)
	os.system(_cmd)

def finalizeBuild(output):
	os.system("cat %s %s.temp > %s" % (infoTxt, output, output))
	os.remove("%s.temp" % output)

def incrementVersion():
	global now
	buildVersion = 0

	for line in fileinput.input('src/SQR.js', inplace=1):	
		if 'SQR.BUILD = ' in line:
			buildVersion = int(line[-4:-2])
			buildVersion += 1
			print 'SQR.BUILD = %i;' % buildVersion
		elif '// Built on' in line:
			print '// Built on %s' % now
		else:
			print line,

	for line in fileinput.input('tools/build/info.txt', inplace=1):	
		if 'Build ' in line:
			print 'Build %i | %s' % (buildVersion, now)
		else:
			print line,

def build(srcfolder, output):
	global now
	now = time.asctime( time.localtime(time.time()) )
	print "[ Starting build at %s ]" % now

	print "[ Update version ]"
	incrementVersion()
	print "[ Getting JS source files ]"
	f = listSourceFiles(srcfolder)
	print "[ Minifying ]"
	minifyWithClosure(f, output)
	print "[ Finalizing build ]"
	finalizeBuild(output)
	print "[ Done ]"

# # # # # #
if(__name__ == '__main__'):
	cwd = os.getcwd().split("/")[-1]
	if cwd == "tools":
		os.chdir('../')

	build("src", "build/squareroot-min.js")

	os.system("ls -lh build/squareroot-min.js");
	os.system("ls -l build/squareroot-min.js");









