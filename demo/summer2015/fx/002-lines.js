/*

{
	type: 'Line',
	coords: [50, 0, 50, 100],
	color: '#ffffff',
	width: 20,
	actions: {
		q: function(obj) { obj.clear() },
		w: function(obj) {
			obj.ra = 1;
			obj.rb = 1;
			var a = SQR.Anm.create(500, { ra: 0 });
			a.run(obj);
		}
	}
}

*/


var lines = [];
var numLines = 80;
var spacing = 100 / numLines;
var random = spacing * 0.5;
var incline = [-spacing * 0, spacing * 0];

var color = '#ffffff';
var lineWidth = 2;
var alpha = 0.9;

for(var i = 0; i < numLines; i++) {

	var l = {};
	var r = Math.random() * 2 - 1;
	var si = i * spacing, sr = r * random, sc = incline[0] + Math.random() * incline[1];

	l.type = 'Line';
	l.coords = [0, (si+sr) + '%', '100%', (si+sr+sc) + '%'];
	l.color = color;
	l.width = lineWidth;
	l.alpha = alpha;

	lines.push(l);

	var animate = function(isIn, delay) {

		var even = true;// i % 2 == 0;

		var t = 1000 + Math.random() * 500;
		// var d = Math.random() * 1600;
		// var d = isIn ? i * 20 : (numLines - i) * 20;
		delay = delay || 0;
		var d = i * 30 + delay;// : (numLines - i) * 20;

		

		return function(obj) {

			if(isIn) {
				obj.ra = even ? 1 : 0;
				obj.rb = even ? 1 : 0;
			}

			var a = isIn ? 
				SQR.Anm.create(t, { ra: even ? 0 : 1 }).setEase(SQR.Interpolation.smoothStep)
				:
				SQR.Anm.create(t, { rb: even ? 0 : 1 }).setEase(SQR.Interpolation.smoothStep);

			a.run(obj, d);
		}

	};

	l.actions = {

		q: function(obj) { obj.clear() },

		w: (function() {
			var a = animate(true);
			var b = animate(false, 500);
			return function(obj) {
				a(obj);
				b(obj);
			};
		})(),

		e: animate(true),

		r: animate(false)

	}
}

Feature.create({

	root: {
		rotation: 20, scale: 1.5
	},

	objects: lines


}).start();