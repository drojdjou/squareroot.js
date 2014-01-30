var LineSphere = function(engine) {

	var beatBump = 0, beatBumpTarget = 0;
	var beatRotation = 0;

	var shader = engine.createShader();
    shader.load("016-soundviz/glsl/LineSphere.glsl");
    // shader.load("glsl/normal2color.glsl");

	var sphere = new SQR.Transform();
	sphere.geometry = new LineSphereGeometry().create(3000, 20, 3);
	sphere.renderer = engine.createRenderer(shader);
	sphere.renderer.renderMode = SQR.GL.LINES;
	sphere.renderer.lineWidth = 2;
	sphere.renderer.transparent = true;

	this.onBeat = function() {
		beatBumpTarget = -0.3;
		beatRotation = 0.05;
    }

    this.use = function() {
    }

    this.dispose = function() {
    }


    this.update = function(sound) {
    	sphere.rotation.x += 0.0019 + beatRotation;
    	sphere.rotation.y += 0.0043 + beatRotation;
    	sphere.geometry.refresh(sound.levelsData);

    	sphere.renderer.u.uTime = SQR.Time.time * 3;

    	sphere.scale.set(1 + beatBump, 1 + beatBump, 1 + beatBump);

    	beatBump += (beatBumpTarget - beatBump) * 0.1;
    	beatRotation *= 0.9;
    	beatBumpTarget *= 0.9;
    }

    this.object = sphere;
}