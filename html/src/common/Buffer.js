SQR.Buffer = function() {

	var b = {};
	var hasIndex = false;
	var data, indices;
	var buffer, indexBuffer;

	b.mode = SQR.gl.TRIANGLES;

	b.setMode = function(m) {
		b.mode = m
		return b;
	}

	/**
	 *	Example layout: layout = { aPosition: 3, aColor: 4, aUV: 2 }
	 *	Can also use the constant functions from SQR - ex SQR.v2c3()
	 */
	b.layout = function(layout, size) {
		b.size = size;
		b.strideSize = 0;
		b.layout = layout;
		b.attributes = {};

		for(var a in layout) {
			var aa = { offset: b.strideSize, byteOffset: b.strideSize * 4, size: layout[a] };
			b.strideSize += layout[a];
			b.attributes[a] = aa;
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

		return b;
	}

	b.iterate = function(attribute, callback) {
		var s = b.attributes[attribute];
		var c = 0;

		for(var i = 0; i < data.length; i += b.strideSize) {
			callback(i + s.offset, data, c);
			c++;
		}
		return b;
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

	b.isIndexed = function() {
		return hasIndex;
	}

	b.draw = function() {
		var gl = SQR.gl;

		if(hasIndex)
			gl.drawElements(b.mode, b.indexSize, gl.UNSIGNED_SHORT, 0);
		else 
			gl.drawArrays(b.mode, 0, b.size);
	}

	b.setRawData = function(array, offset) {
		data.set(array, offset);
	}

	b.getDataArray = function() {
		return data;
	}

	b.destroy  = function() {
		SQR.gl.deleteBuffer(buffer);
		if(hasIndex) SQR.gl.deleteBuffer(indexBuffer);
	}

	return b;

}