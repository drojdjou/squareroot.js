var GlowChromaticDist = function(engine) {

    var dayTime = 0, timeSpeed = 0.003;

	var blurForce = 0.015;
    var glowForce = 1.5;
    var beat = 0, beatTarget = 0;

    var blurTargetA1 = engine.createFrameBuffer();
    var blurTargetA2 = engine.createFrameBuffer();


    var blur = new SQR.PostEffect("glsl/StrongBlur.glsl");
    blur.renderer.u.uMult = glowForce;

    var glow = new SQR.PostEffect("glsl/GlowChroma.glsl");

    this.use = function() {
        engine.setClearColor(0.0, 0.0, 0.0, 1);
    }

    this.onBeat = function() {
        beatTarget = 1;
    }

	this.render = function(target, root, camera) {

        dayTime += timeSpeed;
        var dayTimeCycle = Math.sin(dayTime) * 0.5 + 0.5; // [0-1]
        // dayTimeCycle = dayTimeCycle * 7 - 3;
        dayTimeCycle = Math.max(0, dayTimeCycle);
        dayTimeCycle = Math.min(1, dayTimeCycle);

        var bf = blurForce * dayTimeCycle;

        blur.renderer.u.delta = [0, bf];
        blur.setSource(target);
        engine.render(blur, null, { target: blurTargetA1 });

        blur.setSource(blurTargetA1);
        blur.renderer.u.delta = [bf, 0];
        engine.render(blur, null, { target: blurTargetA2 });

        glow.setSource(target);
        glow.renderer.u.uBlurTexture = blurTargetA2.texture;
        engine.render(glow, null);

        glow.renderer.u.uBeat = beat;
	}
}