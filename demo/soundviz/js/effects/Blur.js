var Blur = function(engine) {

	var dofPhase = 0;
    var blurForce = 0.05;

    var blurTargetA1 = engine.createFrameBuffer();
    var blurTargetA2 = engine.createFrameBuffer();

    var depthTarget = engine.createFrameBuffer();
    var depthBlurTarget = engine.createFrameBuffer();

    var blur = new SQR.PostEffect("glsl/Blur.glsl");
    var preview = new SQR.PostEffect("glsl/PassThru.glsl");

    var depth = engine.createShader();
    depth.load("glsl/Depth.glsl");

    var depthField = new SQR.PostEffect("glsl/DepthOfField.glsl");
    depthField.renderer.u.uBlurTexture = blurTargetA2.texture;
    depthField.renderer.u.uDepthTexture = depthTarget.texture;

    this.use = function() {
        engine.setClearColor(0.0, 0.0, 0.0, 1);
    }

    

    this.onBeat = function() {
        dofPhase = 1;
    }

	this.render = function(target, root, camera) {

        depth.u.near = 50 + (1.0 - dofPhase) * 30;
        depth.u.far =  60 + (1.0 - dofPhase) * 50;
        dofPhase *= 0.9;

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