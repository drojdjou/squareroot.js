var DepthOfField = function(engine) {

	

    var blurTargetA1 = engine.createFrameBuffer();
    var blurTargetA2 = engine.createFrameBuffer();

    var depthTarget = engine.createFrameBuffer();
    var depthBlurTarget = engine.createFrameBuffer();

    var invert = new SQR.PostEffect("glsl/simpleFx.glsl");
    var blur = new SQR.PostEffect("glsl/blur.glsl");
    var preview = new SQR.PostEffect("glsl/passThru.glsl");

    var depth = engine.createShader();
    depth.load("glsl/depth.glsl");
    depth.u.near = 70;
    depth.u.far =  110;

    var depthField = new SQR.PostEffect("glsl/depthOfField.glsl");
    depthField.renderer.u.uBlurTexture = blurTargetA2.texture;
    depthField.renderer.u.uDepthTexture = depthTarget.texture;

    this.use = function() {
        engine.setClearColor(0.0, 0.0, 0.0, 1);
    }

    var blurForce = 0.075;

    this.onBeat = function() {
    }

	this.render = function(target, root, camera) {

        blur.renderer.u.delta = [0, blurForce];
        blur.setSource(target);
        engine.render(blur, null, { target: blurTargetA1 });

        blur.setSource(blurTargetA1);
        blur.renderer.u.delta = [blurForce, 0];
        engine.render(blur, null, { target: blurTargetA2 });

        engine.render(root, camera, { target:depthTarget, replacementShader: depth });

        preview.setSource(depthTarget);

        depthField.setSource(target);
        engine.render(depthField, null);
	}
}