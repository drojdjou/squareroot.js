// Based on http://www.airtightinteractive.com/demos/js/uberviz/audioanalysis/js/AudioHandler.js
var SoundAnalyser = function() {

	var that = this, sa = {};

	sa.levelsCount = 8; //should be factor of 512
	sa.waveCount = 32; //should be factor of 512
	sa.waveDataRaw = [];
	sa.waveData = [];
	sa.levelsData = [];
	sa.level = 0;


	var isPlaying = false, isUsingMic = false, isMicCreated = false;
	var audioContext, audioElement, analyser, microphone, volumeNode;

	var freqByteData; // bars - bar data is from 0 - 256 in 512 bins. no sound is 0;
	var timeByteData; // waveform - waveform data is from 0-256 for 512 bins. no sound is 128.

	var beatCutOff = 0, beatTime, beatLevel = 0;
	var beatHoldTime = 15; // num of frames to hold a beat
	var beatDecayRate = 0.97;
	var beatMinVol = 0.25; // a volume less than this is no beat
	var beatLevelUp = 1.05;

	var initContext = function() {

		audioContext = new window.webkitAudioContext();

		analyser = audioContext.createAnalyser();
		analyser.smoothingTimeConstant = 0;//0.8; // 0<->1 // 0 is no time smoothing
		analyser.fftSize = 1024;
		
		volumeNode = audioContext.createGain();
		volumeGainNode = audioContext.createGain();

		volumeNode.connect(audioContext.destination);
		analyser.connect(volumeNode);
		volumeGainNode.connect(analyser);
		
		sa.binCount = analyser.frequencyBinCount;
		sa.waveBins = Math.floor(sa.binCount / sa.waveCount);
		sa.levelBins = Math.floor(sa.binCount / sa.levelsCount);

		freqByteData = new Uint8Array(sa.binCount); 
		timeByteData = new Uint8Array(sa.binCount);
	}

	sa.setVolume = function(value) {
		volumeNode.gain.value = value;
	}

	sa.setSesitivity = function(value) {
		volumeGainNode.gain.value = value;
	}

	sa.connectMic = function() {

		if(isUsingMic) return;

		if(isPlaying) {
			source.disconnect(volumeGainNode);
			audioElement.pause();
		}

		if(!isMicCreated) {
			navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

			if (!navigator.getUserMedia) throw "No User Media detected";

			navigator.getUserMedia({audio: true}, function(stream) {
				microphone = audioContext.createMediaStreamSource(stream);
				microphone.connect(volumeGainNode);
				beatStart = new Date().getTime();
			});

		} else {
			microphone.connect(volumeGainNode);
		}

		isUsingMic = true;
		isPlaying = false;
		isMicCreated = true;

		return sa;
	}
	

	sa.connectTrack = function(path) {

		if(isPlaying) return;

		if(isUsingMic) {
			microphone.disconnect(volumeGainNode);
		}

		isUsingMic = false;
		
		if(!isPlaying) {
			audioElement = document.createElement('audio');
			audioElement.src = path;
			audioElement.loop = true;
			source = audioContext.createMediaElementSource(audioElement);
		}

		source.connect(volumeGainNode);
		audioElement.play();

		isPlaying = true;
	}

	sa.update = function() {
		analyser.getByteFrequencyData(freqByteData); //<-- bar chart
		analyser.getByteTimeDomainData(timeByteData); // <-- waveform

		for(var i = 0; i < sa.binCount; i++) {
			sa.waveDataRaw[i] = (timeByteData[i] - 128) / 128;
		}

		for(var i = 0; i < sa.waveCount; i++) {
			var totalForBin = 0;

			for(var j = 0; j < sa.waveBins; j++) {
				totalForBin += sa.waveDataRaw[(i * sa.waveBins) + j];
			}

			var t = totalForBin / sa.waveBins;
			sa.waveData[i] = t;
		}

		var total = 0;
		for(var i = 0; i < sa.levelsCount; i++) {
			var totalForBin = 0;

			for(var j = 0; j < sa.levelBins; j++) {
				totalForBin += freqByteData[(i * sa.levelBins) + j];
			}

			var t = totalForBin / sa.levelBins / 256;
			// sa.levelsData[i] *= 1 + (i / sa.levelsCount) / 2;

			sa.levelsData[i] = t;
			total += t;
		}
		
		sa.level = total / sa.levelsCount;
		beatLevel = sa.level;

		if (beatLevel > beatCutOff){
			if(sa.onBeat) sa.onBeat();
			beatCutOff = beatLevel * beatLevelUp;
			beatTime = 0;
		} else {
			if (beatTime <= beatHoldTime){
				beatTime++;
			}else{
				beatCutOff *= beatDecayRate;
				beatCutOff = Math.max(beatCutOff, beatMinVol);
			}
		}
	}

	initContext();

	return sa;
}

















