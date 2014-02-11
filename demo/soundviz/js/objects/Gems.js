var SpaceRing = function(size, num) {

    var PARTICLE_PARAM = "aParticleParam";
    
    var geo = new SQR.Geometry()
    geo.attr(PARTICLE_PARAM, 4);

    var numParticles = 30000;
    
    var params = [];
    for(var i = 0; i < numParticles; i++) {
        params.push(Math.random() * SQR.twoPI, Math.random() * 0.3, Math.random(), Math.random());
    }

    geo.data(PARTICLE_PARAM, params);

    return geo;
};

var Gems = function(engine) {

    var base = new SQR.Transform();
    var gemColor = new SQR.Color();
    var gemTint = 1;


    var beatTarget = 0, beat = 0;
    var handDampTarget = 0, handDamp = 0;


    var target = new SQR.Transform();
    base.add(target);

    var texBasePath = "assets/skybox-blur/";
    var cubemap = engine.createCubemap({
        left:   texBasePath + "left.jpg",
        right:  texBasePath + "right.jpg",
        up:     texBasePath + "up.jpg",
        down:   texBasePath + "down.jpg",
        back:   texBasePath + "back.jpg",
        front:  texBasePath + "front.jpg"
    });

    var icoShader = engine.createShader();
    icoShader.load("glsl/DiscoBall.glsl");

    var ringShader = engine.createShader();
    ringShader.load("glsl/SpaceRing.glsl");

    var ico = new SQR.Transform();
    ico.geometry = new SQR.Icosphere({ perVertextNormals:false }).create(90);

    ico.geometry.subdivide();
    ico.geometry.subdivide();

    ico.renderer = engine.createRenderer(icoShader);
    ico.renderer.u.uCubemap = cubemap;

    base.position.set(0,0,-400); 
    ico.useQuaternion = true;
 
    ico.displace = (function(__ico) {
        var _ico = __ico;

        return function(beats, numBeats, leapActive) {
            var vcs = _ico.geometry.vectors;
            var vl = vcs.length;

            for(var i = 0; i < vl; i++) {
                var v = vcs[i];

                if(!v.phase) v.phase = Math.PI * Math.random() * 2;
                if(!v.max) v.max = 20;// * Math.random();
                if(!v.original) v.original = v.clone();
                if(!v.normalized) v.normalized = v.clone().norm();
                if(!v.beat) v.beat = 0;

                var f = (Math.sin(v.phase) * 0.5 + 0.5) * v.max * (1 + beat * 3);
                if(leapActive) f *= 0.5;

                v.beat = Math.max(v.beat, beats[[i % numBeats]]);
                v.set().appendVec(v.normalized).mul(f).appendVec(v.original);
                v.phase += 0.1 + beat * 0.1;
                v.beat *= 0.9;
            }

            _ico.geometry.refresh();
        }

    })(ico);

    base.add(ico);

    var ring = new SQR.Transform();
    ring.geometry = new SpaceRing();
    ring.renderer = engine.createRenderer(ringShader);
    ring.renderer.renderMode = SQR.GL.POINTS;
    // ring.renderer.transparent = true;
    // base.add(ring); 

	this.onBeat = function() {
        beatTarget = 1;
        ring.renderer.u.uBeat = SQR.Time.time;
    }

    this.use = function() {
    }

    this.dispose = function() {
    }

    var qtmp = new SQR.Quaternion();
    var left = new SQR.V3(1, 0, 0);
    var forward = new SQR.V3(0, 0, 1);
    var icoRx = 0, icoRz = 0;
    var cachedVelocity = new SQR.V3();

    this.update = function(sound, camera, leap) {
        beat += (beatTarget - beat) * 0.1;
        beatTarget *= 0.9;

        handDamp += (handDampTarget - handDamp) * 0.1;
        handDampTarget *= 0.8;

        ico.displace(sound.levelsData, sound.levelsCount, leap.isActive);
        ico.renderer.u.uEyePosition = camera.position;
        ico.renderer.u.uBeat = beat;

        gemTint += 0.008;
        gemColor.hsl((Math.sin(gemTint) * 0.5 + 0.5), 1.0, 0.5).hslToRgb();
        ico.renderer.u.uColor = gemColor;

        ico.renderer.u.uTime = SQR.Time.time * 2;
        ring.renderer.u.uTime = SQR.Time.time;

        if(leap.isActive) {
            handDampTarget = 1;
            cachedVelocity.copyFrom(leap.velocity);
        } else {
            cachedVelocity.mul(0.98);
        }

        icoRx = cachedVelocity.z / -5000;
        icoRz = cachedVelocity.x / 5000;

        // var r = 400;
        // icoRx += beat *  0.02;
        // icoRz += beat * -0.01;

        qtmp.fromAngleAxis(icoRx, left.x, left.y, left.z);
        ico.rotationQ.mul(qtmp);

        qtmp.fromAngleAxis(icoRz, forward.x, forward.y, forward.z);
        ico.rotationQ.mul(qtmp);

        // ring.rotation.x = Math.PI * 0.5;

        // ring.rotation.x += 0.005;
        // ring.rotation.z += 0.002;

        ring.renderer.u.uDamp = 1 - handDamp;

        
        camera.position.set(0,0,0);
    }

    this.object = base;
}
















