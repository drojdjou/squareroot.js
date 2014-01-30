var SkyscraperLane= function(engine) {

    var dayTime = 0, timeSpeed = 0.005;

	var buildingShader = engine.createShader();
    buildingShader.load("016-soundviz/glsl/Skyscraper.glsl");

    var horizonShader = engine.createShader();
    horizonShader.load("016-soundviz/glsl/Horizon.glsl");

    var radius = 300;
    var bank = 0, shake = 0;

    var beatLight = 0, beatLightTarget = 0;
    var beatSpeed = 0;
    var shakeSpeed = 0;

    var shakeTimeout, shakeLock;

    var buildings = [];

	var base = new SQR.Transform();
    base.position.set(0, -(radius + 10), 220);

    var scene = new SQR.Transform();
    scene.add(base);

    var horizon = new SQR.Transform();
    horizon.renderer = engine.createRenderer(horizonShader);
    horizon.geometry = new SQR.Plane({ zUp:true, quads:true }).setSize(2000, 700);
    horizon.position.z = -600;

    var displaceVectors = function(g) {
        var vl = g.vectors.length;
        for(var i = 0; i < vl; i++) {
            g.vectors[i].z = Math.random() * -20;
        }
        g.refresh();
    }

    displaceVectors(horizon.geometry);

    horizon.rotation.x = Math.PI;
    
    var makeRow = function(center, numBld) {

        var oposite = center.clone();//.neg();

        for(var i = 0; i < numBld; i++) {

            var bld = new SQR.Transform();
            bld.geometry = new SQR.Skyscraper().setSize(10 + Math.random() * 20, 10 + Math.random() * 20, 1, 0, 0, 0.5);
            bld.renderer = engine.createRenderer(buildingShader);
            bld.buildingHeight = 0;
            bld.buildingBaseHeight = 24 + Math.random() * 10;
            bld.buildingHeightTarget = 0;
            bld.maxHeight = 1 + Math.random() * 20;
            bld.rotation.z = Math.random();
            var c = 0.3 + Math.random() * 0.7;
            bld.renderer.u.uWindowColor = [c, 0.2, 1 - c];
            var angle = i / numBld * SQR.twoPI;

            buildings.push(bld);

            var holder = new SQR.Transform();
            holder.lookInDirection(oposite);
            holder.position.set(0, Math.sin(angle) * radius, Math.cos(angle) * radius).appendVec(center);

            base.add(holder);
            holder.add(bld);
        }

    }

    makeRow(new SQR.V3(-35, 0, 0), 50);
    makeRow(new SQR.V3(35, 0, 0), 50);

    makeRow(new SQR.V3(-65, 0, 0), 30);
    makeRow(new SQR.V3(65, 0, 0), 30);

    // makeRow(new SQR.V3(-105, 0, 0), 29);
    // makeRow(new SQR.V3(105, 0, 0), 29);

    this.use = function() {
        camera.add(horizon);
    }

    this.dispose = function() {
        camera.remove(horizon);
    }

	this.onBeat = function(camera) {
        beatLightTarget = 1;
        beatSpeed = 1;

        //if(!shakeLock) {
        //    if(shakeTimeout) clearTimeout(shakeTimeout);
            shakeSpeed = (Math.random() > 0.5) ? -0.8 : 0.8;
        //    shakeLock = true;
        //    shakeTimeout = setTimeout(unlock, 1500);
        //}
    }

    var unlockShake = function() {
        shakeLock = false;
    }

    var dxt = 0, dx = 0;
    var dyt = 0, dy = 0;
    document.addEventListener('mousemove', function(e) {
        dxt = (e.pageX / window.innerWidth) * 2 - 1;
        dyt = (e.pageY / window.innerHeight);
    });

    document.addEventListener('click', function(e) {
        
    });

    this.update = function(sound, camera) {

        dayTime += timeSpeed;
        var dayTimeCycle = Math.sin(dayTime) * 0.5 + 0.5; // [0-1]
        dayTimeCycle = dayTimeCycle * 5 - 2;
        dayTimeCycle = Math.max(0, dayTimeCycle);
        dayTimeCycle = Math.min(1, dayTimeCycle);
        horizon.renderer.u.uDayTime = dayTimeCycle;


        for(var i = 0; i < buildings.length; i++) {
            var b = buildings[i];
            var h = sound.levelsData[i % sound.levelsCount] * b.maxHeight;

            b.buildingHeightTarget = h;
            b.buildingHeight += (b.buildingHeightTarget - b.buildingHeight) * 0.2;

            var bh = b.buildingBaseHeight + b.buildingHeight * 20;

            b.scale.set(1, 1, bh);
            b.renderer.u.uBuildingHeight = bh * 0.33;
            b.renderer.u.uDayTime = dayTimeCycle;

            b.renderer.u.uBeat = beatLight;
            b.buildingHeightTarget *= 0.9;
        }

        beatLightTarget *= 0.9;

        beatLight += (beatLightTarget - beatLight) * 0.1;
        beatSpeed *= 0.96;

        base.rotation.x -= 0.0008 + beatSpeed * 0.006;

        camera.rotation.x = 0.41 + Math.sin(shake) * 0.005;
        camera.rotation.z = Math.cos(shake) * 0.005;
        // camera.rotation.z = Math.cos(bank) * Math.PI * 0.02 + (1.0 - Math.cos(shake)) * 0.003;
        camera.rotation.y = dx * 0.5;

        dx += (dxt - dx) * 0.2;
        dy += (dyt - dy) * 0.2;

        

        bank += 0.02;
        shake += shakeSpeed;
        shakeSpeed *= 0.95;

    }

    this.object = scene;
}