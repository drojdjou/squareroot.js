SQR.SceneParser = (function() {

	var skinnedMeshLayout = function() { return { aPosition: 3, aNormal: 3, aUV: 2, aWeight: 4, aIndex: 4 } };

	var arrayToObject = function(a, v) {
		v.x = a[0];
		v.y = a[1];
		v.z = a[2];
		if(v.w) v.w = a[3];
	}

	return {

		parse: function(assets, options) {

			var prefix = options.prefix || '';
			var scene = assets[prefix + 'scene'];
			var meshes = assets[prefix + 'mesh'];
			var anim = assets[prefix + 'anim'];

			if(options.context) {
				var bc = scene.background;
				options.context.clearColor(bc.r, bc.g, bc.b);
			};

			var getDefaultShader = (function() {
				var d;
				return function() {
					if(!d) d = SQR.Shader(options.shader);
					return d;
				}
			})();

			// If this is a scene coming from unity we need to flip the matrix
			// TODO: this doesn't play well with the WebVR thing btw....
			SQR.flipMatrix = (options && options.flipMatrix) ? options.flipMatrix : false;

			var buffers = {}, bufferByName = {};
			var skinnedMeshes = [];
			var animations = {};

			for(var n in meshes) {
				var md = meshes[n];

				var layout = md.boneWeights ? skinnedMeshLayout() : SQR.v3n3u2();

				var b = SQR.Mesh.fromJSON(md, null, { layout: layout });
				buffers[n] = b;
				bufferByName[md.name] = b;
			}

			for(var m in scene.materials) {
				var mat = scene.materials[m];
				mat.color = SQR.Color().setRGB(mat.color.r, mat.color.g, mat.color.b);
			}

			var root = new SQR.Transform();
			var camera;
			var ts = scene.transforms;

			ts.forEach(function(td) {
				var t = new SQR.Transform(td.name, td.uid);
				t.useQuaternion = true;
				arrayToObject(td.position, t.position);
				arrayToObject(td.rotation, t.quaternion);

				t.data = td;
				if(td.bones) skinnedMeshes.push(t);

				if(td.camera) {
					camera = t;
					var cd = scene.cameras[td.camera];

					var resize = function() {
						var w = window.innerWidth, h = window.innerHeight, aspect = w/h;
						camera.projection = new SQR.ProjectionMatrix().perspective(cd.fov, aspect, cd.near, cd.far);
					}

					window.addEventListener('resize', resize);
					resize();
				}

				if(td.mesh) {
					t.buffer = buffers[td.meshId];
					
				}

				
				if(td.renderer) {

					// we will deal with skinned meshes below
					if(!td.bones) t.shader = getDefaultShader();

					t.uniforms = t.uniforms || {};
					t.uniforms.uColor = scene.materials[td.renderer].color;
					
				}

				if(td.parent) {
					root.findById(td.parent).add(t);
				} else {
					root.add(t);
				}
			});

			skinnedMeshes.forEach(function(s) {
				var bs = s.data.bones, bst = [], numBones = bs.length;
				
				bs.forEach(function(id) {
					bst.push(root.findById(id));
				});

				bst[0].setAsBoneRoot();

				var boneMatrices = [];

				s.shader = SQR.Shader(options.shader, {
					directives: [
						{ name: 'NUM_BONES', value: numBones },
						{ name: 'BONE_PER_VERTEX', value: 4 }
					]
				});

				s.beforeDraw = function() {

					for(var i = 0; i < numBones; i++) {
						boneMatrices[i] = bst[i].computeBoneMatrix();
					}

					s.shader.use().setUniform('uBones', boneMatrices);
				}
			});

			for(var id in anim) {

				var data = anim[id];

				animations[id] = {
					duration: data.length,
					transforms: {}
				};

				for(var c in data.curves) {

					animations[id].transforms[c] = {
						properties: {}
					};

					for(var p in data.curves[c]) {
						var keyframes = [];
						var d = data.curves[c][p];

						if(options.linearAnimation) {
							for(var i = 0; i < d.keys.length; i += 4) {
								var a = d.keys[i + 0];
								var b = d.keys[i + 1];
								keyframes.push(new SQR.V2(a, b));								
							}
						} else {
							for(var i = 0; i < d.keys.length - 4; i += 4) {
								var k1t = d.keys[i+0];
								var k1v = d.keys[i+1];
								var k1o = d.keys[i+3];

								var k2t = d.keys[i+4];
								var k2v = d.keys[i+5];
								var k2i = d.keys[i+6];
								
								var start = new SQR.V2(k1t, k1v);
								var end = new SQR.V2(k2t, k2v);

								var dt = (end.x - start.x) / 3.0;
								var st = new SQR.V2( dt,  dt * k1o).add(start);
								var et = new SQR.V2(-dt, -dt * k2i).add(end);

								keyframes.push(new SQR.Bezier(start, st, et, end));
							}
						}

						animations[id].transforms[c].properties[p] = keyframes;
					}
				}
			}

			root.recurse(function(t) {
				if(t.data && t.data.animationId) {
					var id = t.data.animationId;
					var data = animations[id];

					// Aniation file is missing or was not exported, abort.
					if(!data) return;

					t.animation = SQR.Animation(data.duration);

					for(var cn in data.transforms) {
						var c = t.findByPath(cn);
						c.clip = SQR.Clip(data.duration);
						t.animation.addClip(c.clip);

						for(var p in data.transforms[cn].properties) {
							c.clip.addProperty(p, data.transforms[cn].properties[p]);
						}
					}

					if(options.autoPlay) t.animation.play();
				};
			}, true);

			return {
				root: root, camera: camera, buffers: bufferByName
			};
		}

	}

})();