var Needle = function(shader) {

	var scaleFunc = function(t, v) {
		t = t * t * t;
		t = 1 - t;
		v.mul(t);
	}

	var curve = new SQR.Spline()
		.addSegment(0,    0,  0)
		.addSegment(2,   -0.4 + Math.random() * -0.4,  0)
		.addSegment(4,    0,  0)
		.create(0.5);

	var r = 0.2, s = 7, profile = [];

	for(var i = 0; i < s; i++) {
		var ir = (i == 2) ? r * 0.2 : r;
		var x = Math.cos(i / s * SQR.TWOPI) * ir * 2;
		var y = Math.sin(i / s * SQR.TWOPI) * ir;
		profile.push(new SQR.V2(x, y));
	}

	var extrude = SQR.Extrude().setPaths(profile, curve, 12, { 'aPosition': 3, 'aNormal': 3, 'aColor': 1 });
	extrude.update(0, 1, scaleFunc);

	var color = Math.random() * 0.2 + 0.6;

	extrude.buffer.iterate('aColor', function(i, d, c) {
		d[i] = color;
	}).update();

	var needle = SQR.Transform();
	needle.buffer = extrude.buffer;
	needle.shader = shader;

	return needle;
}