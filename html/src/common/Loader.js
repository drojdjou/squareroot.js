SQR.Loader = {

	loadText: function(path, callback){
		var request = new XMLHttpRequest();
		request.open("GET", path);

		request.onreadystatechange = function(){
			if (request.readyState == 4) {
				callback(request.responseText, path);
			}
		};

		request.send();
	},

	loadJSON: function(path, callback){
		SQR.Loader.loadText(path, function(text) {
			callback(JSON.parse(text), path);
		});
	},

	loadImage: function(path, callback){
		var img = new Image();
		if(callback) {
			var onload = function() {
				img.removeEventListener('load', onload);
				callback(img, path);
			}
			img.addEventListener('load', onload);
		}
		img.src = path;
		return img;
	},

	loadAssets: function(paths, init) {
		var toLoad = paths.length;
		SQR.Loader.assets = {};

		var onAsset = function(asset, p) {
			SQR.Loader.assets[p] = asset;
			toLoad--;
			if(toLoad == 0) {
				init(SQR.Loader.assets);
			}
		}
		
		for(var i = 0; i < toLoad; i++) {
			var p = paths[i];
			var e = p.substring(p.lastIndexOf('.') + 1);

			p = p.replace('~', SQR.shaderPath);
			
			switch(e) {
				case 'glsl':
					SQR.Loader.loadText(p, onAsset);
					break;
				case 'png':
				case 'jpg':
				case 'gif':
					SQR.Loader.loadImage(p, onAsset);
					break;
				case 'json':
				case 'js':
					SQR.Loader.loadJSON(p, onAsset);
					break;
			}
		}
	}
};






