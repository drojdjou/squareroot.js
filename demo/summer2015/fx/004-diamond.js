var numRings = 16;
var rings = [];
var max = 450, spacing = 25;

for(var i = 0; i < numRings; i++) {

	var r = {
		type: 'Quad',
		coords: ['50%', '50%']
	}

	var s = max - spacing * i;

	r.size = [s, s];
	r.color = (i % 2 == 0) ? '#ffffff' : '#000000';
	r.rotation = Math.PI * 0.25;

	rings.push(r);

	var inFunc = function() {

		var os = s;
		var ro = Math.PI * 0.5;
		var t = numRings * 80 - i * 80;
		var nt = i * 80;
		var d = i * 60;

		return function(obj) {
			obj.size.x = os * 0.25;
			obj.size.y = os * 0.25;
			obj.rotation = ro;

			var a = SQR.Anm.create(t, { x: os, y: os }).setEase(SQR.Interpolation.quadInOut);
			var b = SQR.Anm.create(numRings * 80, { rotation: 0 }).setEase(SQR.Interpolation.quadInOut);

			a.run(obj.size, d);
			b.run(obj);
		}
	}

	var outFunc = function() {
		
		var os = s;
		var ro = Math.PI * -0.5;
		var t = 1200;
		var nt = numRings * 80 - i * 80;
		var d = i * 60;

		return function(obj) {
			// obj.size.x = os;
			// obj.size.y = os;
			// obj.rotation = 0;

			var a = SQR.Anm.create(t, { x: os * 0.25, y: os * 0.25 }).setEase(SQR.Interpolation.quadOut);
			var b = SQR.Anm.create(numRings * 80, { rotation: ro }).setEase(SQR.Interpolation.quadOut);

			a.run(obj.size, d);
			b.run(obj);
		}
	}

	var loopFunc = function() {
		
		var os = s;
		var ro = Math.PI * 1.25;
		var t = 400;
		var nt = (numRings - i) * 80;
		var d =  (numRings - i) * 60;
		var sc = 1 - (numRings - i) * 0.01;

		return function(obj) {
			// obj.size.x = os;
			// obj.size.y = os;
			obj.rotation = Math.PI * 0.25;

			var a = SQR.Anm.create(t * 1.00, { x: os * sc, y: os * sc }).setEase(SQR.Interpolation.quadIn);
			var c = SQR.Anm.create(t * 1.00, { x: os, y: os }).setEase(SQR.Interpolation.quadOut);
			var b = SQR.Anm.create(t * 2.50, { rotation: ro }).setEase(SQR.Interpolation.quadInOut);

			var runC = function() { c.run(obj.size); };
			a.run(obj.size, d).onEnd(runC);
			b.run(obj, d);
		}
	}

	r.actions = {
		w: loopFunc(),
		e: inFunc(),
		r: outFunc(),
	}
}


Feature.create({

	objects: rings
		// {
		// 	type: 'Quad',
		// 	coords: ['50%', '50%'],
		// 	size: [300, 300],
		// 	rotation: Math.PI * 0.25,
		// 	color: '#ffffff',
		// 	actions: {
		// 		w: function(obj) {
		// 			// obj.ra = 1;
		// 			// obj.rb = 1;
		// 			// var a = SQR.Anm.create(500, { ra: 0 });
		// 			// a.run(obj);
		// 		}
		// 	}
		// }

}).start();