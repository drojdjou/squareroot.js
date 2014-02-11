var Pyramids = function(engine) {

    var base = new SQR.Transform();

    var SQ2 = Math.sqrt(2);

    var shader = engine.createShader();
    shader.load("glsl/PyramidAO.glsl");

    var pyramids = [];
    var density = 4, size = 20;

    // var gridX = 1, gridY = 1;
    var gridY = 13;
    var gridX = Math.ceil(13 / window.innerHeight * window.innerWidth); 

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

            var mag = (dc.mag() * 2) / SQ2;


            var cr = 1 - mag;
            // var cl = [cr, (1-cr)*0.5, (cr == 1) ? 1 : 0, 1];
            var cl = new SQR.Color().rgb(cr * 0.2 + 0.8, 0.0, 0.0);

            var p = createPyramid(cl);

            p.data = {};

            p.data.centerDistance = Math.min(1, mag);
            p.data.force = 1 - mag;
            p.data.index = Math.floor(mag * (historySize-1));
            p.data.phase = 0;
            p.data.speed = 0.1;
            p.data.distanceVector = dc;
            p.data.handDistTarget = 0;
            p.data.handDist = 0;

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
    	camera.position.y = 445;
    	camera.rotation.x = SQR.halfPI;
    }

    this.dispose = function() {
    }

    var handVec = new SQR.V2(), handToPyramid = new SQR.V2();

    this.update = function(sound, camera, leap) {

        if(leap.isActive) {
            level *= 0.9;
            beat *= 0.9;

            var dx = leap.position.x/ 200;
            var dy = leap.position.z / 200;

            handVec.set(dx, dy);

        } else {
            beat += (beatTarget - beat) * 0.2;
            levelTarget = sound.level;
            level += (levelTarget - level) * 0.02;
            wave += sound.level * 0.2;
            beatWave += 0.05;
        }

    	beatTarget *= 0.9;


    
        impulse.pop();
        impulse.unshift(Math.sin(wave) * (level + beat + 0.1) );


        var pl = pyramids.length;

        for(var i = 0; i < pl; i++) {
            var p = pyramids[i];
            var data = p.data;

            handToPyramid.sub(handVec, data.distanceVector);

            if(leap.isActive) {
                var hdt = handToPyramid.mag() / SQ2;
                hdt = Math.pow(1 - hdt, 4);
                hdt *= 1.4;
                data.handDistTarget = Math.max(hdt, data.handDistTarget);
            }

            data.handDistTarget *= 0.94 ;
            data.handDist += (data.handDistTarget - data.handDist) * 0.9;

            var imp = Math.abs(impulse[data.index]) + data.handDist;

            var h = 20 + imp * 200 * data.force;
            p.geometry.peak.y = h;
            p.geometry.refresh();
            p.renderer.u.uHeight = h;
            p.renderer.u.uColor.blue(imp);
        }

        

        engine.render(root, camera);
    }

    this.object = base;
}
















