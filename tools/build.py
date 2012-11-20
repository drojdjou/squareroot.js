#!/usr/bin/env python

import os, glob, sys, fileinput, shutil, time

srcfolder = "src"

infoTxt = "tools/build/info.txt"

outputTemp = "build/squareroot-temp.js"
outputMinTemp = "build/squareroot-temp-min.js"

output = "build/squareroot.js"
outputMin = "build/squareroot-min.js"

now = ""

def listSourceFiles():
	jsf = []
	for root, dirs, files in os.walk(srcfolder):
		for name in files:
			fname = os.path.join(root, name)
			if name[-2:] == "js":
				jsf.append(fname)
				print "J %s" % fname
	return jsf

def minifyWithClosure(jsf):
	os.system('touch %s' % outputMinTemp)

	_cmd =  "java -jar tools/build/compiler.jar --js_output_file %s --warning_level QUIET --js " % outputMinTemp
	_cmd += ' --js '.join(jsf)
	os.system(_cmd)

#	_cmd = "cat "
#	_cmd += ' '.join(jsf)
#	_cmd += ' > %s' % outputTemp
#	os.system(_cmd)

def finalizeBuild():
#	os.system("cat %s %s > %s" % (infoTxt, outputTemp, output))
	os.system("cat %s %s > %s" % (infoTxt, outputMinTemp, outputMin))

def cleanup():
#	os.remove(outputTemp)
	os.remove(outputMinTemp)

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

def build():
	global now
	now = time.asctime( time.localtime(time.time()) )
	print "[ Starting build at %s ]" % now

	print "[ Update version ]"
	incrementVersion()
	print "[ Getting JS source files ]"
	f = listSourceFiles()
	print "[ Minifying ]"
	minifyWithClosure(f)
	print "[ Finalizing build ]"
	finalizeBuild()
	print "[ Cleanup ]"
	cleanup()

# # # # # #
if(__name__ == '__main__'):
	cwd = os.getcwd().split("/")[-1]
	if cwd == "tools":
		os.chdir('../')

	build()









