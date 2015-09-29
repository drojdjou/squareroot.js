SQR.Exporter = {

	exportSpline: function(spline, filename) {

		var s = {
			smoothness: spline.smoothness,
			close: spline.close || false,
			paths: spline.paths,
			segments: spline.segments
		};

		s = JSON.stringify(s, function(k, v) {
			if(v instanceof SQR.V3) {
				return 'v3';
			} else {
				return v;
			}
		}, 4);


		console.log(s);
	},

	saveAs: function(content, filename, mimetype) {
		var b = new Blob([content], { type: mimetype || 'text/plain' });
		var u = URL.createObjectURL(b);

		var a = document.createElement('a');
		a.download = filename || 'sqr-untitled.txt';
		a.href = u;
		a.click();
	}

}