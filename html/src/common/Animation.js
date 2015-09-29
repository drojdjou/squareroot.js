SQR.Animation = function(duration) {

	var clips = [], numClips = 0;

	var a = {
		duration: duration
	};

	a.addClip = function(c) {
		clips.push(c);
		numClips = clips.length;
	} 

	a.play = function() {
		for(var i = 0; i < numClips; i++) clips[i].playing = true;	
	}

	a.reverse = function(v) {
		for(var i = 0; i < numClips; i++) clips[i].reverse = v;
	}

	a.pause = function() {
		for(var i = 0; i < numClips; i++) clips[i].playing = false;	
	}

	a.gotoTime = function(ms) {
		for(var i = 0; i < numClips; i++) clips[i].gotoTime(ms);	
	}

	a.setTimeScale = function(ts) {
		for(var i = 0; i < numClips; i++) clips[i].timeScale = ts;	
	}

	return a;
}