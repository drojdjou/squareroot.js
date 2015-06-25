Feature.create({

	objects: [
		{
			type: 'Line',
			coords: ['50%', 0, '50%', '100%'],
			color: '#ffffff',
			width: 20,
			actions: {
				q: function(obj) { obj.clear() },
				w: function(obj) {
					obj.ra = 1;
					obj.rb = 1;
					var a = SQR.Anm.create(800, { ra: 0 });
					a.run(obj);
				}
			}
		},

		{
			type: 'Line',
			coords: [0, '20%', '100%', '20%'],
			color: '#ffffff',
			width: 20,
			actions: {
				q: function(obj) { obj.clear() },
				w: function(obj) {
					obj.ra = 0.5;
					obj.rb = 0.5;
					var a = SQR.Anm.create(800, { ra: 0, rb: 1 }).setEase(SQR.Interpolation.quadOut);
					a.run(obj, 500);
				}
			}
		}
	]

}).start();