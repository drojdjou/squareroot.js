/**
 *	@namespace Loader
 *	@memberof SQR
 *
 *	@description Utility to load different types of files (and also some WebRTC related stuff, see below)
 */
var Loader = {

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
		Loader.loadText(path, function(text) {
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
	loadAssets: function(paths, callback, progressCallback) {
		var toLoad = paths.length;
		Loader.assets = {};
		var aliases = {};

		var onAsset = function(asset, p) {
			Loader.assets[aliases[p] || p] = asset;
			toLoad--;

			if(progressCallback) {
				progressCallback(toLoad, paths.length);
			}

			if(toLoad == 0) {
				callback(Loader.assets);
			}
		}
		
		for(var i = 0; i < toLoad; i++) {
			var p = paths[i];

			if(typeof(p) != 'string') {
				aliases[p[0]] = p[1];
				p = p[0];
			}

			var e = p.substring(p.lastIndexOf('.') + 1);

			if(p.indexOf('~') > -1) {
				if(SQR.GLSL && SQR.GLSL[p.substring(2)]) {
					toLoad--;
					continue;
				} else {
					p = p.replace('~', SQR.shaderPath);
				}
			}
			
			switch(e) {
				case 'glsl':
					Loader.loadText(p, onAsset);
					break;
				case 'png':
				case 'jpg':
				case 'gif':
					Loader.loadImage(p, onAsset);
					break;
				case 'json':
				case 'js':
					Loader.loadJSON(p, onAsset);
					break;
				case 'mp4':
				case 'webm':
					Loader.loadVideo(p, onAsset);
					break;
				case 'webcam':
					Loader.loadWebcam(onAsset);
					break;
			}
		}
	}
};

export default Loader;






