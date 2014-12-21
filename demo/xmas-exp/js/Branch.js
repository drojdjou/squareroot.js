var Branch = function(branchShader) {

	var numNeedles = 30, spacing = 1, threshold = 0.99, lenght = numNeedles * spacing;

	var branch = new SQR.Transform();

	var path = new SQR.Spline()
		.addSegment(0,    0,  0)
		// .addSegment(Math.random() * 4 - 2,  3 + Math.random() * 2,  lenght / -2)
		// .addSegment(Math.random() * 4 - 0.2,   Math.random() * 3,  lenght / -1)
		.addSegment(2,    3,  lenght / -2)
		.addSegment(0.2,  0,  lenght / -1)
		.create(0.5);

	var r = 0.2, s = 8, profile = [];

	for(var i = 0; i < s; i++) {
		var ir = (i == 2) ? r * 0.2 : r;
		var x = Math.cos(i / s * SQR.TWOPI) * ir;
		var y = Math.sin(i / s * SQR.TWOPI) * ir;
		profile.push(new SQR.V2(x, y));
	}

	var extrude = SQR.Extrude().setPaths(profile, path, 12, { 'aPosition': 3, 'aNormal': 3, 'aColor': 1 });
	extrude.update(0, 1);

	extrude.buffer.iterate('aColor', function(i, d, c) {
		d[i] = 0;
	}).update();

	var stalk = SQR.Transform();
	stalk.buffer = extrude.buffer;

	branch.add(stalk);
	
	var i = 0;

	for(; i < numNeedles; i++) {

		var t = i / numNeedles;
		var m = path.matrixAt(t);

		if(Math.random() < threshold) {
			var nl = Needle(branchShader);
			nl.directMatrixMode = true;
			var ry = Math.random() * 0.3 - 0.15;
			var rz = Math.random() * -0.3;
			m.copyTo(nl.matrix);
			nl.matrix.rotate(0, ry, rz);
			branch.add(nl);
		} 

		if(Math.random() < threshold) {
			var nr = Needle(branchShader);
			nr.directMatrixMode = true;
			var ry = Math.PI + Math.random() * 0.3 - 0.15;
			var rz = Math.random() * 0.3;
			m.copyTo(nr.matrix);
			nr.matrix.rotate(0, ry, rz);
			branch.add(nr);
		}

	}

	SQR.GeometryTools.batch(branch);

	return branch;
}