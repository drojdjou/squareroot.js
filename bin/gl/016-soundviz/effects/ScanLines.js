var ScanLines = function(engine) {

	var beat = 0;

    this.use = function() {
        engine.setClearColor(0.1, 0.2, 0.3, 1);
    }

    var blurTargetA1 = engine.createFrameBuffer();
    var blurTargetA2 = engine.createFrameBuffer();

    var depthTarget = engine.createFrameBuffer();
    var depthBlurTarget = engine.createFrameBuffer();

    var depth = engine.createShader();
    depth.load("glsl/depth.glsl");
    depth.u.far = 100;
    depth.u.near = 60;

    var scanLines = new SQR.PostEffect("016-soundviz/glsl/ScanLines.glsl");
    scanLines.renderer.u.uDepthTexture = depthTarget.texture;
	
	var previewRegionSmall = new SQR.RenderRegion(50, 50, window.innerWidth/5, window.innerHeight/5);

	this.onBeat = function() {
		beat = 1;
	}

	this.render = function(target, root, camera) {

		scanLines.renderer.u.uTime = SQR.Time.time;
		scanLines.renderer.u.uWidth = beat;//SQR.Time.time;

		beat *= 0.9 ;

        engine.render(root, camera, { target:depthTarget, replacementShader: depth });

        scanLines.setSource(target);
        engine.render(scanLines, null);
	}
}