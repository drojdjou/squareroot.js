var StrechingCube = function(engine) {

	var shader = engine.createShader();
    shader.load("glsl/Normal2color.glsl");

    var crx = 0, cry = 0, beat = 0;

	var cube = new SQR.Transform();
    cube.geometry = new SQR.Cube().create(35, 35, 35);
    cube.renderer = engine.createRenderer(shader);
    cube.renderer.u.uColor = [0, 0.5, 0, 1];

    cube.geometry.cornersOrig = {};

    cube.rotation.x = Math.PI * 0.25;
    cube.rotation.y = Math.PI * 0.25;

    for(var c in cube.geometry.corners) {
        cube.geometry.cornersOrig[c] = cube.geometry.corners[c].clone();
        cube.geometry.corners[c].value = 0;
        cube.geometry.corners[c].speed = 0.001 + Math.random() * 0.001;
        cube.geometry.corners[c].phase = Math.PI * Math.random();
    }

    this.use = function() {
    }

    this.dispose = function() {
    }

    this.onBeat = function() {
    	if(beat < 0) {
            beat = 1;
            crx = cube.rotation.x;
            cry = cube.rotation.y;
        } else {
            // beat += 1;
        }
    }

    this.update = function(sound) {

    	if(beat > 0) {
            cube.rotation.x = crx + Math.PI * 0.5 * SQR.Interpolation.smoothStep(0, 1, 1 -beat);
            cube.rotation.y = cry + Math.PI * 0.5 * SQR.Interpolation.smoothStep(0, 1, 1- beat);
        }

        beat -= 0.04;

        var b = 0;

        for(var c in cube.geometry.corners) {
            var p = cube.geometry.corners[c];
            var l = sound.levelsData[b % sound.levelsCount];
            p.value = Math.max(l, p.value);
            p.copyFrom(cube.geometry.cornersOrig[c]);
            p.mul(1.4 + Math.sin(p.phase) * 0.6);
            p.phase += p.speed + p.value / 3;
            p.value *= 0.92;
            b++;
        }

        cube.geometry.refresh();
    }

    this.object = cube;
}