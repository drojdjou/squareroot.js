SQR.ParticleStream = function(params) {

	if(!SQR.ParticleStream.buffer) {
		SQR.ParticleStream.buffer = SQR.Buffer()
		.layout({ aPhase: 1, aOffset: 1, aSpeed: 1 }, params.size)
		.iterate('aPhase' ,function(i, data) {
			data[i] = Math.random();
		})
		.iterate('aSpeed' ,function(i, data) {
			// data[i] = 1.0 + Math.random();
			data[i] = 0.5 + 0.5 * Math.random();
		})
		.iterate('aOffset' ,function(i, data) {
			data[i] = Math.random() * 2 - 1;
		})
		.update();
	}

	var p = SQR.Transform();
	p.shader = params.shader;
	p.buffer = SQR.ParticleStream.buffer;
	p.buffer.setMode(SQR.gl.POINTS);
	return p;

}