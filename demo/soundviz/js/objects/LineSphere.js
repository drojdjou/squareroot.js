var LineSphere = function(engine) {

	var beatBump = 0, beatBumpTarget = 0;
	var beatRotation = 0;

    var damp = 1, dampTarget = 1, dampFriction = 0.85, dampK = 0.15, dampVel = 0;

	var shader = engine.createShader();
    shader.load("glsl/LineSphere.glsl");

	var sphere = new SQR.Transform();
	sphere.geometry = new LineSphereGeometry().create(3000, 20, 2);
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

    // var temq = SQR.Quaternion();
    var tmp = new SQR.V3(), down = new SQR.V3(0, 1, 0);

    this.update = function(sound, camera, leap) {

        var manualControl = leap.isActive;
        dampTarget = (leap.isActive) ? leap.handOpen : 1;

        // if(manualControl) {
            // temq.fromAxisAngle
            // var n = leap.hand.palmNormal;
            // tmp.set(n[0], n[1], n[2]);
            // tmp.neg();
            // sphere.lookInDirection(tmp);
        // } else {
            var br = beatRotation * Math.min(1, damp);
            sphere.rotation.x += 0.0023 + br * 0.35;
            sphere.rotation.y += 0.0027 + br * 0.35;
            sphere.lookInDirection(null);
        // }
        

    	sphere.geometry.refresh(sound.levelsData, damp);

    	sphere.renderer.u.uTime = SQR.Time.time * 3;

        var s = (1 + beatBump) * (0.6 + 0.4 * Math.max(0.0, damp));
    	sphere.scale.set(s, s, s);

    	beatBump += (beatBumpTarget - beatBump) * 0.1;
    	beatRotation *= 0.9;
    	beatBumpTarget *= 0.9;

        if(manualControl) {
            damp += (dampTarget - damp) * 0.1; 
        } else {
            var acc = (damp - dampTarget) * -dampK;
            dampVel += acc;
            dampVel *= dampFriction;
            damp += dampVel;
        }
    }

    this.object = sphere;
}