var numDots = 250;
var minRadius = 5, maxRadius = 15;
var offset = -100;
var speedBase = 0.002;
var speedMult = 0.002;
var rotationSpeed = 0.2;
var colFunc = function() {
	return Math.random() > 0.95 ? '#ff0000' : '#ffffff';
}

var dots = [];

for(var i = 0; i < numDots; i++) {

	var f = Math.random()

	var d = {
		type: 'Dot',
		position: new SQR.V2().set(window.innerWidth * Math.random(), window.innerHeight * Math.random()),
		radius: minRadius + (maxRadius - minRadius) * f * f,
		alpha: 0.5 + 0.5 * (1 - f),

		color: colFunc(),

		wrap: false,
		move: (function() {
			var t = Math.random();
			var o = offset * -0.5 + offset * Math.random();
			var ob = Math.PI * Math.random();
			var speed = speedBase + speedMult * Math.random();
			var tmp = new SQR.V2();
			var wn = i % 2 == 0 ? 'wave' : 'wave2';
			return function(p) {
				t += speed;
				if(t > 1) t = 0;
				Feature.paths[wn].curve.valueAt(t, p);

				Feature.paths[wn].curve.velocityAt(t, tmp);
				tmp.norm().mul(Math.sin(ob) * o);
				p.x += tmp.y;
				p.y -= tmp.x;
				ob += rotationSpeed;

			} 
		})()
	}

	dots.push(d);
}

Feature.create({

	paths: {
		wave: {
			type: 'Path',
			// coords: ['0%', '50%',   '25%', '25%',  '75%', '75%',   '100%', '50%'],
			coords: ['35%', '100%', '44.5%', '50%', '20%', '30%', '25%', '10%'],
		},

		wave2: {
			type: 'Path',
			coords: ['65%', '100%', '56.5%', '50%', '80%', '30%', '75%', '10%'],
		}
	},

	objects: dots
		// {
		// 	type: 'Line',
		// 	coords: ['50%', 0, '50%', '100%'],
		// 	color: '#ffffff',
		// 	width: 20,
		// 	actions: {
		// 		q: function(obj) { obj.clear() },
		// 		w: function(obj) {
		// 			obj.ra = 1;
		// 			obj.rb = 1;
		// 			var a = SQR.Anm.create(800, { ra: 0 });
		// 			a.run(obj);
		// 		}
		// 	}
		// }

}).start();