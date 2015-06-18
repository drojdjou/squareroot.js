SQR.SceneParser = (function() {

	var skinnedMeshLayout = function() { return { aPosition: 3, aNormal: 3, aUV: 2, aWeight: 4, aIndex: 4 } };

	var arrayToObject = function(a, v) {
		v.x = a[0];
		v.y = a[1];
		v.z = a[2];
		if(v.w) v.w = a[3];
	}

	return {

		parse: function(scene, meshes, options) {

			var defaultShader = SQR.Shader(options.shader);

			// If this is a scene coming from unity we need to flip the matrix
			SQR.flipMatrix = (options && options.flipMatrix) ? options.flipMatrix : false;

			var buffers = {}, bufferByName = {};
			var skinnedMeshes = [];

			for(var n in meshes) {
				var md = meshes[n];

				var layout = md.boneWeights ? skinnedMeshLayout() : SQR.v3n3u2();

				var b = SQR.Mesh.fromJSON(md, null, { layout: layout });
				buffers[n] = b;
				bufferByName[md.name] = b;
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
					if(!td.bones) t.shader = defaultShader;
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

			return {
				root: root, camera: camera, buffers: bufferByName
			};
		}

	}

})();