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

	loadImage:function(src, callback){
		var img = new Image();
		img.onload = callback(img);
		img.src = src;
	},

	loadShader: function(src, callback) {
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

			callback(vertex, fragment);
		});
	}

};