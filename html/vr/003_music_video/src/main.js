var onData = function(data) {

	var $ = {
		data: data
	};

	$.lib = MV.createLibrary($);
	$.tmn =  MV.createTimeline($);
	
	$.root = new SQR.Transform();
	$.context = SQR.Context('#gl-canvas').create().clearColor(0, 0, 0, 1);
	$.renderer = SQR.Renderer($.context);

	$.camRoot = new SQR.Transform();
	$.camera = new SQR.Transform();
	$.target = new SQR.Transform();
	$.target.position.z = -30;

	$.camRoot.add($.camera);
	$.root.add($.camRoot);
	$.root.add($.target);
	
	$.texDebug = EXT.select('#texture-debug');

	// Add common assets to loading list
	$.lib.scheduleLoad('../../src/glsl/animation/bones.glsl', 'bones');
	$.lib.scheduleLoad('../../src/glsl/light/sphar.glsl', 'sphar');
	$.lib.scheduleLoad('../../src/glsl/light/sphar-sunset.glsl', 'sphar-data');

	// Initiaize / add all the classes to the library
	MV.Skybox($);
	MV.Bird($);

	var mx = 0, my = 0, tx = 0, ty = 0;

	document.addEventListener('mousemove', function(e) {
		ty = (e.pageX / window.innerWidth) * 2 - 1;
		tx = (e.pageY / window.innerHeight) * 2 - 1;
	});

	var onAssetsProgress = function(t) {};

	var onAssets = function(assets) {
		$.assets = assets;
		SQR.VRApp(init);
	};

	var init = function(options) {

		// Some more init stuff
		$.tmn.addTrigger(MV.STARTUP_EVENT);

		options.customCameraAnimation = function() {
			mx += (tx - mx) * 0.02;
			my += (ty - my) * 0.1;
			// $.camRoot.rotation.y += my * 0.02;
			// $.camera.rotation.x = mx;
		}

		options.camRoot = $.camRoot;
		options.target = $.target;
		options.near = 0.01;
		options.far = 50;

		$.vr = SQR.VRPost($.camera, $.renderer, $.context, options);
		window.addEventListener('resize', $.vr.size);
		$.vr.size();
		
		// Initialize all the scenes
		MV.S01($);
		
		// Start rendering
		FrameImpulse.on(render);
		// render();

		// Start the timeline timer
		$.tmn.start();
	};

	var render = function() {
		$.tmn.onUpdate();
		$.vr.render($.root);	
	}

	console.log('Music Video Web VR | build ' + MV.BUILD);
	SQR.Loader.loadAssets($.lib.assetList, onAssets, onAssetsProgress);

};