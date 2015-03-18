// as in http://bartekdrozdz.com/project/soundviz (spherical lines)

SQR.DiscoBall = function(params) {
	if(!params) throw('> SQR.DiscoBall > Please provide paramerters for construction');

	var d = new SQR.Transform('disco-ball');

	d.shader = params.shader;

	var v;

	d.buffer = SQR.Buffer()
		.layout({ aPosition: 3, aMul: 1, aPhase: 1, aColor: 3 }, params.size * 2)
		.iterate('aPosition', function(i, data, c) {

			var inner = (c % 2 == 1);
			if(!inner) v = new SQR.V3().random().norm();

			data[i + 0] = v.x;
			data[i + 1] = v.y;
			data[i + 2] = v.z;
		})
		.iterate('aMul', function(i, data, c) {
			var inner = (c % 2 == 1);
			data[i] = (inner) ? 0 : params.thickness;
		})
		.iterate('aPhase', function(i, data, c) {
			data[i] = Math.random() * 10;
		})
		.iterate('aColor', function(i, data, c) {
			var col = params.colors[c % params.colors.length];
			data[i + 0] = col.r;
			data[i + 1] = col.g;
			data[i + 2] = col.b;
		})
		.update();

	return d;
}