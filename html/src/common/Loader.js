/**
 *	@namespace Loader
 *	@memberof SQR
 *
 *	@description Utility to load different types of files (and also some WebRTC related stuff, see below)
 */
SQR.Loader = {

	/** 
	 *	@method load
	 *	@memberof SQR.Loader
	 *
	 *	@description Load a text file and return it's contents in the callback.
	 */
	loadText: function(path, callback){
		var request = new XMLHttpRequest();
		request.open("GET", path);

		var onReadystatechange = function(){
			if (request.readyState == 4) {
				request.removeEventListener('readystatechange', onReadystatechange);
				callback(request.responseText, path);
			}
		}

		request.addEventListener('readystatechange', onReadystatechange);

		request.send();
	},

	/** 
	 *	@method loadJSON
	 *	@memberof SQR.Loader
	 *
	 *	@description Load a JSON file and return it's contents in the callback.
	 *	This function will parse the JSON data for you and return an Object.
	 */
	loadJSON: function(path, callback){
		SQR.Loader.loadText(path, function(text) {
			callback(JSON.parse(text), path);
		});
	},

	/** 
	 *	@method loadImage
	 *	@memberof SQR.Loader
	 *
	 *	@description Load an image file and return it's contents in the callback
	 *	as Image object.
	 */
	loadImage: function(path, callback, errorCallback){
		var img = new Image();

		if(callback) {
			var onload = function() {
				img.removeEventListener('load', onload);
				callback(img, path);
			}
			img.addEventListener('load', onload);
		}

		if(errorCallback) {
			var onerror = function() {
				img.src = '';
				img.removeEventListener('error', onerror);
				errorCallback(null, path);
				return false;
			}
			img.addEventListener('error', onerror);
		}

		img.src = path;
		return img;
	},

	/** 
	 *	@method loadWebcam
	 *	@memberof SQR.Loader
	 *
	 *	@description Initiate user stream (webcam). 
	 */
	loadWebcam: function(callback, options) {
		navigator.getUserMedia  = navigator.getUserMedia ||
                                navigator.webkitGetUserMedia ||
                                navigator.mozGetUserMedia ||
                                navigator.msGetUserMedia;

        if(!navigator.getUserMedia) {
        	console.error('> SQR.Loader - getUserMedia not supported');
        	callback();
        }

        options = options || {
        	audio: false,
	        video: {
	        	// mandatory: { minWidth: 1920, minHeight: 1080 }
	        }
	    };

	    var onVideo = function(stream) {
	    	video.stream = stream;
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
			console.error('> SQR.Loader - getUserMedia error ', e);
		});
    },

    /**
	 *	@method loadVideo
	 *	@memberof SQR.Loader
	 *
     *	@description Preload a video so that it can be used as a texture (typically)
     */
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

    /**
	 *	@method loadAssets
	 *	@memberof SQR.Loader
	 *
     *	@description Load multiple assets of type:
     *  <ul>
     *		<li>text, including GLSL code</li>
     *		<li>JSON, including model, geometry, scene. etc...</li>
     *		<li>image (jpg, gif, png), video (mp4, webm)</li>
     *		<li>webcam (it will initiate the webcam,
     *		ask user for permisions, and return a ready to use stream)</li>
     *	</ul>
	 *	
	 *	Each file will be availabke from the asset object passed to the callback
	 *	under it's name, ex. assets['normal2color.glsl']
	 *	It's also possible ot specify an alias. Instead of a String, 
	 *	use an Array, where [0] is the path, and [1] is the alias.
     *
     *	@example
SQR.Loader.loadAssets([
	['some-image.jpg', 'image'],
	['some-video.mp4', 'video'],
	['a-shader.glsl', 'shader'],
	'another-shader.glsl',
	'webcam' // special case, but useful :)
], function(assets) {
	var image = assets['image'];
});
	 *
	 * 	@param {object} paths - list of file paths (with optinal aliases) to load, as in example below.
	 *	@param {function} callback - called when all the files are loaded. 
	 *	The assets are passed as argument as in the example below.
	 *	@param {function} progressCallback - called each time when on of the files is loaded
     */
	loadAssets: function(paths, callback, progressCallback, options) {

		options = options || {};

		var toLoad = paths.length;
		var assets = {};

		if(toLoad == 0) {
			if(progressCallback) progressCallback(1, 1);
			callback();
			return;
		}

		var aliases = {}, includes = {};

		var onShader = function(asset, p) {
			SQR.GLSLInclude = SQR.GLSLInclude || {};
			SQR.GLSLInclude[aliases[p]] = asset;
			onAsset(asset, p);
		}

		var onAsset = function(asset, p) {
			assets[aliases[p]] = asset;
			toLoad--;

			if(progressCallback) {
				progressCallback(toLoad, paths.length);
			}

			if(toLoad == 0) {
				callback(assets);
			}
		}
		
		for(var i = 0; i < toLoad; i++) {
			var p = paths[i];

			var hasAlias = typeof(p) != 'string';
			var file = hasAlias ? p[0] : p;
			var alias = hasAlias ? p[1] : p;
			var fileType = file.substring(file.lastIndexOf('.') + 1);

			aliases[file] = alias;
			
			switch(fileType) {
				case 'glsl':
					SQR.Loader.loadText(file, onShader);
					break;
				case 'png':
				case 'jpg':
				case 'gif':
					SQR.Loader.loadImage(file, onAsset);
					break;
				case 'json':
				case 'js':
					SQR.Loader.loadJSON(file, onAsset);
					break;
				case 'mp4':
				case 'webm':
					SQR.Loader.loadVideo(file, onAsset);
					break;
				case 'webcam':
					SQR.Loader.loadWebcam(onAsset);
					break;
			}
		}
	}
};






