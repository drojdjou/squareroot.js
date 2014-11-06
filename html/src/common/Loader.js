SQR.Loader = {

	loadText: function(path, onLoadedFunc){
		var request = new XMLHttpRequest();
		request.open("GET", path);

		request.onreadystatechange = function(){
			if (request.readyState == 4) {
				onLoadedFunc.call(null, request.responseText);
			}
		};

		request.send();
	},

	loadJSON: function(path, onLoadedFunc){
		SQR.Loader.loadText(path, function(text) {
			onLoadedFunc(JSON.parse(text));
		});
	},

	loadImage: function(src, callback){
		var img = new Image();
		if(callback) {
			var onload = function() {
				img.removeEventListener('load', onload);
				callback(img);
			}
			img.addEventListener('load', onload);
		}
		img.src = src;
		return img;
	},

	loadGLSL: function(src, callback) {
		SQR.Loader.loadText(src, function(text) {
			var vertex = "", fragment = "";
			var isVertex = true;
			var ls = text.split("\n");

			for(var i = 0; i < ls.length; i++) {
				if(ls[i].indexOf("//#") > -1) {
					if (ls[i].indexOf("//#fragment") > -1) {
						isVertex = false;
					} else if (ls[i].indexOf("//#vertex") > -1) {
						isVertex = true;
					}
				} else {
					var l = ls[i];
					if(l.indexOf("//") > -1) l = l.substring(0, l.indexOf("//"));

					if(l.match(/^([\s\t]*)$/)) continue;

					if(isVertex) {
						vertex += l + "\n";
					} else {
						fragment += l + "\n";
					}
				}
			}

			if(callback) callback(vertex, fragment, src);
		});
	},

	loadShaders: function(paths, callback) {
		var shadersToLoad = paths.length;
		var shaders = {};

		var onShader = function(vertex, fragment, path) {
			shadersToLoad--;
			shaders[path] = { vertex:vertex, fragment:fragment };

			if(shadersToLoad <= 0) callback(shaders);
		}

		paths.forEach(function(p) {
			SQR.Loader.loadGLSL(p, onShader);
		});
	}
};






