

var Wheat = function(stalkImage, stalkShaderSource) {

	var NUM_STALKS = 120;
	var transform = new SQR.Transform();
	var zero = new SQR.Transform();
	var stalks = [], shader, buffer;

	var createStalks = function() {

		shader = SQR.Shader(stalkShaderSource);
		shader.use().setUniform('uTexture', SQR.Texture(stalkImage));

		// w, h, wd, hd, wo, ho
		buffer = SQR.Primitives.createPlane(1, 1, 1, 1, 0, 0.5, { zUp: true }).update();

		for(var i = 0; i < NUM_STALKS; i++) {

			var p = new SQR.Transform();
			var s = new SQR.Transform();

			s.shader = shader;
			s.buffer = buffer;
			s.setBlending(true, SQR.gl.SRC_ALPHA,  SQR.gl.ONE_MINUS_SRC_ALPHA);

			var r = 6 + (1 - i / NUM_STALKS) * 10;
			s.position.set(0, -(3.75 + Math.random() * 2), -r);
			s.rotation.z = 0.2 * (Math.random() * 2 - 1);
			p.rotation.y = SQR.TWOPI * Math.random();
			var m = 1 + Math.random() * 0.2;
			s.scale.set(1 * m, 4 * m, 1);
			s.useDepth = false;
			s.uniforms = {  
				uSpeed: 0.001 + 0.001 * Math.random(),
				uTint: Math.random(),
				uForce: 0.1 + Math.random() * 0.1,
				uTimeOffset: SQR.TWOPI * Math.random(),
			};

			s.isStatic = true;
			p.isStatic = true;

			p.add(s);
			stalks.push(p);

			transform.add.apply(transform, stalks);
		}
	}

	createStalks();

	return transform;

}
