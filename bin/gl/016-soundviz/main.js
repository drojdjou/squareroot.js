var DEBUG = false;//true;

var sound = new SoundAnalyser();

if(!DEBUG) {
    document.querySelector('#instr').style.display = 'none';
}

if(location.search == '?mic') {
    sound.setGainLevels(1, 1);
    sound.connectMic();
} else {
    sound.setGainLevels(1, 1);
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
root.add(camera);

var resetCamera = function() {
    camera.position.set(0, 0, 100);
    camera.rotation.set(0, 0, 0);
}

resetCamera();

//
var visualizer = new VisualizerCollection(root);
visualizer.add('linesphere', new LineSphere(engine));
visualizer.add('strechcube', new StrechingCube(engine));
visualizer.add('skyscraper', new SkyscraperLane(engine));

//
var effect = new EffectCollection();
effect.add('dof', new DepthOfField(engine));
effect.add('glow', new GlowChromaticDist(engine));
effect.add('scanlines', new ScanLines(engine));
effect.add('none', new NoEffect(engine));

var compositions = [
    ['skyscraper', 'glow'],
    ['linesphere', 'dof'],
    ['strechcube', 'scanlines']
];

var compositionIndex = -1;

var next = function() {
    compositionIndex += 1;
    if(compositionIndex >= compositions.length) compositionIndex = 0;

    resetCamera();

    visualizer.use(compositions[compositionIndex][0]);
    effect.use(compositions[compositionIndex][1]);
}

Key.down(Key.SPACE, function() {
    next();
});

next();

sound.onBeat = function() {
    if(DEBUG) debugViz.onBeat();

    visualizer.onBeat(camera);
    effect.onBeat();
}


var loop = function() {
    stats.begin();
    requestAnimFrame(loop);

    SQR.Time.tick();

    sound.update();
    if(DEBUG) debugViz.draw(sound);
    visualizer.update(sound, camera);

    // engine.render(root, camera);
    engine.render(root, camera, { target: target });
    effect.render(target, root, camera);
    

    stats.end();

}

loop();
// setTimeout(loop, 150);








