ForestGround = function(parent, assets, options, camera) {

	var gRes = Simplrz.touch ? 80 : 120;
	var gSize = 200;
	var numTiles = 2;

	var buffer = SQR.Primitives.createPlane(gSize, gSize, gRes, gRes);
	buffer.vertices.forEach(function(v) {
		v.y = 0.5 - Math.random() * 1;
	});
	buffer.recalculateNormals().updateFromFaces().update();

	var shader = SQR.Shader(assets.ground)
		.use()
		.setUniform('uFogStart', 15)
		.setUniform('uFogEnd', options.end * 1.2)
		.setUniform('uDarkness', options.nightColor)
		.setUniform('uColor', options.groundColor);




	for(var i = 0; i < numTiles; i++) {
		var ground = new SQR.Transform();
		ground.buffer = buffer
		ground.rotation.x = Math.PI;
		ground.shader = shader;
		ground.position.z = -gSize * i * 0.98;

		ground.beforeDraw = function(t) {
			if((t.position.z - gSize / 2) - camera.position.z > 0) {
				t.position.z -= gSize * numTiles * 0.98;
			}
		}

		parent.add(ground);
	}

	return {
		shader: shader
	};
}