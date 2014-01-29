var DEBUG = true;

var sound = new SoundAnalyser();

if(location.search == '?mic') {
    sound.connectMic();
} else {
    sound.load('../assets/audio/atari.mp3');
}

var debugViz = new SoundVisualizer(document.querySelector('#viz-canvas'), 128, 64);

var root = new SQR.Transform();

var stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.right = '0px';
stats.domElement.style.top = '0px';
if(DEBUG) document.body.appendChild(stats.domElement);

var engine = new SQR.SquarerootGL(document.getElementById('gl-canvas'));
engine.setSize(window.innerWidth, window.innerHeight);

var target = engine.createFrameBuffer();

var projection = new SQR.ProjectionMatrix();
projection.perspective(45, window.innerWidth/window.innerHeight, 1, 10000);
engine.setProjection(projection);

var camera = new SQR.Transform();
camera.position.z = 100;
root.add(camera);

//
var visualizer = new VisualizerCollection(root);
visualizer.add('linesphere', new LineSphere(engine));
visualizer.add('strechcube', new StrechingCube(engine));

//
var effect = new EffectCollection();
effect.add('dof', new DepthOfField(engine));
effect.add('scanlines', new ScanLines(engine));
effect.add('none', new NoEffect(engine));


// // // // //
visualizer.use('strechcube');
effect.use('scanlines');
// // // // //

var isCube = true;

Key.down(Key.SPACE, function() {

    if(isCube) {
        visualizer.use('linesphere');
        effect.use('dof');
    } else {
        visualizer.use('strechcube');
        effect.use('scanlines');
    }

    isCube = !isCube;
});

sound.onBeat = function() {
    if(DEBUG) debugViz.onBeat();

    visualizer.onBeat();
    effect.onBeat();
}


var loop = function() {
    stats.begin();
    requestAnimFrame(loop);

    SQR.Time.tick();

    sound.update();
    if(DEBUG) debugViz.draw(sound);
    visualizer.update(sound);

    // engine.render(root, camera);
    engine.render(root, camera, { target: target });
    effect.render(target, root, camera);
    

    stats.end();

}

loop();
// setTimeout(loop, 150);








