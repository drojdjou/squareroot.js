#!/usr/bin/env node

var VERSION = 3;

var livereload = require('livereload');
var chokidar = require('chokidar');
var less = require('less');
var fs = require('fs');
var LessPluginAutoPrefix = require('less-plugin-autoprefix');

var GLSL_HOME = __dirname + '/html/src/glsl/builtin/';
var LRPORT = 35934;
var SHADER_REPO_BASE = 'https://github.com/drojdjou/squareroot.js/tree/master/html/src/glsl/builtin/';

var compileLessFile = function(name) {
	fs.readFile('dev/less/' + name + '.less', 'utf8', function (err, data) {

		if (err) return console.log(err);

		console.log('..recompiling styles: ' + name);

		var autoprefixPlugin = new LessPluginAutoPrefix({
			browsers: ['last 2 versions']
		});

		less.render(data, {
			paths: ['dev/less'],
			filename: 'dev/less/' + name + '.less',
			plugins: [autoprefixPlugin],
			compress: false
		}, function (err, output) {
			if (err) return console.log(err);
			fs.writeFile('dev/css/' + name + '.css', output.css, function(err) { if(err) return console.log(err); });
		});

	});
};

var walk = function(dir, filelist) {

	var files = fs.readdirSync(dir);
	var filelist = filelist || [];

	files.forEach(function(file) {
		if (fs.statSync(dir + file).isDirectory()) {
			filelist = walk(dir + file + '/', filelist);
		} else {
			if(file.indexOf('.glsl') > -1) filelist.push(dir + file);
		}
	});

	return filelist;
};

var jsifyShaders = function(folder) {

	var set = walk(folder);

	var concatFile  = "/**"
		concatFile += "\n * @namespace GLSL"
		concatFile += "\n * @memberof SQR";
		concatFile += "\n * @description The global namespace holding GLSL code of all built-in shaders and shader chunks.";
		concatFile += "\n */";
		concatFile += "\nSQR.GLSL = {\n";

	for(var i = 0; i < set.length; i++) {
		var f =  set[i];
		var docs = null;

		var file = fs.readFileSync(f).toString();
				
		// Extract the docs
		var d = file.match(/\/\*#docs([^\*]*)\*\//);
		if(d && d.length > 1) {
			docs = d[1].replace('#docs', '').trim();
			file = file.replace(d[1], '');
		}

		// Extract the shader name
		var lines = file.split('\n');
		var name = lines[0].substring(8);
		var filename = f.substring(folder.length);
		var n = file.indexOf('//#name') == -1 ? filename : name;

		if(docs) {
			concatFile += "\n\t/**";
			concatFile += "\n\t * @property " + name;
			concatFile += "\n\t * ";
			concatFile += "\n\t * ";
			concatFile += docs.split('\n').join('\n\t * ');
			concatFile += "\n\t * ";
			concatFile += "\n\t * <a href='" + SHADER_REPO_BASE + filename + "'>Shader source</a>";
			concatFile += "\n\t */\n";
		} else {
			concatFile += "\n\t/* --- --- [" + name + " (" + filename + ")] --- --- */\n";
		}

		concatFile += '\t"' + n + '": "';

		for(var j = 0; j < lines.length; j++) {
			var l = lines[j];
			if(l.indexOf("//#name") == 0) continue;
			if(l.indexOf("//") > -1 && l.indexOf("//#") == -1) l = l.substring(0, l.indexOf("//"));
			if(l.match(/^([\s\t]*)$/)) continue;
			concatFile += l + '\\n';
		}

		concatFile += '",\n';
	}

	concatFile += "};\n";

	return concatFile;
}

var recompileStyles = function(event, filename) {
	console.log('> ' + filename + ' changed, recompiling styles');
	compileLessFile('master');
}

var rebuildShaders = function(event, filename) {
	console.log('> ' + filename + ' changed, rebuilding shaders');

	var result = jsifyShaders(GLSL_HOME);
	var filename = 'html/src/GLSL.js';

	fs.writeFileSync(filename, result);

	// var cs = fs.statSync(cf).size;
	// var cks = (cs / 1024) | 0;
	// console.log('[ ' + cf + '\t' + cs + ' bytes\t' + cks + ' kb ]');
}

// watch('dev/less', recompileStyles);
// watch('dev/glsl', rebuildShaders);

chokidar.watch('dev/less', {ignored: /[\/\\]\./}).on('all', recompileStyles);
chokidar.watch(GLSL_HOME, {ignored: /[\/\\]\./}).on('all', rebuildShaders);

var lrserver = livereload.createServer({ port: LRPORT });
lrserver.watch(__dirname + "/dev");

console.log('> Server ready', 'Version: ', VERSION, 'Post: ', LRPORT); 
console.log('LR is running at port ', LRPORT);
console.log('GLSL is watching', GLSL_HOME);










