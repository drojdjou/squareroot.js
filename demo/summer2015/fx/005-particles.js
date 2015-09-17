var numDots = 350;
var minRadius = 20, maxRadius = 35;
var colFunc = function() {
	return Math.random() > 0.90 ? '#ff0000' : '#ffffff';
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
		wrap: true,
		move: (function() {
			var xd = -0.5 + (0.1 + 0.9 * Math.random());
			var yd =  0.1 + 0.9 * Math.random();
			var xp = Math.random() * Math.PI, xs = 0.01 + 0.03 * Math.random();
			return function(p, c) {
				p.y -= yd;
				c.position.x += xd;
				p.x = c.position.x + Math.sin(xp) * 10;
				xp += xs;
			} 
		})()
	}

	dots.push(d);
}

Feature.create({

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