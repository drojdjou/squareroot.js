SQR.Geometry = function() {

	var b = {}, gl;
	var data = [], byname = {};
	var stride = 0;
	var length = 0, itemCount = 0;
	var typedData, buffer;

	b.setGL = function(_gl) {
		gl = _gl;
		return b;
	}

	b.attribute = function(name, size) {
		var a = { name:name, size:size, offset:stride * 4, items:[] };
		stride += size;
		data.push(a);
		byname[name] = a;
		var ac = {
			add: function() {
				var al = arguments.length;
				length += al;
				if(al != size) throw "> SQR.Geometry. Invalid attribute size. Expected " + size + " found " + al + ".";
				a.items.push(Array.prototype.slice.call(arguments, 0));
				return ac;
			}
		};
		return ac;
	}

	b.createBuffer = function() {

		typedData = new Float32Array(length);
		buffer = gl.createBuffer();

		b.update();

		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, typedData, gl.STATIC_DRAW);

		return b;
	}

	b.bind = function() {
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		return b;
	}

	b.update = function() {
		if(!buffer) throw "> SQR.Geometry call createBuffer before update";
		itemCount = data[0].items.length;

		data.forEach(function(a) {
			if(a.items.length != itemCount) throw "> SQR.Geometry item count mismatch in attributes: " + data[0].name + " has " + itemCount + ", " + a.name + " has " + a.items.length;
			var so = a.offset / 4;
			a.items.forEach(function(d, i) {
				typedData.set(d, i * stride + so);
			});
		});
		
		return b;
	}

	b.data = function() {
		return data;
	}

	b.attr = function(name) {
		return byname[name];
	}

	b.stride = function() {
		return stride * 4;  // 4 bytes per float
	}

	b.draw = function(mode) {
		gl.drawArrays(mode || SQR.TRIANGLES, 0, itemCount);
	}

	return b;

}