MV.Skybox = function($) {

	var size = 1;

	var textures = {};

	var createRampTexture = function(name, colors) {

		var w = 16, h = 128;

		var t = new SQR.CanvasRenderer().setSize(w, h);
		var r = SQR.Transform2d();

		r.shape = function(ctx) {

			if(colors instanceof Array) {
				var g = ctx.createLinearGradient(0, 0, 0, h);
				
				for(var i = 0; i < colors.length; i += 2)
					g.addColorStop(colors[i], colors[i+1]);

				ctx.fillStyle = g;
			} else {
				ctx.fillStyle = colors;
			}
			ctx.fillRect(0, 0, w, h)
		}

		t.render(r);

		textures[name] = t;

		// Uncomment to add the texture to DOM
		// $.texDebug.appendChild(t.canvas);
	}

	var s, create = function() {

		for(var sk in $.data.skybox)
			createRampTexture(sk, $.data.skybox[sk]);

		s = new SQR.Transform();

		s.buffer = SQR.Primitives.createCube(size, size, size, { 
			reverseNormals: true
		});

		s.useDepth = false;
		s.shader = SQR.Shader($.assets.skyboxShader);

		s.shader.use().setUniform('uSize', size);
		s.shader.use().setUniform('uDark', 0);

		s.shader.use().setUniform('uRamp1', SQR.Texture(textures.night.canvas));
		s.shader.use().setUniform('uRamp2', SQR.Texture(textures.day.canvas));

		s.uniforms = {
			uDayTime: 0.0
		};

		// var dt = 0;
		// s.beforeDraw = function() { s.uniforms.uDayTime = (Math.sin(dt) + 1) / 2; dt += 0.01; };

		return s;
	}

	$.lib.scheduleLoad('glsl/skybox.glsl', 'skyboxShader');

	$.lib.register('skybox', function() {
		return s ? s : create();
	});
};