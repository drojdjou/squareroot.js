SQR.Buffer = function(_gl) {

	var b = {};
	var gl = _gl;
	var hasIndex = false;
	var data, indices;
	var buffer, indexBuffer;

	/**
	 *	Example layout: attributes = { aPosition: 3, aColor: 4, aUV: 2 }
	 *	Can also use the constant functions from SQR - ex SQR.v2c3()
	 */
	b.layout = function(attributes, size) {
		b.size = size;
		b.strideSize = 0;
		b.attributes = attributes;

		for(var a in attributes) {
			var aa = { offset: b.strideSize, byteOffset: b.strideSize * 4, size: attributes[a] };
			b.strideSize += attributes[a];
			attributes[a] = aa;
		}

		b.strideByteSize = b.strideSize * 4;
		data = new Float32Array(size * b.strideSize);
		return b;
	}

	b.data = function(attribute, array) {

		if(!(array instanceof Array)) {
			array = Array.prototype.slice.call(arguments, 1);
		}

		var s = b.attributes[attribute];
		var dl = array.length / s.size;

		for(var i = 0; i < dl; i++) {
			for(var j = 0; j < s.size; j++) {
				data[i * b.strideSize + j + s.offset] = array[i * s.size + j];
			}
		}

		return b;
	}

	b.set = function(attribute, position, array) {
		if(array.toArray) {
			array = array.toArray();
		} else if(!(array instanceof Array)) {
			array = Array.prototype.slice.call(arguments, 2);
		}

		var s = b.attributes[attribute];

		for(var j = 0; j < s.size; j++) {
			data[position * b.strideSize + j + s.offset] = array[j];
		}
	}

	b.iterate = function(attribute, callback) {
		var s = b.attributes[attribute];

		for(var i = 0; i < data.length; i += b.strideSize) {
			callback(i + s.offset, data);
		}
	}

	b.bind = function() {
		SQR.gl.bindBuffer(SQR.gl.ARRAY_BUFFER, buffer);
		return b;
	}

	b.update = function() {
		var gl = SQR.gl;

		buffer = buffer || gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

        if(hasIndex) {
        	indexBuffer = gl.createBuffer();
        	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
        }

        return b;
	}

	b.index = function(array) {

		if(!(array instanceof Array)) {
			array = Array.prototype.slice.call(arguments, 0);
		}

		indices = new Uint16Array(array);
		b.indexSize = array.length;
        hasIndex = true;

        return b;
	}

	b.draw = function(mode) {
		var gl = SQR.gl;
		if(hasIndex)
			gl.drawElements(mode || SQR.gl.TRIANGLES, b.indexSize, gl.UNSIGNED_SHORT, 0);
		else 
			gl.drawArrays(mode || SQR.gl.TRIANGLES, 0, b.size);
	}

	b.getDataArray = function() {
		return data;
	}

	return b;

}