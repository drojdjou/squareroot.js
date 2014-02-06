var Pyramids = function(engine) {

    var base = new SQR.Transform();

    var shader = engine.createShader();
    shader.load("glsl/pyramidAO.glsl");

    var pyramids = [];
    var density = 4, size = 20;

    var gridX = 19, gridY = 13;
    // var gridX = 17, gridY = 17;

    var unit = Math.sqrt((size * size) / 2) * 2;

    var historySize = 50, wave = 0, friction = 0.999;
    var beat = 0, beatTarget = 0, beatWave = 0, levelTarget = 0, level = 0;

    var impulse = new Array(historySize);

    for(var i = 0; i < historySize; i++) {
        impulse[i] = 0;
        // impulse[i] = Math.sin(i / historySize * SQR.twoPI * 2);
    }

    var createPyramid = function(color) {
        var p = new SQR.Transform();
        p.geometry = new SQR.Pyramid({ noCap:true }).create(size, 0, 0, density, 0);
        p.renderer = engine.createRenderer(shader);
        p.renderer.u.uColor = color;

        base.add(p);

        pyramids.push(p);
        return p;
    }

    var mid = new SQR.V2(0.5, 0.5);

    for(var x = 0; x < gridX; x++) {
        for(var y = 0; y < gridY; y++) {

            var hbx = unit * (gridX-1) / 2;
            var hby = unit * (gridY-1) / 2;

            var dc = new SQR.V2(x/(gridX-1), y/(gridY-1));
            dc.sub(dc, mid);

            var mag = (dc.mag() * 2) / Math.sqrt(2);


            var cr = 1 - mag;
            // var cl = [cr, (1-cr)*0.5, (cr == 1) ? 1 : 0, 1];
            var cl = [cr, 0, 0, 1];

            var p = createPyramid(cl);

            p.data = {};

            p.data.centerDistance = Math.min(1, mag);
            p.data.force = 1 - mag;
            p.data.index = Math.floor(mag * (historySize-1));
            p.data.phase = 0;
            p.data.speed = 0.1;

            p.data.multTarget = 0;
            p.data.mult = 0;

            p.position.x = x * unit - hbx;
            p.position.z = y * unit - hby;
        }
    }


	this.onBeat = function() {
		beatTarget = 1;
		beatWave = 0;
    }

    this.use = function() {
    	camera.position.z = 0;
    	camera.position.y = 450;
    	camera.rotation.x = SQR.halfPI;
    }

    this.dispose = function() {
    }

    this.update = function(sound, camera) {
    	var pl = pyramids.length;

        for(var i = 0; i < pl; i++) {
            var p = pyramids[i];
            var data = p.data;

            // var imp = (impulse[data.index] * 0.5 + 0.5);
            var imp = Math.abs(impulse[data.index]);

            var h = 20 + imp * 200 * data.force;
            p.geometry.peak.y = h;
            p.geometry.refresh();
            p.renderer.u.uHeight = h;

            if(data.centerDistance > 0.01) p.renderer.u.uColor[2] = imp;
            else p.renderer.u.uColor = [imp, imp, imp];
        }

        wave += sound.level * 0.2;
        beatWave += 0.05;

        impulse.pop();
        impulse.unshift(Math.sin(wave) * (level + beat + 0.1) );

        // + Math.sin(beatWave) * beat

        beat += (beatTarget - beat) * 0.2;
        beatTarget *= 0.9;

        levelTarget = sound.level;
        level += (levelTarget - level) * 0.02;

        

        engine.render(root, camera);
    }

    this.object = base;
}
















