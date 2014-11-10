var SkyscraperLane= function(engine) {

    var dayTime = 0, timeSpeed = 0.003;

	var buildingShader = engine.createShader();
    buildingShader.load("glsl/Skyscraper.glsl");

    var horizonShader = engine.createShader();
    horizonShader.load("glsl/Horizon.glsl");

    var trafficShader = engine.createShader();
    trafficShader.load("glsl/Traffic.glsl");

    var baseShader =  engine.createShader();
    baseShader.load("glsl/CityStreet.glsl");

    var radius = 300;
    var bank = 0, shake = 0;

    var beatLight = 0, beatLightTarget = 0;
    var beatSpeed = 0;
    var shakeSpeed = 0;

    var shakeTimeout, shakeLock;

    var buildings = [];

	var base = new SQR.Transform();
    base.renderer = engine.createRenderer(baseShader);
    base.renderer.u.uColor = [0, 0, 0];
    base.geometry = new SQR.Cylinder({ vertical: false, perVertextNormals:false, noCaps:true }).create(200, radius, 200);
    base.position.set(0, -(radius + 30), 50);

    var lanes = [], numLanes = 6;
    for(var i = 1; i <= numLanes; i++) {
        var traffic = new SQR.Transform();
        traffic.renderer = engine.createRenderer(trafficShader);

        traffic.renderer.u.uNightColor = (i <= 3) ? [1, 0.75, 0.25] : [1, 0.25, 0];
        traffic.renderer.u.uDayColor = (i <= 3) ? [0.2, 0.2, 0.2] : [0.2, 0.05, 0];

        traffic.renderer.renderMode = SQR.GL.POINTS;
        traffic.geometry = new Freeway().create(500, radius + 0.1, 0.3);
        traffic.speed = (i <= 3) ? -0.0002 * (i * 2) : 0.002 + 0.001 * (3 - Math.floor(i - 3));
        traffic.position.x = (i - 3) * 4;
        base.add(traffic);
        lanes.push(traffic);
    }

    var scene = new SQR.Transform();
    scene.add(base);

    var horizon = new SQR.Transform();
    horizon.renderer = engine.createRenderer(horizonShader);
    horizon.geometry = new SQR.Plane({ zUp:true, quads:false }).create(6000, 2100);
    horizon.position.z = -1800;
    horizon.rotation.x = Math.PI;
    
    var makeRow = function(center, numBld) {

        var oposite = center.clone();//.neg();

        for(var i = 0; i < numBld; i++) {

            var bld = new SQR.Transform();
            bld.geometry = new SQR.Cube().create(10 + Math.random() * 20, 10 + Math.random() * 20, 1, 0, 0, 0.5);
            bld.renderer = engine.createRenderer(buildingShader);
            bld.buildingHeight = 0;
            bld.buildingBaseHeight = 60 + Math.random() * 40;
            bld.buildingHeightTarget = 0;
            bld.maxHeight = 10 + Math.random() * 15;
            bld.rotation.z = Math.random();
            var c = 0.3 + Math.random() * 0.7;
            bld.renderer.u.uWindowColor = [0.5 + 0.5 * c, 0.5, 0.1];
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

    this.use = function(camera, leap) {
        leap.ease = 0.1;
        camera.add(horizon);
    }

    this.dispose = function(camera, leap) {
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

    this.update = function(sound, camera, leap) {

        dayTime += timeSpeed;
        var dayTimeCycle = Math.sin(dayTime) * 0.5 + 0.5; // [0-1]
        // dayTimeCycle = dayTimeCycle * 7 - 3;
        dayTimeCycle = Math.max(0, dayTimeCycle);
        dayTimeCycle = Math.min(1, dayTimeCycle);

        horizon.renderer.u.uDayTime = dayTimeCycle;
        base.renderer.u.uDayTime = dayTimeCycle;


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

        beatLight += (beatLightTarget - beatLight) * 0.3;
        beatSpeed *= 0.975;

        

        var crxb = 0.0;
        var maxr = Math.PI / 8;
        var sh = Math.sin(shake) * 0.2;

        if(leap.isActive) {

            var cpx = SQR.Mathx.clamp((leap.position.x/4), -15, 15);

            // typicaly: 230mm - 60mm (0-170 35+50=85)
            var cy = leap.position.y - 165;
            var cpy = SQR.Mathx.clamp(cy/2, -30, 30);

            var deltaX = (cpx - camera.position.x);
            var deltaY = (cpy - camera.position.y);

            camera.position.x += deltaX * 0.2;
            camera.position.y += deltaY * 0.2;

            camera.rotation.z += (deltaX * 0.1 - camera.rotation.z) * 0.2;
            camera.rotation.x += (deltaY * -0.02  - camera.rotation.x) * 0.2;

        } else {
            camera.position.x *= 0.97;
            camera.position.y *= 0.97;
            camera.rotation.z *= 0.97;
            camera.rotation.x *= 0.97 + sh;
        }

        base.rotation.x -= (leap.isActive) ? 2.5e-3 : 1.5e-3;

        
        for(var i = 0; i < numLanes; i++) {
                lanes[i].rotation.x +=  lanes[i].speed;
                lanes[i].renderer.u.uDayTime = dayTimeCycle;
                lanes[i].renderer.u.uBeat = beatSpeed;
            }



        dx += (dxt - dx) * 0.2;
        dy += (dyt - dy) * 0.2;

        

        bank += 0.02;
        shake += shakeSpeed;
        shakeSpeed *= 0.95;

    }

    this.object = scene;
}