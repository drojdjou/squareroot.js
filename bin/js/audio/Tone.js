var Tone = function(context, parentNode, name) {

	var that = this;

	var maxvol = 1;
	var duration = 1;
	var startTime;
	var upRampDuration = 0.001;

	var gain = context.createGainNode();
	gain.gain.value = 0;
	
	var oscillator = context.createOscillator();
	oscillator.type = "sine";
	oscillator.frequency.value = 440;
	oscillator.detune.value = 0;

	gain.connect(parentNode);
	oscillator.connect(gain);
	oscillator.start(0);

	this.duration = function(d) {
		duration = d;
		return this;
	}

	this.volume = function(v) {
		maxvol = v;
		return this;
	}

	this.type = function(t) {
		oscillator.type = t;
		return this;
	}

	this.frequency = function(f) {
		oscillator.frequency.value = f;
		return this;
	}

	this.detune = function(d) {
		oscillator.detune.value = d;
		return this;
	}

	this.play = function(timescale) {
		var now = context.currentTime;
		var d = duration * timescale;
		gain.gain.cancelScheduledValues(now);
		gain.gain.setValueAtTime(maxvol, now);
		gain.gain.linearRampToValueAtTime(0, now + d/1000);
	}
}