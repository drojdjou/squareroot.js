Feature.create({

	paths: {
		wave: {
			type: 'Path',
			// coords: ['0%', '50%',   '25%', '25%',  '75%', '75%',   '100%', '50%'],
			coords: ['35%', '100%', '44.5%', '50%', '20%', '30%', 0, 0],
		},

		// wave2: {
		// 	type: 'Path',
		// 	coords: ['65%', '100%', '56.5%', '50%', '80%', '30%', '100%', 0],
		// }
	},

	objects: (function() {

		var numLines = 10; // 20;dw
		var lines = [];

		/*

		{
			type: 'Path',
			path: 'wave',
			offset: 10,
			color: '#ffffff',
			width: 100,
			actions: {
				q: function(obj) { obj.clear() },
				w: function(obj) {
					obj.ra = 0;
					obj.rb = 0;
					var a = SQR.Anm.create(800, { ra: 1 });
					var b = SQR.Anm.create(800, { rb: 1 });
					a.run(obj);
					b.run(obj, 200);
				}
			}
		}

		*/

		for(var i = 0; i < numLines; i++) {

			var l = {};

			var animate = function(mode) {

				var d = i * 20 + Math.random() * 200;
				var t = 2000 + Math.random() * 1000;
				var tt = 200 + Math.random() * 500;

				var ab, bb;

				return function(obj) {

					if(mode != 1) obj.ra = 0;
					if(mode != 1) obj.rb = 0;

					var a = SQR.Anm.create(t, { ra: 1 });
					var b = SQR.Anm.create(t, { rb: 1 });

					if(mode == 0 || mode == 2) a.run(obj, d);
					if(mode == 1 || mode == 2) b.run(obj, d + tt);
				}
			}

			l.type = 'Path';
			// l.path = i % 2 == 1 ? 'wave' : 'wave2';
			l.path = 'wave';

			// l.offset = i * 10 - numLines * 10 / 2;
			l.offset = i * 5 - numLines * 5 / 2;

			l.color = '#ffffff';
			l.width = 2;
			l.actions = {
				q: function(obj) { obj.clear() },
				w: animate(2),
				e: animate(0),
				r: animate(1)
			}

			lines.push(l);

		}

		return lines;
	})()

}).start();