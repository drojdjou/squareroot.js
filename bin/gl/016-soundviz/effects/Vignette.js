var Vignette = function(engine) {

    var vignette = new SQR.PostEffect("016-soundviz/glsl/Vignette.glsl");
	// var vignette = new SQR.PostEffect("glsl/passThru.glsl");

    this.use = function() {
        engine.setClearColor(0.0, 0.0, 0.0, 1);
    }


    var beatTarget = 0, beat = 0;


    this.onBeat = function() {
        beatTarget = 1;
    }

	this.render = function(target, root, camera) {
        // engine.render(root, camera);

        beat += (beatTarget - beat) * 0.2;
        beatTarget *= 0.8;

        vignette.renderer.u.uTime = SQR.Time.time;
        vignette.renderer.u.uBeat = beat;

        vignette.setSource(target);
        engine.render(vignette, null);
	}
}