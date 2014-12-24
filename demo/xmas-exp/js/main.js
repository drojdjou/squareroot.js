var init = function() {

	initBtn.style.display = 'none';
	desc.style.display = 'none';
	cameraPrompt.style.display = 'block';

	// SQR.shaderPath = '../../html/src/glsl/'

	SQR.Loader.loadAssets([
		// '~light/sphar-cathedral.glsl',
		// '~light/sphar.glsl',
		'webcam',
		'glsl/reflection.glsl',
		'glsl/reflection-simple.glsl',
		['glsl/depth.glsl', 'depth'],
		['glsl/bokeh.glsl', 'bokeh'],
		['glsl/line.glsl', 'line'],
		['glsl/branch.glsl', 'branch-shader'],
		['glsl/sky.glsl', 'sky-shader'],
		['assets/sky-ramp.png', 'sky-ramp'],
	], function(assets) {

        var w = window.innerWidth, h = window.innerHeight;

        cameraPrompt.style.display = 'none';

        document.querySelector("#song").play();
        document.querySelector("#curtain").style.webkitAnimation = "fade-out 4s ease-out forwards";

        var ctx = SQR.Context('#gl')
            .create({ preserveDrawingBuffer: true })
            .size(w, h);

        var webcam = assets['webcam'];
		var webcamTexture = SQR.Texture(webcam);
		var decoTexture = SQR.Texture(StarTexture(), { wrap: SQR.gl.REPEAT });
		var skyRampTexture = SQR.Texture(assets['sky-ramp']);
		var noiseTexture = SQR.Texture(SQR.TextureGenerator.noise(512));
		var faceTracker = FaceTracker(webcam, document.querySelector('#overlay'));

        var renderer = new SQR.Renderer(ctx);
    	renderer.projection = new SQR.ProjectionMatrix().perspective(60, w/h, 1, 1000);

    	var depthShader = SQR.Shader(assets['depth'])
	        .use()
	        .setUniform('uProjection', renderer.projection)
	        .setUniform('uNear', 30)
	        .setUniform('uFar',  120);  

	    var depthFBO = SQR.FrameBuffer(w, h);    
	    var rawFBO = SQR.FrameBuffer(w, h);    
	    var bokeh = SQR.PostEffect(assets['bokeh']);
	        
    	var resize =function() {
        	w = window.innerWidth, h = window.innerHeight;
            ctx.size(w, h);
            renderer.projection = new SQR.ProjectionMatrix().perspective(60, w/h, 1, 1000);
            depthFBO.resize(w, h);
            rawFBO.resize(w, h);
            bokeh.shader.use().setUniform('uScreenSize', [w, h, w/h]);
            depthShader.use().setUniform('uProjection', renderer.projection);
        }

        window.addEventListener('resize', resize);
        resize();

    	var camera = new SQR.Transform();
    	camera.position.z = 50;

    	var buffer = SQR.Primitives.createSphere(20, 40, 20).update();
        var shader = SQR.Shader(assets['glsl/reflection.glsl'])
			        .use()
			        .setUniform('uTexture', webcamTexture)
			        .setUniform('uDecoTexture', decoTexture)
			        .setUniform('uNoiseTexture', noiseTexture)
			        .setUniform('uLight', new SQR.V3(1, 1, -1).norm())
			        .attribPointers(buffer);

		var tipShader = SQR.Shader(assets['glsl/reflection-simple.glsl'])	    

		shader.uniforms = { 'uEyePosition': camera.globalPosition };
		tipShader.uniforms = { 'uEyePosition': camera.globalPosition };

        var root = new SQR.Transform();
        var camRoot = new SQR.Transform();
        root.add(camRoot);
        camRoot.add(camera);

        var refCamera = new SQR.Transform();
        refCamera.rotation.y = Math.PI;
        root.add(refCamera);

        var decoHolder = new SQR.Transform();
        decoHolder.bounceSpeed = 0.03;
        decoHolder.bouncePhase = 0;
        decoHolder.bounceMax = 0.1;
        decoHolder.position.set(-15 , 40, -5);
        root.add(decoHolder);

        var t = new SQR.Transform();
        t.buffer = buffer;
        t.shader = shader;
        t.position.y = -40;
        decoHolder.add(t);

        var c = new SQR.Transform();
        c.buffer = SQR.Primitives.createCylinder(5, 3, 10).update();
        c.shader = tipShader;
        c.rotation.z = Math.PI * 0.5;
        c.position.y = -20;
        decoHolder.add(c);


        var l = new SQR.Transform();
        l.shader = SQR.Shader(assets['line']);
        l.shader.uniforms = { 'uColor': [0, 0, 0] };
        var lb = SQR.Buffer()
            .layout({ aPosition: 3 }, 3)
            .setMode(SQR.gl.LINE_STRIP);

        lb.set('aPosition', 0, new SQR.V3(-1,  20, 0));
        lb.set('aPosition', 1, new SQR.V3( 0,  0,  0));
        lb.set('aPosition', 2, new SQR.V3( 1,  20, 0));

        lb.update();
        l.buffer = lb;
        l.position.y = -20;
        decoHolder.add(l);




        var tree = new SQR.Transform();
        root.add(tree);
        tree.position.set(-70, 0, 0);

        var sky = new SQR.Transform();
        sky.buffer = SQR.Primitives.createSphere(20, 40, 20, { reverseNormals: true }).update();
        sky.shader = SQR.Shader(assets['sky-shader'])
        			.use()
        			.setUniform('uTexture', skyRampTexture);
        sky.scale.set(20, 20, 20);
        root.add(sky);
        
        var branchShader = SQR.Shader(assets['branch-shader']);
        var branchTemplate = Branch(branchShader);

        var addBranch = function(tx, ty, tz, rx, ry, rz, s) {
        	var b = new SQR.Transform();
        	b.buffer = branchTemplate.buffer;
        	b.shader = branchShader;
        
        	b.bounceBase = rx;
        	b.bounceSpeed = 0.02 + 0.01 * Math.random();
        	b.bouncePhase = SQR.TWOPI * Math.random();
        	b.bounceMax = 0.02;

        	s = s || 1;

        	b.position.set(tx, ty, tz);
        	b.rotation.set(rx, Math.PI * 0.5 + ry, rz);
        	b.scale.set(s, s, s);
        	
        	tree.add(b);
        }

        
        addBranch(0, -20, 0,		-0.2, 0.35, 0,   3.2);
        addBranch(0, -30, 10,		0.1, -0.5, 0,   3.1);

        addBranch(0, -10, 0,		-0.1, -0.3, 0,   3.0);
        addBranch(0,   0, 0,		-0.3, -0.8, 0,   3.3);

        addBranch(0,  -8, 0,		-0.3, -0.6, 0,   3.1);
        addBranch(0,   3, 0,		-0.1, -1.4, 0,   3.2);

        addBranch(-10,  20, 0,		-0.2, 0, 0,   3.2);
        addBranch(0,  10, 0,		0.2, -1, 0,   3.1);

        addBranch(-20,  20, -10,		0.2, -1.4, 0,   3.2);
        addBranch(-20,  10, -10,		-0.7, -0.8, 0,   3.3);


        addBranch(60,  57, -40,		-0.7, 1.2, 0,   3.3);

  //       document.addEventListener('keydown', function(e) {
		// 	if(e.keyCode == 32) {
		// 		var url = ctx.canvas.toDataURL();
		// 		var link = document.querySelector('#download');
		// 		link.setAttribute('href', url);
		// 		var event = new Event('click');
		// 		link.dispatchEvent(event);
		// 		document.body.appendChild(image)
		// 	}
		// });

        var bounce = function(t) {
        	t.bouncePhase += t.bounceSpeed;
        	t.rotation.x = t.bounceBase + Math.sin(t.bouncePhase) * t.bounceMax;


        }

        var adjustToFace = function() {
        	faceTracker.detect();
			// camRoot.rotation.x = 0.4 * faceTracker.facePos.y * -1;
			camRoot.rotation.y = 0.6 * faceTracker.facePos.x;
			t.rotation.y = -0.4;// + 0.6 * faceTracker.facePos.x;
        }
		
		var render = function() {
			requestAnimationFrame(render);
			adjustToFace();
			decoHolder.rotation.z = Math.sin(decoHolder.bouncePhase) * decoHolder.bounceMax;
			decoHolder.bouncePhase += decoHolder.bounceSpeed;
			tree.recurse(bounce, true);

			depthFBO.bind();
			ctx.clearColor(0, 0, 0, 1).clear();
			renderer.render(root, camera, { replacementShader: depthShader });

			rawFBO.bind();
			ctx.clearColor(0, 0, 0, 1);
			renderer.render(root, camera);

			renderer.renderToScreen();
			ctx.gl.viewport(0, 0, w, h);
			bokeh.shader.use();
			bokeh.shader.setUniform('uTexture', rawFBO.texture);
			bokeh.shader.setUniform('uDepthTexture', depthFBO.texture);
			renderer.render(bokeh);
		}



		render();
	});
};

var cameraPrompt = document.querySelector('#camera-prompt');
var initBtn = document.querySelector('#init-btn');
var desc = document.querySelector('#desc');

cameraPrompt.style.display = 'none';

initBtn.addEventListener('click', init);