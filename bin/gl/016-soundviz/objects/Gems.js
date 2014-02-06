var Gems = function(engine) {

    var base = new SQR.Transform();
    var icos = [];
    var cameraOrbit = 0, targetPhase = 0;
    var beatTarget = 0, beat = 0;

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
    // icoShader.load("glsl/points.glsl");
    // icoShader.load("glsl/reflection.glsl");
    // icoShader.load("glsl/glass.glsl");
    icoShader.load("016-soundviz/glsl/DiscoBall.glsl");

    

    var skyboxShader = engine.createShader();
    skyboxShader.load("glsl/skybox.glsl");
    // skyboxShader.load("016-soundviz/glsl/DiscoBackground.glsl");

    var skybox = new SQR.Transform();
    skybox.geometry = new SQR.Cube({ skybox:true }).create(1);
    skybox.renderer = engine.createRenderer(skyboxShader);
    skybox.renderer.u.uDistance = projection.far * 0.5;
    skybox.renderer.u.uCubemap = cubemap;
    // base.add(skybox);

    var ico = new SQR.Transform();
    ico.geometry = new SQR.Icosphere({ perVertextNormals:false }).create(100);

    ico.geometry.subdivide();
    ico.geometry.subdivide();
    // ico.geometry.subdivide();
    // ico.geometry.subdivide();

    ico.renderer = engine.createRenderer(icoShader);
    ico.renderer.u.uColor = [1, 0, 0, 1];
    ico.renderer.u.uCubemap = cubemap;

    ico.renderer.transparent = false;
    ico.renderer.srcFactor = 0x0300;
    ico.renderer.dstFactor = 0x0300;

    ico.position.set(0,0,0); 
    ico.useQuaternion = true;
 
    ico.displace = (function(__ico) {
        var _ico = __ico;

        return function(beats, numBeats) {
            var vcs = _ico.geometry.vectors;
            var vl = vcs.length;

            for(var i = 0; i < vl; i++) {
                var v = vcs[i];

                if(!v.phase) v.phase = Math.PI * Math.random() * 2;
                if(!v.max) v.max = 10;// * Math.random();
                if(!v.original) v.original = v.clone();
                if(!v.normalized) v.normalized = v.clone().norm();
                if(!v.beat) v.beat = 0;

                v.beat = Math.max(v.beat, beats[[i % numBeats]]);
                v.set().appendVec(v.normalized).mul( (Math.sin(v.phase) * 0.5 + 0.5) * v.max * (1 + beat * 3)).appendVec(v.original);
                v.phase += 0.1 + beat * 0.1;
                v.beat *= 0.9;
            }

            _ico.geometry.refresh();
        }

    })(ico);

    base.add(ico);

	this.onBeat = function() {
        beatTarget = 1;
    }

    this.use = function() {
    }

    this.dispose = function() {
    }

    var qtmp = new SQR.Quaternion();
    var left = new SQR.V3(1, 0, 0);
    var forward = new SQR.V3(0, 0, 1);
    var icoRx = 0, icoRz = 0;

    this.update = function(sound, camera) {
        beat += (beatTarget - beat) * 0.1;
        beatTarget *= 0.9;

        ico.displace(sound.levelsData, sound.levelsCount);
        ico.renderer.u.uEyePosition = camera.position;

        skybox.renderer.u.uEyePosition = camera.position;

        skybox.renderer.u.uBeat = beat;
        ico.renderer.u.uBeat = beat;

        skybox.renderer.u.uTime = SQR.Time.time * 2;
        ico.renderer.u.uTime = SQR.Time.time * 2;

        var r = 400;

        icoRx = 0.005 + beat * 0.04;
        icoRz = -0.01;

        qtmp.fromAngleAxis(icoRx, left.x, left.y, left.z);
        ico.rotationQ.mul(qtmp);

        qtmp.fromAngleAxis(icoRz, forward.x, forward.y, forward.z);
        ico.rotationQ.mul(qtmp);

        


        ico.position.set(0, 0, -400);
        camera.position.set(0,0,0);
        cameraOrbit += beat * 0.06;
        targetPhase += 0.01;
    }

    this.object = base;
}
















