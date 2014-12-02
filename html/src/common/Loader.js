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

	loadWebcam: function(callback) {
		navigator.getUserMedia  = navigator.getUserMedia ||
                                navigator.webkitGetUserMedia ||
                                navigator.mozGetUserMedia ||
                                navigator.msGetUserMedia;

        if(!navigator.getUserMedia) {
        	console.warn('getUserMedia not supported');
        	callback();
        }

        var options = {
        	audio: false,
	        video: {
	        	// mandatory: { minWidth: 1920, minHeight: 1080 }
	        }
	    };

	    var onVideo = function(stream) {
			video.src = window.URL.createObjectURL(stream);
	        video.play();
	        video.addEventListener('canplaythrough', videoReady, false);
	    }

	    var videoReady = function() {
	    	callback(video, 'webcam');
	    }

        var video = document.createElement('video');
    	video.autoplay = true;

		navigator.getUserMedia(options, onVideo, function(e) { 
			console.warn('getUserMedia error ', e);
		});
    },

    loadVideo: function(path, callback) {
    	var videoReady = function() {
	    	callback(video, path);
	    }

    	var video = document.createElement('video');
    	video.autoplay = true;
    	video.addEventListener('canplaythrough', videoReady, false);


    	var p = path;

    	if(!video.canPlayType('video/mp4')) {
    		p = p.replace('mp4', 'webm');
    	}

    	video.src = p;
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
				case 'mp4':
				case 'webm':
					SQR.Loader.loadVideo(p, onAsset);
					break;
				case 'webcam':
					SQR.Loader.loadWebcam(onAsset);
					break;
			}
		}
	}
};






