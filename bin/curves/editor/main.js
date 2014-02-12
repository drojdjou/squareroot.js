/*

Edit single curves
Edit splines
Create dynamic splines - adding points ad infinitum
Extrude along curve/spline
Extrude

*/

var GlobalCursor = (function() {

	var c = {};
	var html = document.querySelector('html');
	var state = 'default';

	c.reset = function() {
		state = 'default';
	}

	c.pointer = function() {
		state = 'pointer';
	}

	c.apply = function() {
		html.style.cursor = state;
	}

	return c;

})();

var ORIGIN = new SQR.V2(window.innerWidth / 2, window.innerHeight / 2);
var EDITMODE = false;

Key.down(Key.SPACE, function() {
	EDITMODE = !EDITMODE;
});

var Bolid = function() {

	var radius = 3;
	var color = new SQR.Color().blue(0.5 +  0.5 * Math.random()).green(0.5 +  0.5 * Math.random()).rgbToHsl().alpha(0.5);

	var speed = 0.0006 + Math.random() * 0.001;
	var position = Math.random();
	var offset = 20, offsetPhase = Math.random() * Math.PI * 2;
	var t = new SQR.V2()

	this.draw = function(context, spline) {

		context.save();

		t.copyFrom(spline.valueAt(position % 1));

		var v = spline.velocityAt(position % 1);
		var orientation = Math.atan2(v.y, v.x);
		
		v.perpendicular();
		v.norm();

		position += speed;
		
		v.mul(offset * Math.sin(offsetPhase));

		offsetPhase += 0.05;



		t.add(t, v);

		context.translate(t.x, t.y);
		context.rotate(orientation);

		// color.lightness(0.1 + 0.4 * (Math.cos(offsetPhase) * 0.5 + 0.5));
		// color.hslToRgb();

		context.fillStyle = color.toCss();
		context.beginPath();

		context.moveTo( 0, -8);
		context.lineTo( 0,  8);
		context.lineTo(30,  0);

		// context.moveTo( 0, -4);
		// context.lineTo( 0,  4);
		// context.lineTo(15,  0);

		context.fill();

		position += speed;

		context.restore();
	}
}

var EditablePoint = function(p, color) {

	this.point = p;

	var that = this;

	var radius = 5;
	var activeRadius = 10;
	var mp = new SQR.V2();
	var hovered = false, active = false;
	var context;
	var track = new SQR.V2();

	document.addEventListener('mousemove', function(e) {
		mp.set(e.pageX - ORIGIN.x, e.pageY - ORIGIN.y);
		hovered = SQR.V2.distanceSqrt(mp, p) < activeRadius * activeRadius;

		if(active) {
			p.x += e.pageX - track.x;
			p.y += e.pageY - track.y;
			track.set(e.pageX, e.pageY);
		}
	});

	document.addEventListener('mousedown', function(e) {
		if(hovered) {
			active = true;
			track.set(e.pageX, e.pageY);
		}
	});

	document.addEventListener('mouseup', function() {
		active = false;
	});

	this.draw = function(context) {
		context.fillStyle = color.toCss();
		context.strokeStyle = color.toCss();
		context.lineWidth = 4;

		if(hovered) GlobalCursor.pointer();

		if(hovered && !active) {
			context.beginPath();
			context.arc(p.x, p.y, activeRadius * 0.75, 0, Math.PI * 2);
			context.stroke();
		} else if(active) {
			context.beginPath();
			context.arc(p.x, p.y, activeRadius, 0, Math.PI * 2);
			context.fill();
		} else {
			context.beginPath();
			context.arc(p.x, p.y, radius, 0, Math.PI * 2);
			context.fill();
		}
	}

}

var EditableCurve = function(p0, c0, c1, p1) {

	var that = this;

	this.curve = new SQR.QuadraticBezier(p0, c0, c1, p1);
	this.resolution = 120;

	this.color = new SQR.Color().grey(0.5);
	this.controlColor = new SQR.Color().red(0.5);

	this.ep0 = new EditablePoint(p0, this.color);
	this.ec0 = new EditablePoint(c0, this.controlColor);
	this.ec1 = new EditablePoint(c1, this.controlColor);
	this.ep1 = new EditablePoint(p1, this.color);

	this.draw = function(context) {
		context.lineWidth = 1;
		context.beginPath();
		context.strokeStyle = this.color.toCss();

		for(var i = 0; i <= this.resolution; i++) {
			var p = this.curve.valueAt(i/this.resolution);
			if(i == 0) context.moveTo(p.x, p.y);
			else context.lineTo(p.x, p.y);
		}

		context.stroke();

		context.strokeStyle = this.controlColor.toCss();
		context.beginPath();
		context.moveTo(p0.x, p0.y);
		context.lineTo(c0.x, c0.y);
		context.stroke();

		context.strokeStyle = this.controlColor.toCss();
		context.beginPath();
		context.moveTo(p1.x, p1.y);
		context.lineTo(c1.x, c1.y);
		context.stroke();

		this.ep0.draw(context);
		this.ec0.draw(context);
		this.ec1.draw(context);
		this.ep1.draw(context);

	}
}

var EditableSpline = function(sp) {

	var that = this;

	this.curve = sp;
	this.resolution = 120;

	this.color = new SQR.Color().grey(0.5);
	this.controlColor = new SQR.Color().red(0.5);

	var cps = [];

	var white = new SQR.Color().grey(1);

	for(var i = 0; i < this.curve.rawPoints.length; i++) {
		cps.push(new EditablePoint(this.curve.rawPoints[i], white));
	}

	this.draw = function(context) {
		context.lineWidth = 1;
		context.beginPath();
		context.strokeStyle = this.color.toCss();

		this.curve.calculateControlPoints();

		for(var i = 0; i <= this.resolution; i++) {
			var p = this.curve.valueAt(i/this.resolution);
			if(i == 0) context.moveTo(p.x, p.y);
			else context.lineTo(p.x, p.y);
		}

		context.stroke();

		for(var i = 0; i < cps.length; i++) {
			var c1 = cps[i].point;
			var j = (i == cps.length-1) ? 0 : i+1;
			var c2 = cps[j].point;


			context.strokeStyle = this.controlColor.toCss();
			context.beginPath();
			context.moveTo(c1.x, c1.y);
			context.lineTo(c2.x, c2.y);
			context.stroke();
		}

		for(var i = 0; i < cps.length; i++) {
			cps[i].draw(context);
		}

	}
}

var canvas = document.querySelector('.sqr');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var context = canvas.getContext('2d');

var k1 = new SQR.V2(200, 100);
var k2 = new SQR.V2(200, -100);
var k3 = new SQR.V2(100, -200);
var k4 = new SQR.V2(-100, -200);
sp = new SQR.Spline(k1, k2, k3, k4);

k1 = new SQR.V2(-200, -100);
k2 = new SQR.V2(-200, 100);
sp.add(k1, k2);

k1 = new SQR.V2(-100, 200);
k2 = new SQR.V2(100, 200);
sp.add(k1, k2);

sp.closePath();

var c = new EditableSpline(sp);

var bolids = [], numBolids = 300;
for(var i = 0; i < numBolids; i++) {
	bolids.push(new Bolid());
}

var run = function() {
	requestAnimFrame(run);

	GlobalCursor.reset();

	context.setTransform(1, 0, 0, 1, 0, 0);

	if(EDITMODE) {
		context.clearRect(0, 0, window.innerWidth, window.innerHeight);
	} else {
		context.fillStyle = 'rgba(0,0,0,0.03)'
		context.fillRect(0, 0, window.innerWidth, window.innerHeight);
	}


	context.translate(ORIGIN.x, ORIGIN.y);

	if(EDITMODE) c.draw(context);

	for(var i = 0; i < numBolids; i++) {
		bolids[i].draw(context, c.curve);
	}

	GlobalCursor.apply();
}

run();




















