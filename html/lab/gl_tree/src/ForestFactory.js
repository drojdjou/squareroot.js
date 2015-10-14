ForestFactory = function(assets, camera, options) {

	var treeCount = 0;

	var ff = {
		end: options.end
	};

	var treeShader = SQR.Shader(assets.treeMesh)
		.use()
		.setUniform('uFogStart', 0)
		.setUniform('uFogEnd', options.end)
		.setUniform('uColor', options.treeColor)
		.setUniform('uDarkness', options.nightColor);

	ff.treeTemplates = [];
	ff.patches = [];
	ff.shader = treeShader;


	var addTreeTemplate = function() {
		var ts = SQR.Tree({
			depth: Simplrz.touch ? 2 : 3,
			branches: 3,
			branchProbability: 0.8,
			branchLength: [2, 4],
			trunkLength: [3, 8],
			lengthDepthFactor: 0.8,
			angleDepthFactor: 0.3,
			branchAngle: [0.25, 0.50],
			branchDeviation: Math.PI,

			baseWidth: 0.35,
			branchWidth: 0.3,
			widthDepthFactor: 0.5,
			branchSides: Simplrz.touch ? 3 : 6
		});


		var buffer = ts.toMesh({ perVertexNormal: true });
		ff.treeTemplates.push(buffer);
	}

	var getColor = function() {
		var c = 0.1 * Math.random(); 

		var r = 0.30;
		var g = 0.20;
		var b = 0.15;

		var f = 0.5;

		return [(0.3 + c/1) * f, (0.2 + c/2) * f, (0.15 + c/4) * f];
	}

	var makeTree = function() {

		var s = options.patchWidth;
		var xr = options.alleyWidth + Math.random() * s / 2;
		var xd = Math.random() > 0.5 ? 1 : -1;

		var x = xr * xd;
		var z = options.patchDepth * Math.random();

		var ri = ff.treeTemplates.length * Math.random() | 0;
		var tree = new SQR.Transform();
		
		tree.shader = treeShader;
		tree.uniforms = {
			'uColor': getColor()
		};

		tree.buffer = ff.treeTemplates[ri];

		tree.position.set(x, 0, z);
		tree.rotation.y = Math.random() * SQR.TWOPI;
		tree.rotation.z = Math.random() * 0.2 - 0.1;

		treeCount++;

		return tree;
	}

	var addPatch = function() {

		var p = new SQR.Transform();
		
		// p.isStatic = true;

		p.beforeDraw = function(t) {
			if((t.position.z - 0) - camera.position.z > 0) {
				t.position.z -= options.numPatches * options.patchDepth;
				t.position.x = -1 + Math.random() * 2;
			}
		}

		for(var i = 0; i < options.numTrees; i++) {
			p.add(makeTree());
		}

		SQR.GeometryTools.batch(p);

		p.position.z = ff.patches.length * options.patchDepth * -1;
		ff.patches.push(p);
	}


	for(var i = 0; i < options.numTemplates; i++) addTreeTemplate();
	for(var i = 0; i < options.numPatches; i++) addPatch();

	console.log('Forest: ', treeCount, ' trees');

	return ff;
}





