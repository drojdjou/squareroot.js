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
	}
};