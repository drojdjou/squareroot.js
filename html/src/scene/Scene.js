SQR.Scene = function(renderer, options) {

	// If this is a scene coming from unity we need to flip the matrix
	// TODO: this doesn't play well with the WebVR thing btw....
	SQR.flipMatrix = (options && options.flipMatrix) ? options.flipMatrix : false;

	var sc = {
		cameras: [],
		renderer: renderer
	};

	var shaders = {};

	var basicSetup = function() {
		sc.sceneData.ambient = SQR.Color(sc.sceneData.ambient);
		sc.sceneData.background = SQR.Color(sc.sceneData.background);
		if(sc.renderer) sc.renderer.clearColor(sc.sceneData.background);
		
	}

	var loadTextures = function(onLoaded) {

		var td = sc.sceneData.textures;
		var path = sc.sceneData.path;
		var texturesToLoad = 0;
		var byPath = {};

		for(var n in td) {
			var t = td[n];
			texturesToLoad++;

			var tf = (function() {
				var nr = n;
				return function(img) {
					if(img) td[nr].texture = SQR.Texture(img);
					else console.warn('Texture not found: ', td[nr].file);
					texturesToLoad--;
					if(texturesToLoad == 0) onLoaded();
				}

			})();

			SQR.Loader.loadImage(path + t.file, tf, tf);
		};
	}

	var getShader = function(m) {
		var shader = sc.shaders[m.type];
		if(!shader && m.uTexture) shader = sc.shaders['textured'];
		if(!shader) shader = sc.shaders['default'];
		return shader;
	}

	var setupMaterials = function() {
		var md = sc.sceneData.materials, sh = sc.shaders;
		for(var n in md) {
			var m = md[n];
			m.shader = getShader(m);
			if(m.uColor) m.uColor = SQR.Color(m.uColor);
			if(m.uTexture) m.uTexture = sc.sceneData.textures[m.uTexture].texture;

			m.uAmbient = sc.sceneData.ambient;
		}
	}

	var setupLights = function() {
		var ls = sc.sceneData.lights;
		for(var n in ls) {
			var l = ls[n];
			l.color = SQR.Color(l.color);
		}
	}

	var createBuffers = function() {
		var ms = sc.meshData;
		for(var n in ms) {
			ms[n] = SQR.Mesh.fromJSON(ms[n]);
		}
	}

	var createTransforms = function() {
		var root = new SQR.Transform('root');
		sc.root = root;

		var tds = sc.sceneData.transforms;

		for(var n in tds) {
			var td = tds[n];
			var tr = new SQR.Transform(td.name, td.uid);

			tr.position.copyFrom(td.position);

			if(sc.sceneData.quaternions) {
				tr.quaternion.copyFrom(td.rotation);
				tr.useQuaternion = true;
			} else {
				tr.rotation.copyFrom(td.rotation);
			}

			if(td.scale) tr.scale.copyFrom(td.scale);

			if(td.meshId) tr.buffer = sc.meshData[td.meshId];

			if(td.material) {
				var m = sc.sceneData.materials[td.material];
				tr.shader = m.shader;
				tr.uniforms = m;
			}

			if(td.camera) {
				var c = sc.sceneData.cameras[td.camera];
				var a = window.innerWidth / window.innerHeight;
				tr.projection = new SQR.ProjectionMatrix().perspective(c.fov, a, c.near, c.far);
				sc.cameras.push(tr);
			}

			if(td.parent) {
				root.findById(td.parent).add(tr);
			} else {
				root.add(tr);
			}

		}
	}

	sc.data = function(m, s, a) {
		sc.meshData = m;
		sc.sceneData = s;
		sc.animationData = a;
		return sc;
	} 

	sc.shaders = function(s) {
		sc.shaders = s;
		return sc;
	}

	sc.create = function(onReady) {

		basicSetup();
		loadTextures(function() {

			setupLights();
			setupMaterials();
			createBuffers();
			createTransforms();
			if(onReady) onReady();

		});

		return sc;
	}

	return sc;
}








