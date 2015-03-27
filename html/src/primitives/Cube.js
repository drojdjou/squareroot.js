/**
 *  @method createCube
 *  @memberof SQR.Primitives
 *
 *  @description Creates a simple cube geometry, 1 quad per side, with UVs, non-indexed
 *
 *	@param {Number} w - width of the cube
 *	@param {Number} h - height of the cube
 *	@param {Number} d - depth of the cube
 *
 *	@returns {SQR.Buffer}
 */
SQR.Primitives.createCube = function(w, h, d, options) {

	w = w || 1;
	h = h || 1;
	d = d || 1;

	var geo = SQR.Buffer()
		.layout( {'aPosition': 3, 'aNormal': 3, 'aUV': 2 }, 36);
	
	var v0 = new SQR.V3(w * -0.5,   h *  0.5,   d *  0.5); // Top left
	var v1 = new SQR.V3(w *  0.5,   h *  0.5,   d *  0.5); // Top right 
	var v2 = new SQR.V3(w * -0.5,   h * -0.5,   d *  0.5); // Bottom left 
	var v3 = new SQR.V3(w *  0.5,   h * -0.5,   d *  0.5); // Bottom right

	var v4 = new SQR.V3(w * -0.5,   h *  0.5,   d * -0.5); // Top left
	var v5 = new SQR.V3(w *  0.5,   h *  0.5,   d * -0.5); // Top right
	var v6 = new SQR.V3(w * -0.5,   h * -0.5,   d * -0.5); // Bottom left
	var v7 = new SQR.V3(w *  0.5,   h * -0.5,   d * -0.5); // Bottom right

	var u0 = new SQR.V2(0, 1);
	var u1 = new SQR.V2(1, 1);
	var u2 = new SQR.V2(0, 0);
	var u3 = new SQR.V2(1, 0);

	var faces = [];

	faces.push(SQR.Face().setPosition(v0, v1, v2, v3).setUV(u0, u1, u2, u3));
	faces.push(SQR.Face().setPosition(v5, v4, v7, v6).setUV(u0, u1, u2, u3));
	faces.push(SQR.Face().setPosition(v4, v0, v6, v2).setUV(u0, u1, u2, u3));
	faces.push(SQR.Face().setPosition(v1, v5, v3, v7).setUV(u0, u1, u2, u3));
	faces.push(SQR.Face().setPosition(v4, v5, v0, v1).setUV(u0, u1, u2, u3));
	faces.push(SQR.Face().setPosition(v2, v3, v6, v7).setUV(u0, u1, u2, u3));
	
	var c = 0;
	faces.forEach(function(t) {
		if(options && options.reverseNormals) t.flip();
		t.calculateNormal();
		c += t.toBuffer(geo, c);
	});

	// SQR.Debug.traceBuffer(geo, true);
	
	return geo.update();
}

SQR.Primitives.createSkybox = function(options) {

	options = options || {};
	options.size = options.size || 5;
	options.useDepth = (options.useDepth === undefined) ? true : options.useDepth;

	if(!options.glsl && SQR.GLSL) {
		if(options.use2dTextures) 
			options.glsl = SQR.GLSL['shaders/skybox-2d.glsl'];
		else 
			options.glsl = SQR.GLSL['shaders/skybox-cube.glsl'];
	}

	if(!options.glsl) throw "Missing shader code. Pass GLSL string as 2nd argument or include sqr-glsl.js to use the default one.";

	var skybox = new SQR.Transform();

	

	var shader = SQR.Shader(options.glsl);

	
	if(options.use2dTextures) {

		var planeOptions = { zUp: true };
		var s = options.size;

		var side = function(name, o) {
			var f = new SQR.Transform('front');
			f.shader = shader;
			f.useDepth = options.useDepth;
			f.buffer = SQR.Primitives.createPlane(s, s, 1, 1, 0, 0, o);
			return f;
		}

		var front = side('front', planeOptions);
		front.position.z = s * -0.5;

		var back = side('back', planeOptions);
		back.position.z = s * 0.5;
		back.rotation.y = Math.PI;

		var left = side('left', planeOptions);
		left.position.x = s * -0.5;
		left.rotation.y = Math.PI * -0.5;

		var right = side('right', planeOptions);
		right.position.x = s * 0.5;
		right.rotation.y = Math.PI * 0.5;

		var up = side('up');
		up.position.y = s * 0.5;

		var down = side('down');
		down.position.y = s * -0.5;
		down.rotation.x = Math.PI;

		skybox.add(front, back, left, right, up, down);

		skybox.setTexture = function(f) {
			if(!f) return;
			front.uniforms = { uTexture: SQR.Texture(f.front) };
			back.uniforms = { uTexture: SQR.Texture(f.back) };
			left.uniforms = { uTexture: SQR.Texture(f.left) };
			right.uniforms = { uTexture: SQR.Texture(f.right) };
			up.uniforms = { uTexture: SQR.Texture(f.up) };
			down.uniforms = { uTexture: SQR.Texture(f.down) };
		}

	} else {

		var s = options.size;

		skybox.buffer = SQR.Primitives.createCube(s, s, s, { reverseNormals: true });
		skybox.shader = shader;
		skybox.useDepth = options.useDepth;

		skybox.setTexture = function(f) {
			if(!f) return;
			skybox.cubemap = SQR.Cubemap(f);
			skybox.shader.use().setUniform('uCubemap', skybox.cubemap);
		}
	} 

	if(options.faces) skybox.setTexture(options.faces);

	return skybox;
}






















