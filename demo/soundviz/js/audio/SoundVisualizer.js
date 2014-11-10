var SoundVisualizer = function(canvas, _w, _h) {

	var w = canvas.width = _w;
	var h = canvas.height = _h;
	var levelSpacing = 1;
	var beatColor = 0;

	var ctx = canvas.getContext('2d');

	var sv = {};

	var clear = function() {
		ctx.clearRect(0, 0, w, h);
	}

	var waveform = function(binCount, waveData) {
		ctx.strokeStyle = "#fff";
		ctx.beginPath();

		for(var i = 0; i < binCount; i++) {
			ctx.lineTo(i / binCount * w, waveData[i] * h / 2 + h / 2);
		}

		ctx.stroke();
	}

	var levels = function(levelsCount, levelsData) {

		var barWidth = w / levelsCount;
		ctx.fillStyle = "rgba(255, 0, 0, 0.9)";

		for(var i = 0; i < levelsCount; i++) {
			ctx.fillRect(i * barWidth, h, barWidth - levelSpacing, levelsData[i] * -h);
		}
	}

	var totalLevel = function(level) {
		var barWidth = w / 10;
		ctx.fillStyle = "rgba(" + beatColor + ", 100, " + beatColor + ", 1.0)";
		ctx.fillRect(w - barWidth - levelSpacing, h, barWidth - levelSpacing, level * -h);

		beatColor = (beatColor * 0.8) | 0;
	}

	sv.draw = function(analyzer) {
		clear();
		totalLevel(analyzer.level);
		levels(analyzer.levelsCount, analyzer.levelsData);
		waveform(analyzer.waveCount, analyzer.waveData);
	}

	sv.onBeat = function() {
		beatColor = 255;
	}

	return sv;
}