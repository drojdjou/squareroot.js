/*

       b(0,0,0)
          /\
         /__\
a(-1,2,0)    c(1,2,0)


spline(c1, c2, c3)

sc[
	a.1
	b.2
	c.3
]

sc [
	a.4
	b.5
	c.6
]

for each sc transform by curve matrix

f(sc[1].a, sc[2].b, sc[1].b)
f(sc[1].a, sc[2].a, sc[2].b)

f(sc[1].b, sc[2].c, sc[1].c)
f(sc[1].b, sc[2].b, sc[2].c)

f(sc[1].c, sc[2].a, sc[1].a)
f(sc[1].c, sc[2].c, sc[2].a)


set all sc to aPosition + aOrder
for each face set indices to indices

*/
SQR.Extrude = function() {

	var e = {};

	e.buffer = SQR.Buffer();

	var shape, shapeSize, path, resolution, range, start, end, cap;
	var vertices = [], faces = [];

	e.setPaths = function(_shape, _path, _resolution) {
		shape = _shape;
		shapeSize = _shape.length;
		path = _path;
		resolution = _resolution || 10;
		setVertices();
		return e;
	}

	e.makeCaps = function() {
		// TODO: implement
		return e;
	}

	var setVertices = function() {
		vertices.length = 0;
		faces.length = 0;

		for(var i = 0; i < resolution; i++) {
			for(var j = 0; j < shapeSize; j++) {
				var v = new SQR.V3();
				vertices.push(v);
			}
		}

		for(var i = 0; i < resolution - 1; i++) {
			for(var j = 0; j < shapeSize; j++) {
				// f(sc[1].a, sc[2].b, sc[1].b)
				// f(sc[1].a, sc[2].a, sc[2].b)
				var _1a = i * shapeSize + j;
				var _1b = (j < shapeSize - 1) ? _1a + 1 : i * shapeSize;
				var _2a = (i + 1) * shapeSize + j;
				var _2b = (j < shapeSize - 1) ? _2a + 1 : (i + 1) * shapeSize;

				var f1 = new SQR.Face().setPosition(vertices[_1a], vertices[_2b], vertices[_1b]);
				var f2 = new SQR.Face().setPosition(vertices[_1a], vertices[_2a], vertices[_2b]);

				faces.push(f1, f2);
			}
		}

		e.buffer.layout( {'aPosition': 3, 'aNormal': 3 }, faces.length * 3);
	}

	var update = function(scalingFunc) {

		for(var i = 0; i < resolution; i++) {

			var tg = (i / (resolution - 1));
			var t = start + tg * range;
			var m = path.matrixAt(t);

			for(var j = 0; j < shapeSize; j++) {
				var v = vertices[i * shapeSize + j];
				v.copyFrom(shape[j]);

				if(scalingFunc) scalingFunc(tg, v);
				m.transformVector(v);
			}
		}

		var c = 0;
		for(var i = 0, fl = faces.length; i < fl; i++) {
			c += faces[i].calculateNormal().toBuffer(e.buffer, c);
		}
	}

	e.update = function(_start, _end, _scalingFunc) {
		start = _start || 0;
		end = _end || 1;
		range = (end - start);	
		update(_scalingFunc);
		e.buffer.update();
		return e;
	}

	return e;
}


















