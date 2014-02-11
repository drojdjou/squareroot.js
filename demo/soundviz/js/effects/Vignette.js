var Vignette = function(engine) {

    var vignette = new SQR.PostEffect("glsl/Vignette.glsl");

    this.use = function() {
        engine.setClearColor(0.0, 0.0, 0.0, 1);
    }


    var beatTarget = 0, beat = 0;


    this.onBeat = function() {
        beatTarget = 1;
    }

	this.render = function(target, root, camera, leap) {
        // engine.render(root, camera);

        var leapDamp = (leap.isActive) ? 0.3 : 1;

        beat += (beatTarget - beat) * 0.2;
        beatTarget *= 0.8;

        vignette.renderer.u.uTime = SQR.Time.time;
        vignette.renderer.u.uBeat = beat * leapDamp;

        vignette.setSource(target);
        engine.render(vignette, null);
	}
}