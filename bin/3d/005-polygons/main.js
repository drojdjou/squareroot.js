var px = 0, py = 0, pz = 0, cpz = 0;
var pointerX = 0, pointerY = 0;

var engine, camera, geometry, renderer;

var hasLeap = false;

var zero = new SQR.V3();
var temp = new SQR.V3();
var up = new SQR.V3();

var th = 0;
var tempQ = new SQR.Quaternion();

function v(x, y, z) {
    return new SQR.V3(x, y, z);
}

function addPointer(x, y, z) {
    var p1 = new SQR.Transform();
    p1.geometry = geometry;
    p1.renderer = renderer;
    p1.position.set(x, y, z).norm().mul(radius);

    p1.position.copyTo(temp);
    up.set(0,1,0);
    p1.useQuaternion = true;
    p1.rotationQ.lookAt(temp, up);

    return p1;
}

function addRing() {
    var mesh = new SQR.Transform();

    mesh.add(addPointer(0, 10, 0));
    mesh.add(addPointer(0, -10, 0));

    mesh.add(addPointer(10, 0, 0));
    mesh.add(addPointer(-10, 0, 0));

    mesh.add(addPointer(10, 10, 0));
    mesh.add(addPointer(10, -10, 0));
    mesh.add(addPointer(-10, 10, 0));
    mesh.add(addPointer(-10, -10, 0));

    // if(!touch) {
        mesh.add(addPointer(0, 0, 10));
        mesh.add(addPointer(0, 0, -10));

        mesh.add(addPointer(0, 10, 10));
        mesh.add(addPointer(0, 10, -10));
        mesh.add(addPointer(0, -10, 10));
        mesh.add(addPointer(0, -10, -10));

        mesh.add(addPointer(10, 0, 10));
        mesh.add(addPointer(10, 0, -10));
        mesh.add(addPointer(-10, 0, 10));
        mesh.add(addPointer(-10, 0, -10));
    // }

    engine.add(mesh);

    return mesh;
}

var readLeapValues = function(frame) {
    hasLeap = true;
    if(frame.hands.length > 0) {
        var hand = frame.hands[0];

        var rotX = (hand._rotation[2]);
        var rotY = (hand._rotation[1]);
        var rotZ = (hand._rotation[0]);

        var posX = (hand.palmPosition[0]);
        var posY = (hand.palmPosition[2]);
        var posZ = (hand.palmPosition[1]);

        px = posX / 100;
        py = posZ / 100;
        pz = Math.max(0, posY / 8);
    }
};

document.addEventListener('touchmove', function(e) {
    e.preventDefault();
    pointerX = e.targetTouches[0].pageX;
    pointerY = e.targetTouches[0].pageY;
});

document.addEventListener('mousemove', function(e) {
    e.preventDefault();
    pointerX = e.pageX;
    pointerY = e.pageY;
});

function render() {
    requestAnimFrame(render);

    if(!hasLeap) {
        px += pointerX / window.innerWidth;
        py += pointerY / window.innerHeight;
    }


    cpz += (pz - cpz) / 10;

    // Inner rotation around own axis
    for(var i = 0; i < m1.numChildren; i++) {
        var p = m1.children[i].position;
        tempQ.fromAngleAxis(0.001, p.x, p.y, p.z);
        m1.children[i].rotationQ.mul(tempQ);
        m1.children[i].position.norm().mul(7 + cpz * 0.5);
    }

    for(var i = 0; i < m2.numChildren; i++) {
        var p = m2.children[i].position;
        tempQ.fromAngleAxis(-0.002, p.x, p.y, p.z);
        m2.children[i].rotationQ.mul(tempQ);
        m2.children[i].position.norm().mul(25 + cpz);
    }

    m1.rotation.x += (py*2 - m1.rotation.x) / 10;
    m1.rotation.y += (px*2 - m1.rotation.y) / 10;

    m2.rotation.x -= (py + m2.rotation.x) / 10;
    m2.rotation.y -= (px + m2.rotation.y) / 10;

    engine.render(camera);
}

window.addEventListener('resize', function() {
    engine.setSize(window.innerWidth, window.innerHeight);
    engine.setProjection(45);
});

// Action



engine = new SQR.Squareroot(document.getElementById('canvas'), document.getElementById("div-container"));
engine.setBackground('#000000');
engine.setSize(window.innerWidth, window.innerHeight);
engine.setProjection(45);

camera = new SQR.Transform();
camera.position.z = 120;
engine.add(camera);

geometry = new SQR.Geometry();

var blue = new SQR.Color(186, 100, 70);
var red = new SQR.Color(0, 100, 70);

geometry.addTriangle(v(-2, -2, 0), v(0, 0, -1), v(-2, 2, 0), blue);
geometry.addTriangle(v(2, -2, 0), v(0, 0, -1), v(2, 2, 0), blue);

geometry.addTriangle(v(-2, -2, 0), v(0, 0, -1), v(2, -2, 0), blue);
geometry.addTriangle(v(-2, 2, 0), v(0, 0, -1), v(2, 2, 0), blue);

geometry.addTriangle(v(-2, -2, 0), v(0, 0, 6), v(-2, 2, 0), blue);
geometry.addTriangle(v(2, -2, 0), v(0, 0, 6), v(2, 2, 0), blue);

geometry.addTriangle(v(-2, -2, 0), v(0, 0, 6), v(2, -2, 0), blue);
geometry.addTriangle(v(-2, 2, 0), v(0, 0, 6), v(2, 2, 0), blue);

renderer = new SQR.Polygon();
renderer.useLight = true;
radius = window.innerWidth / 100;
m1 = addRing();

geometry = new SQR.Geometry();

geometry.addTriangle(v(-2, -2, 0), v(0, 0, -1), v(-2, 2, 0), red);
geometry.addTriangle(v(2, -2, 0), v(0, 0, -1), v(2, 2, 0), red);

geometry.addTriangle(v(-2, -2, 0), v(0, 0, -1), v(2, -2, 0), red);
geometry.addTriangle(v(-2, 2, 0), v(0, 0, -1), v(2, 2, 0), red);

geometry.addTriangle(v(-2, -2, 0), v(0, 0, 6), v(-2, 2, 0), red);
geometry.addTriangle(v(2, -2, 0), v(0, 0, 6), v(2, 2, 0), red);

geometry.addTriangle(v(-2, -2, 0), v(0, 0, 6), v(2, -2, 0), red);
geometry.addTriangle(v(-2, 2, 0), v(0, 0, 6), v(2, 2, 0), red);

radius = window.innerWidth / 33;
m2 = addRing();

if(window.Leap) {
    Leap.loop(readLeapValues);
}

render();

document.title = "Polygons | v0.26";




















